
//calculate Electricity emissions
export const calculateElectricityEmissions = async (electricityValue, unit = "kwh", country = "us", state = "") => {
  try {
    const response = await fetch("https://www.carboninterface.com/api/v1/estimates", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_CARBON_INTERFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "electricity",
        electricity_unit: unit,
        electricity_value: electricityValue,
        country,
        state,
      }),
    });

    return response.json();
  } catch (error) {
    console.error("Error calculating electricity emissions", error);
    return null;
  }
};

//calculate Flight emissions

export const calculateFlightEmissions = async (passengers, legs) => {
  try {
    const response = await fetch("https://www.carboninterface.com/api/v1/estimates", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_CARBON_INTERFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "flight",
        passengers,
        legs,
      }),
    });

    return response.json();
  } catch (error) {
    console.error("Error calculating flight emissions", error);
    return null;
  }
};

//calculate Vehicle emissions

export const calculateVehicleEmissions = async (distance, vehicleModelId, distanceUnit = "mi") => {
  try {
    const response = await fetch("https://www.carboninterface.com/api/v1/estimates", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_CARBON_INTERFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "vehicle",
        distance_value: distance,
        vehicle_model_id: vehicleModelId,
        distance_unit: distanceUnit,
      }),
    });

    return response.json();
  } catch (error) {
    console.error("Error calculating vehicle emissions", error);
    return null;
  }
};

//calculate Shipping emissions

export const calculateShippingEmissions = async (weight, weightUnit, distance, distanceUnit, transportMethod) => {
  try {
    const response = await fetch("https://www.carboninterface.com/api/v1/estimates", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_CARBON_INTERFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "shipping",
        weight_value: weight,
        weight_unit: weightUnit,
        distance_value: distance,
        distance_unit: distanceUnit,
        transport_method: transportMethod,
      }),
    });

    return response.json();
  } catch (error) {
    console.error("Error calculating shipping emissions", error);
    return null;
  }
};

