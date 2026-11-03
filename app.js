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

// Configure CORS to permit your Netlify frontend
const corsOptions = {
  origin: 'https://northfieldshop.netlify.app',
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

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