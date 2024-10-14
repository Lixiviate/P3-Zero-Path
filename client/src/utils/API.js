// Make a request to the Carbon Interface API
export const getCarbonEmissions = (params) => {
  return fetch("https://www.carboninterface.com/api/v1/estimates", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_CARBON_INTERFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
};
