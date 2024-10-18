import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../../utils/mutations';
import {
  calculateElectricityEmissions,
  calculateFlightEmissions,
  calculateVehicleEmissions,
  calculateShippingEmissions,
  getVehicleMakes,
  getVehicleModels
} from '../../utils/api/emissions';
import './../../styles/CarbonCalculator.css';

const CarbonCalculator = () => {
  const [calculationType, setCalculationType] = useState('electricity');
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [vehicleMakes, setVehicleMakes] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [updateUser] = useMutation(UPDATE_USER);

  useEffect(() => {
    if (calculationType === 'vehicle') {
      setIsLoading(true);
      getVehicleMakes()
        .then(data => {
          setVehicleMakes(data.data || []);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching vehicle makes:", err);
          setError("Failed to load vehicle makes");
          setIsLoading(false);
        });
    }
  }, [calculationType]);

  useEffect(() => {
    if (formData.vehicleMake) {
      setIsLoading(true);
      getVehicleModels(formData.vehicleMake)
        .then(data => {
          setVehicleModels(data.data || []);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching vehicle models:", err);
          setError("Failed to load vehicle models");
          setIsLoading(false);
        });
    }
  }, [formData.vehicleMake]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);
    let response;

    try {
      switch (calculationType) {
        case 'electricity':
          response = await calculateElectricityEmissions(
            formData.electricityValue,
            formData.electricityUnit,
            formData.country,
            formData.state
          );
          break;
        case 'flight':
          response = await calculateFlightEmissions(
            formData.passengers,
            formData.departure,
            formData.destination
          );
          break;
        case 'vehicle': {
          const selectedModel = vehicleModels.find(model => 
            model.data.attributes.name === formData.vehicleModel &&
            model.data.attributes.year === parseInt(formData.vehicleYear)
          );
          if (!selectedModel) throw new Error('Invalid vehicle selection');
          response = await calculateVehicleEmissions(
            formData.distance,
            selectedModel.data.id
          );
          break;
        }
        case 'shipping':
          response = await calculateShippingEmissions(
            formData.weight,
            'lb', // Default to pounds
            formData.distance,
            'mi', // Default to miles
            formData.transportMethod // Selected transport method from the dropdown
          );
          break;
        default:
          throw new Error('Invalid calculation type');
      }

      if (response && response.data) {
        setResult(response.data.attributes);
        
        // Save the carbon data
        try {
          await updateUser({
            variables: { 
              carbonData: {
                carbon_kg: response.data.attributes.carbon_kg
              }
            },
          });
        } catch (err) {
          console.error("Error updating carbon data:", err);
        }
      } else {
        throw new Error('No data received from the API');
      }
    } catch (err) {
      console.error("Error calculating emissions:", err);
      setError(err.message || "An error occurred while calculating emissions.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="carbon-calculator">
      <h2>Carbon Footprint Calculator</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={calculationType}
          onChange={(e) => setCalculationType(e.target.value)}
          className="select-input"
        >
          <option value="electricity">Electricity</option>
          <option value="flight">Flight</option>
          <option value="vehicle">Vehicle</option>
          <option value="shipping">Shipping</option>
        </select>

        {calculationType === 'electricity' && (
          <>
            <input type="number" name="electricityValue" placeholder="Electricity Value" onChange={handleInputChange} required />
            <select name="electricityUnit" onChange={handleInputChange} required>
              <option value="">Select Unit</option>
              <option value="mwh">Megawatt Hours (MWh)</option>
              <option value="kwh">Kilowatt Hours (kWh)</option>
            </select>
            <input type="text" name="country" placeholder="Country Code" onChange={handleInputChange} required />
            <input type="text" name="state" placeholder="State Code (optional)" onChange={handleInputChange} />
          </>
        )}

        {calculationType === 'flight' && (
          <>
            <input type="number" name="passengers" placeholder="Number of Passengers" onChange={handleInputChange} required />
            <input type="text" name="departure" placeholder="Departure Airport Code (e.g., SAT)" onChange={handleInputChange} required />
            <input type="text" name="destination" placeholder="Destination Airport Code (e.g., DEN)" onChange={handleInputChange} required />
          </>
        )}

        {calculationType === 'vehicle' && (
          <>
            <select name="vehicleMake" onChange={handleInputChange} required>
              <option value="">Select Make</option>
              {vehicleMakes && vehicleMakes.map(make => (
                <option key={make.data.id} value={make.data.id}>{make.data.attributes.name}</option>
              ))}
            </select>
            {formData.vehicleMake && vehicleModels && vehicleModels.length > 0 && (
              <select name="vehicleYear" onChange={handleInputChange} required>
                <option value="">Select Year</option>
                {[...new Set(vehicleModels.map(model => model.data.attributes.year))]
                  .sort((a, b) => b - a)
                  .map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))
                }
              </select>
            )}
            {formData.vehicleYear && vehicleModels && vehicleModels.length > 0 && (
              <select name="vehicleModel" onChange={handleInputChange} required>
                <option value="">Select Model</option>
                {vehicleModels
                  .filter(model => model.data.attributes.year === parseInt(formData.vehicleYear))
                  .map(model => (
                    <option key={model.data.id} value={model.data.attributes.name}>{model.data.attributes.name}</option>
                  ))
                }
              </select>
            )}
            <input type="number" name="distance" placeholder="Distance (miles)" onChange={handleInputChange} required />
          </>
        )}

        {calculationType === 'shipping' && (
          <>
            <input
              type="number"
              name="weight"
              placeholder="Weight (lb)"
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="distance"
              placeholder="Distance (miles)"
              onChange={handleInputChange}
              required
            />
            <select
              name="transportMethod"
              onChange={handleInputChange}
              required
            >
              <option value="">Select Transport Method</option>
              <option value="ship">Ship</option>
              <option value="train">Train</option>
              <option value="truck">Truck</option>
              <option value="plane">Plane</option>
            </select>
          </>
        )}

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>

      {error && (
        <div className="error">
          <p>Error: {error}</p>
        </div>
      )}

      {result && (
        <div className="result">
          <h3>Result:</h3>
          <p>Carbon Emissions: {result.carbon_kg} kg CO2</p>
        </div>
      )}
    </div>
  );
};

export default CarbonCalculator;