const productModel = require("../../models/product");
const User = require('../../models/user');

module.exports.addProduct = async (req, res) => {
    console.log(req.body);
    try{

        const {title, sku, image} = req.body;

        if(!title || !sku) return res.send("Fields are empty")

        let product = new productModel(req.body)
        product.save()

        return res.json({
            success : true,
            message : "Prodotto inserito con successo",
            data : product
        })

    }catch(error){
        return res.send(error.message)
    }
}

module.exports.getProducts = async (req, res) => {
    try{

        const products = await productModel.find();
        const productsCount = await productModel.find().count();

        return res.json({
            success : true,
            status : 400,
            message : "list of all products",
            products,
            count : productsCount
        })

    }catch(error){
        return res.send(error.message)
    }
}


module.exports.updateProduct = async (req, res) => {
    try{

        const {title, sku, price, image} = req.body;
        const {id} = req.query;

        // check if product exist with the given product id
        const product = await productModel.findOne({_id : id})

        if(product){
            const updatedProduct = await productModel.findOneAndUpdate({_id : id}, req.body, {new :true})

            return res.json({
                success : true,
                status : 200,  
                message : "product updated successfully",
                data : updatedProduct
            })
        }else{
            
            return res.json({
                success : false,
                status : 400,
                message : "product does not exist"
            })

        }

    }catch(error){
        return res.send(error.message)
    }
}

module.exports.deleteProduct = async (req, res) => {
    try{

        const {id} = req.query;
        
        // check if product exist with the given product id
        const product = await productModel.findOneAndDelete({_id : id})
        const users = await User.find();
        
        if(!product){
            return res.json({
                success : false,
                message : "Il prodotto non esiste",
            })
        }
        return res.json({
            success : true,
            message : "Prodotto eliminato correttamente",
        })

    }catch(error){
        return res.send(error.message)
    } 
}

module.exports.getAllProducts = async (req, res) => {
    try{

        // Search through title names
        var {search} = req.query
        if(!search) search = ""

        const products = await productModel.find({title:{'$regex' : search, '$options' : 'i'}})
            .populate("category")

        return res.json({
            success : true,
            status : 200,
            message : "list of products",
            data : products
        })

    }catch(error){
        return res.json({
            success : false,
            status : 400,
            message : error.message
        })
    }
}

