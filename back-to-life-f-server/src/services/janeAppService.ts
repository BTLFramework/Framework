import axios from "axios";

const JANE_API_BASE_URL = "https://your-janeapp-api-url.com"; // Replace with actual JaneApp API base URL
const JANE_API_KEY = process.env.JANE_API_KEY; // Store your JaneApp API key in .env

const janeApi = axios.create({
  baseURL: JANE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${JANE_API_KEY}`,
    "Content-Type": "application/json",
  },
});

// Example: Fetch practitioners
export const getPractitioners = async () => {
  const response = await janeApi.get("/practitioners");
  return response.data;
};

// Add more endpoint functions as needed
