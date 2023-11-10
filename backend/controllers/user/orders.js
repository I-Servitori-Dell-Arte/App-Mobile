const ordersModel = require("../../models/order");
const stripe = require('stripe')('sk_test_51N1TzKKy8OcUrFfrU2mW5nUC3kEBLccBV2974HaHTuylMHFCl7Lw8qBHtJ1ppXlimbFIZ9gSCM8izR2sbKVAJNFG00nytofunW');

module.exports.createPayment = async (req, res) => {
    try {
        const { email } = req.body; // Estrai l'email dai parametri della richiesta
        const customer = await stripe.customers.create({
            email: email, // Utilizza l'email estratta
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000, 
            currency: 'eur', 
            description: 'Esempio di pagamento',
            payment_method_types: ['card'],
            customer: customer.id, // Collega il pagamento al cliente creato
        });

        const clientSecret = paymentIntent.client_secret;
        console.log(clientSecret);

        res.json({ clientSecret: clientSecret });
    } catch (error) {
        console.error(error);
        res.json(error);
    }
}

module.exports.orders = async (req, res) => {
    try{

        const user = req.user
        const orders = await ordersModel.find({user : user._id})
            .populate({path : "user" , select : "-password -token"})
            .populate("items.productId")
            .populate("items.categoryId")

        return res.json({
            success : true,
            message : "orders",
            data : orders
        })

    }catch(error){
        return res.send(error.message)
    }
}