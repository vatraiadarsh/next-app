import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "PUT":
      await handlePutRequest(req, res);
      break;
    case "DELETE":
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handleGetRequest(req, res) {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No Authorization token");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product",
    });
    res.status(200).json(cart.products);
  } catch (error) {
    console.log(error);
    // if token is invalid
    res.status(403).send("Please Log in Again");
  }
}

async function handlePutRequest(req, res) {
  const { quantity, productId } = req.body;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("User not logged in.");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    // Get user cart based on userId
    const cart = await Cart.findOne({ user: userId });
    // Check if product already exists in cart
    const productExists = cart.products.some((doc) =>
      ObjectId(productId).equals(doc.product)
    );
    // if so, increment quantity on product ID
    if (productExists) {
      await Cart.findOneAndUpdate(
        { _id: cart._id, "products.product": productId },
        { $inc: { "products.$.quantity": quantity } }
      );
    } else {
      // if not, add new product with given quantity
      const newProduct = { quantity, product: productId };
      await Cart.findOneAndUpdate(
        { _id: cart._id },
        { $addToSet: { products: newProduct } }
      );
    }
    res.status(200).send("Cart updated");
  } catch (error) {
    console.error(error);
    res.status(403).send("Please sign in again");
  }
}

async function handleDeleteRequest(req, res) {
  const { productId } = req.query;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("User not logged in.");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate({
      path: "products.product",
      model: "Product",
    });
    // find and update will return unpopulated data
    res.status(200).json(cart.products);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please sign in again");
  }
}
