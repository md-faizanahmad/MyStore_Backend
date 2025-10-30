import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  const { name, price, description, category, image } = req.body;
  const product = await Product.create({
    name,
    price,
    description,
    category,
    image,
  });
  res.status(201).json({ success: true, product });
};

export const getProducts = async (_, res) => {
  const products = await Product.find().populate("category", "name");
  res.json({ success: true, products });
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product)
    return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, product });
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product)
    return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, message: "Deleted" });
};
