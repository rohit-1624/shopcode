require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Razorpay = require("razorpay");

const app = express();
const PORT = process.env.PORT || 8080;

const instance = new Razorpay({
    key_id: process.env.rzp_test_x4CFM9QD0dIlUp,
    key_secret: process.env.YdsrnientoxQ0THcJsWTsLc4
});

app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/order', async (req, res) => {
    try {
        console.log("Received order request for amount:", req.body.amount);
        
        const newOrder = await instance.orders.create({
            amount: req.body.amount * 100, // Convert to paise
            currency: "INR",
            receipt: 'CO_RP_' + Date.now()
        });

        res.json({
            amount: newOrder.amount,
            orderId: newOrder.id
        });
    } catch (err) {
        console.error("Order creation error:", err);
        res.status(500).json({ error: "Internal Server Error", details: err });
    }
});

app.get("/", (req, res) => {
    res.send("Backend is working!");
});

app.get('/payments', async (req, res) => {
    try {
        const payments = await instance.payments.all();
        res.json(payments);
    } catch (err) {
        console.error("Payment fetch error:", err);
        res.status(500).json({ error: "Internal Server Error", details: err });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
