import { makeRequest } from './carboninterface';

const API_KEY = import.meta.env.VITE_CARBON_INTERFACE_API_KEY;

export const calculateFlightEmissions = (passengers, departure, destination) =>
  makeRequest('/estimates', {
    type: 'flight',
    passengers: parseInt(passengers, 10),
    legs: [
      {
        departure_airport: departure.toUpperCase(),
        destination_airport: destination.toUpperCase()
      }
    ]
  }, API_KEY);

export const calculateVehicleEmissions = (distance, vehicleModelId, distanceUnit = 'mi') =>
  makeRequest('/estimates', {
    type: 'vehicle',
    distance_value: distance,
    vehicle_model_id: vehicleModelId,
    distance_unit: distanceUnit,
  }, API_KEY);

export const calculateShippingEmissions = (weight, weightUnit = 'lb', distance, distanceUnit = 'mi', transportMethod) =>
  makeRequest('/estimates', {
    type: 'shipping',
    weight_value: weight,
    weight_unit: weightUnit,
    distance_value: distance,
    distance_unit: distanceUnit,
    transport_method: transportMethod,
  }, API_KEY);

  
export const getVehicleMakes = () =>
  makeRequest('/vehicle_makes', null, API_KEY, 'GET');

export const getVehicleModels = (makeId) =>
  makeRequest(`/vehicle_makes/${makeId}/vehicle_models`, null, API_KEY, 'GET');

// Helper function to get vehicle model ID
export const getVehicleModelId = async (make, model, year) => {
  const models = await getVehicleModels(make);
  const selectedModel = models.find(m => m.name === model && m.year === parseInt(year));
  return selectedModel ? selectedModel.id : null;
};