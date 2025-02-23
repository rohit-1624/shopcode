const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const Razorpay = require("razorpay")

const instance = new Razorpay({
    key_id: 'rzp_test_x4CFM9QD0dIlUp',
    key_secret: 'YdsrnientoxQ0THcJsWTsLc4'
})

app.listen(8080)
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.post('/order', async (req, res) => {
    try{
        const newOrder = await instance.orders.create({
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: ' CO_RP_' + Date.now()
        })
        res.json({
            amount: newOrder.amount,
            orderId: newOrder.id
        })
    }
    
    catch(err)
    {
        console.log(err)
        res.status(500).json(err)
    }
})

app.get("/", (req, res) => {
    res.send("Backend is working!");
});


app.get('/payments', async (req, res) => {
    try{
        const payments = await instance.payments.all()
        res.json(payments)
    }
    
    catch(err)
    {
        console.log(err)
        res.status(500).json(err)
    }
})