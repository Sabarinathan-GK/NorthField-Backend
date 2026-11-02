const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const allowedOrigins = (process.env.CLIENT_URL)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback){
        if(!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("This origin is not allowed by the CORS policy"));
    }
}));

app.use(express.json({ limit : "100kb" }));

app.get("/", (req, res)=>{
    res.status(200).json({
        success : true,
        message : "Northfield Backend Sever is running"
    });
})

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) =>{
    res.status(404).json({
        success : false,
        message : `Route not found :${req.method} ${req.originalUrl}`
    });
});

app.use(errorHandler);

module.exports = app;