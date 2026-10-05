import client from "./client";

// Marketplaces - kept for compatibility
const saveAsTemplate = (body) => client.post("/marketplaces/templates", body);

export default {
  saveAsTemplate,
};
