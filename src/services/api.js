import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getTransactions = (params) => API.get("/transactions", { params });

export const addTransaction = (data) => API.post("/transactions", data);

export const editTransaction = (id, data) =>
  API.put(`/transactions/${id}`, data);
