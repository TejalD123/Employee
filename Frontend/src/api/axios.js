import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000',
});

export const getEmployees = () => http.get('/employees').then((r) => r.data);
export const createEmployee = (data) => http.post('/employees', data).then((r) => r.data);
export const updateEmployee = (id, data) => http.put(`/employees/${id}`, data).then((r) => r.data);
export const deleteEmployee = (id) => http.delete(`/employees/${id}`);