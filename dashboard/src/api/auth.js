import axios from "./axios";

export const registerUser = (data) => axios.post("/auth/register", data);
export const loginUser = (data) => axios.post("/auth/login", data);
export const getPractitionerSetupStatus = () => axios.get("/auth/bootstrap-status");
export const bootstrapPractitioner = (data) => axios.post("/auth/bootstrap", data);

export const requestPractitionerPasswordReset = (email) =>
  axios.post("/auth/request-password-reset", { email });

export const resetPractitionerPassword = (token, password) =>
  axios.post("/auth/reset-password", { token, password });
