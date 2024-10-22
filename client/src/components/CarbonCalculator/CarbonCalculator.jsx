import { useState, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "../../utils/mutations";
import {
 calculateFlightEmissions,
 calculateVehicleEmissions,
 calculateShippingEmissions,
} from "../../utils/api/emissions";

const VEHICLE_EMISSION_FACTORS = {
 suv: 0.328,
 truck: 0.503,
 car: 0.4,
};

const CALCULATION_TYPES = {
 FLIGHT: "flight",
 VEHICLE: "vehicle",
 SHIPPING: "shipping",
};

const TRANSPORT_METHODS = ["ship", "train", "truck", "plane"];

// Simple Slide Panel component
const SlidePanel = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 transition-opacity z-40"
          onClick={onClose}
        />
      )}
      
      <div className={`fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-semibold">Calculation History</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close history panel"
            >
              <span className="text-gray-500 hover:text-gray-700">✕</span>
            </button>
          </div>
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

const CarbonCalculator = () => {
 const [calculationType, setCalculationType] = useState(CALCULATION_TYPES.FLIGHT);
 const [result, setResult] = useState(null);
 const [formData, setFormData] = useState({});
 const [error, setError] = useState(null);
 const [isLoading, setIsLoading] = useState(false);
 const [successMessage, setSuccessMessage] = useState("");
 const [calculationHistory, setCalculationHistory] = useState([]);
 const [isHistoryOpen, setIsHistoryOpen] = useState(false);

 const [updateUser] = useMutation(UPDATE_USER);

 const validateInputs = useCallback(() => {
   if (calculationType === CALCULATION_TYPES.FLIGHT) {
     if (!formData.departure?.match(/^[A-Z]{3}$/) || !formData.destination?.match(/^[A-Z]{3}$/)) {
       throw new Error("Airport codes must be 3 uppercase letters");
     }
     if (!formData.passengers || formData.passengers <= 0) {
       throw new Error("Number of passengers must be positive");
     }
   }

   if (calculationType === CALCULATION_TYPES.VEHICLE) {
     if (!formData.vehicleType) {
       throw new Error("Please select a vehicle type");
     }
     if (!formData.distance || formData.distance <= 0) {
       throw new Error("Distance must be positive");
     }
   }

   if (calculationType === CALCULATION_TYPES.SHIPPING) {
     if (!formData.weight || formData.weight <= 0) {
       throw new Error("Weight must be positive");
     }
     if (!formData.distance || formData.distance <= 0) {
       throw new Error("Distance must be positive");
     }
     if (!formData.transportMethod) {
       throw new Error("Please select a transport method");
     }
   }
 }, [calculationType, formData]);

 const handleInputChange = (e) => {
   const { name, value } = e.target;
   setFormData(prev => ({
     ...prev,
     [name]: name === "passengers" || name === "distance" || name === "weight"
       ? parseFloat(value)
       : value
   }));
   setError(null);
   setSuccessMessage("");
 };

 const calculateEmissions = async () => {
  switch (calculationType) {
    case CALCULATION_TYPES.FLIGHT:
      return await calculateFlightEmissions(
        formData.passengers,
        formData.departure.toUpperCase(),
        formData.destination.toUpperCase()
      );

    case CALCULATION_TYPES.VEHICLE: {
      // Convert the vehicle type to a model ID as expected by the API
      let vehicleModelId;
      switch (formData.vehicleType) {
        case 'truck':
          vehicleModelId = '7268a9b7-17e8-4c8d-acca-57059252afe9'; 
          break;
        case 'car':
          vehicleModelId = 'a2d97d19-14c0-4c60-870c-e734796e014e'; 
          break;
        case 'suv':
          vehicleModelId = '14949244-b6d1-4a11-970f-73f75408f931'; 
          break;
        default:
          throw new Error("Invalid vehicle type");
      }
      
      return await calculateVehicleEmissions(
        formData.distance,
        vehicleModelId
      );
    }

    case CALCULATION_TYPES.SHIPPING:
      return await calculateShippingEmissions(
        formData.weight,
        "lb",
        formData.distance,
        "mi",
        formData.transportMethod
      );

    default:
      throw new Error("Invalid calculation type");
  }
};
 const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setResult(null);
  setSuccessMessage("");
  setIsLoading(true);

  try {
    validateInputs();
    const response = await calculateEmissions();

    if (response?.data) {
      const resultData = response.data.attributes;
      setResult(resultData);
      
      // Add to history
      const historyItem = {
        type: calculationType,
        result: resultData,
        timestamp: new Date().toISOString(),
        details: { ...formData }
      };
      setCalculationHistory(prev => [historyItem, ...prev].slice(0, 10));

      // Update user data
      await updateUser({
        variables: {
          carbonData: {
            carbon_kg: resultData.carbon_kg || resultData.carbon_g / 1000,
          },
        },
      });

      setSuccessMessage("Calculation completed successfully!");
    } else {
      throw new Error("No data received from the API");
    }
  } catch (err) {
    console.error("Error calculating emissions:", err);
    setError(err.message || "An error occurred while calculating emissions.");
  } finally {
    setIsLoading(false);
  }
};

const handleReset = () => {
  setFormData({});
  setResult(null);
  setError(null);
  setSuccessMessage("");
};

const renderHistoryPanel = () => {
  if (calculationHistory.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No calculations yet
      </div>
    );
  }

  return (
    <div className="divide-y">
      {calculationHistory.map((item, index) => (
        <div key={index} className="p-6 hover:bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-medium">
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </span>
            <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {item.result.carbon_kg || Math.round(item.result.carbon_g / 1000)} kg CO2
            </span>
          </div>
          
          <div className="text-sm text-gray-600">
            {item.type === CALCULATION_TYPES.FLIGHT && (
              <>
                <p>From: {item.details.departure} To: {item.details.destination}</p>
                <p>Passengers: {item.details.passengers}</p>
              </>
            )}
            {item.type === CALCULATION_TYPES.VEHICLE && (
              <>
                <p>Vehicle: {item.details.vehicleType}</p>
                <p>Distance: {item.details.distance} miles</p>
              </>
            )}
            {item.type === CALCULATION_TYPES.SHIPPING && (
              <>
                <p>Weight: {item.details.weight} lb</p>
                <p>Distance: {item.details.distance} miles</p>
                <p>Method: {item.details.transportMethod}</p>
              </>
            )}
          </div>
          
          <div className="mt-2 text-xs text-gray-400">
            {new Date(item.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};
const renderInputFields = () => {
  const commonInputClasses = "w-full p-3 text-lg rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  switch (calculationType) {
    case CALCULATION_TYPES.FLIGHT:
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Passengers
            </label>
            <input
              type="number"
              name="passengers"
              placeholder="Enter number of passengers"
              value={formData.passengers || ""}
              onChange={handleInputChange}
              className={commonInputClasses}
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure Airport
            </label>
            <input
              type="text"
              name="departure"
              placeholder="e.g., LAX"
              value={formData.departure || ""}
              onChange={handleInputChange}
              className={commonInputClasses}
              pattern="[A-Za-z]{3}"
              maxLength="3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination Airport
            </label>
            <input
              type="text"
              name="destination"
              placeholder="e.g., JFK"
              value={formData.destination || ""}
              onChange={handleInputChange}
              className={commonInputClasses}
              pattern="[A-Za-z]{3}"
              maxLength="3"
              required
            />
          </div>
        </div>
      );

    case CALCULATION_TYPES.VEHICLE:
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type
            </label>
            <select 
              name="vehicleType" 
              value={formData.vehicleType || ""}
              onChange={handleInputChange} 
              className={commonInputClasses}
              required
            >
              <option value="">Select Vehicle Type</option>
              {Object.entries(VEHICLE_EMISSION_FACTORS).map(([type, factor]) => (
                <option key={type} value={type}>
                  {type.toUpperCase()} ({factor} kg CO2/mile)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distance
            </label>
            <input
              type="number"
              name="distance"
              placeholder="Enter distance in miles"
              value={formData.distance || ""}
              onChange={handleInputChange}
              className={commonInputClasses}
              min="0.1"
              step="0.1"
              required
            />
          </div>
        </div>
      );

    case CALCULATION_TYPES.SHIPPING:
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight
            </label>
            <input
              type="number"
              name="weight"
              placeholder="Enter weight in pounds"
              value={formData.weight || ""}
              onChange={handleInputChange}
              className={commonInputClasses}
              min="0.1"
              step="0.1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distance
            </label>
            <input
              type="number"
              name="distance"
              placeholder="Enter distance in miles"
              value={formData.distance || ""}
              onChange={handleInputChange}
              className={commonInputClasses}
              min="0.1"
              step="0.1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transport Method
            </label>
            <select
              name="transportMethod"
              value={formData.transportMethod || ""}
              onChange={handleInputChange}
              className={commonInputClasses}
              required
            >
              <option value="">Select Transport Method</option>
              {TRANSPORT_METHODS.map(method => (
                <option key={method} value={method}>
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      );

    default:
      return null;
  }
};

return (
  <div className="max-w-2xl mx-auto p-4 mb-20">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Carbon Footprint Calculator
          </h2>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="ml-6 px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
          >
            View History
          </button>
        </div>

        
        
        {/* Type selector */}
        <div className="mt-8">
          <select
            value={calculationType}
            onChange={(e) => {
              setCalculationType(e.target.value);
              handleReset();
            }}
            className="w-full p-3 text-lg rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(CALCULATION_TYPES).map(([key, value]) => (
              <option key={key} value={value}>
                Calculate {key.charAt(0) + key.slice(1).toLowerCase()} Emissions
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main content */}
      <div className="p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input fields with better spacing */}
          <div className="space-y-4">
            {renderInputFields()}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Calculating..." : "Calculate"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Messages */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-100">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-lg bg-green-50 text-green-700 border border-green-100">
            {successMessage}
          </div>
        )}

        {/* Results with better visualization */}
        {result && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Results</h3>
            <div className="space-y-3">
              <p className="text-3xl font-bold text-blue-700">
                {result.carbon_g 
                  ? Math.round(result.carbon_g / 1000)
                  : Math.round(result.carbon_kg)} kg CO2
              </p>
              {calculationType === CALCULATION_TYPES.FLIGHT && (
                <p className="text-lg text-blue-600">
                  Per passenger: {Math.round((result.carbon_kg || result.carbon_g/1000) / formData.passengers)} kg CO2
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>

    {/* History Panel */}
    <SlidePanel 
      isOpen={isHistoryOpen} 
      onClose={() => setIsHistoryOpen(false)}
    >
      {renderHistoryPanel()}
    </SlidePanel>
  </div>
);
};

export default CarbonCalculator;