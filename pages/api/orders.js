import Order from "../../models/Order";
import Product from "../../models/Product";
import jwt from "jsonwebtoken";
import connectDb from "../../utils/connectDb";


connectDb();
export default async(req,res) => {
    try {
        const {userId} = jwt.verify(req.headers.authorization,process.env.JWT_SECRET)
        const orders = await Order.find({user:userId}).populate({
            path:"products.product",
            model:"Product"
        })
        res.status(200).json({orders})
        // sending as an obj as find always returns an array
    } catch (error) {
     console.error  (error);
     res.status(403).send("Please Login again")   
    }
}