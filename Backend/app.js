import express from "express";
import cors from "cors";

import employeeRoutes from "./routes/employeeRoutes.js";



const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Employee Management API is running"
    });
});

// Employee routes
app.use("/employees", employeeRoutes);

export default app;