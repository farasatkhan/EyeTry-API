

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
exports.processPayment = async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount * 100,
        currency: "pkr",
        payment_method_types: ['card'], 
        metadata: {
            company: "Ecommerce",
        },
    });
        res.status(200)
        .json({ success: true, client_secret: myPayment.client_secret });
};


exports.sendstripeApiKey = async (req, res, next) => { 
    res.status(200)
    .json({ stripeApiKey: process.env.STRIPE_API_KEY })
};