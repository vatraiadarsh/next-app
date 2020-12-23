import connectDb from "../../utils/connectDb";
import Product from "../../models/Product";
// import Products from "../../static/products.json";

connectDb();

export default async (req, res) => {
  const { page, size } = req.query;
  const pageNum = Number(page);
  const pageSize = Number(size);
  let products = [];
  const totalDocs = await Product.countDocuments();
  const totalPages = Math.ceil(totalDocs / pageSize);
  // always rounding up the elements so that we can have access to the remainder of the product and can see all the products
  if (pageNum === 1) {
    products = await Product.find().limit(pageSize);
  } else {
    const skips = pageSize * (pageNum - 1);
    // eg we are on page 2 so pagesize is 1so 1 * 2-1 = 1 we need to skip one document
    products = await Product.find().skip(skips).limit(pageSize);
  }
  // const products = await Product.find();
  res.status(200).json({products, totalPages});
};
