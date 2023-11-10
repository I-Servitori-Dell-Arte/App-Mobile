const orderModel = require("../../models/order")
const userModel = require("../../models/user")
const productModel = require("../../models/product")
const categoryModel = require("../../models/category")
const tesseraModel = require('../../models/tessera');

module.exports.dashboardData = async (req, res) => {

    try{

        // counts 
        const ordersCount = await orderModel.find().count()
        const usersCount = await userModel.find().count()
        const productsCount = await productModel.find().count()
        const categoriesCount = await categoryModel.find().count()
        const tessereCount = await tesseraModel.find().count()

        return res.json({
            success : true,
            message : "dashboard data",
            data : {
                ordersCount,
                usersCount,
                productsCount,
                categoriesCount,
                tessereCount
            }
        })

    }catch(error){
        res.send(error.message)
    }

}

module.exports.getAllUsers = async (req, res) => {

    try{

        // all users
        const users = await userModel.find()
            .select("-password -token")
            .populate("tessera")
            .populate("wishlist.productId");

            console.log(users);

        return res.json({
            success : true,
            message : "all users",
            data : users
        })

    }catch(error){
        res.send(error.message)
    }

}
