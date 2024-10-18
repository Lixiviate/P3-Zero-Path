import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../../utils/mutations';
import {
  calculateElectricityEmissions,
  calculateFlightEmissions,
  calculateVehicleEmissions,
  calculateShippingEmissions,
} from '../../utils/api/emissions';
import './../../styles/CarbonCalculator.css';

//  standard emissions factors for vehicle types
const vehicleEmissionFactors = {
  suv: 0.328,  // Example value: kg CO2 per mile
  truck: 0.503,  // Example value: kg CO2 per mile
  car: 0.4,   // Example value: kg CO2 per mile
};

const CarbonCalculator = () => {
  const [calculationType, setCalculationType] = useState('electricity');
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [updateUser] = useMutation(UPDATE_USER);

  // Handle form data changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
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
          const emissionFactor = vehicleEmissionFactors[formData.vehicleType];
          if (!emissionFactor) throw new Error('Invalid vehicle type');
          const emissions = formData.distance * emissionFactor;  // Calculate emissions based on distance and emission factor
          response = { data: { attributes: { carbon_kg: emissions } } };  // Mock response based on the calculated emissions
          break;
        }
        case 'shipping':
          response = await calculateShippingEmissions(
            formData.weight,
            'lb', // Default to pounds
            formData.distance,
            'mi', // Default to miles
            formData.transportMethod
          );
          break;
        default:
          throw new Error('Invalid calculation type');
      }

      if (response && response.data) {
        setResult(response.data.attributes);
        // Save carbon data
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
            <input type="text" name="departure" placeholder="Departure Airport Code" onChange={handleInputChange} required />
            <input type="text" name="destination" placeholder="Destination Airport Code" onChange={handleInputChange} required />
          </>
        )}

        {calculationType === 'vehicle' && (
          <>
            {/* Predefined vehicle type dropdown */}
            <select name="vehicleType" onChange={handleInputChange} required>
              <option value="">Select Vehicle Type</option>
              <option value="suv">SUV</option>
              <option value="truck">Truck</option>
              <option value="car">Car</option>
            </select>

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
          {result.carbon_kg && (
            <p>Total Emissions: {Math.round(result.carbon_kg)} kg CO2</p> // Vehicle or general case
          )}
          {result.carbon_g && (
            <p>Total Emissions: {Math.round(result.carbon_g / 1000)} kg CO2</p> // Shipping might return grams
          )}
        </div>
      )}

    </div>
  );
};

export default CarbonCalculator;