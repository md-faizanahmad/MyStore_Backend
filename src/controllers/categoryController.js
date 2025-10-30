import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name)
    return res.status(400).json({ success: false, message: "Name required" });

  const exists = await Category.findOne({ name });
  if (exists)
    return res.status(400).json({ success: false, message: "Category exists" });

  const category = await Category.create({ name, description });
  res.status(201).json({ success: true, category });
};

export const getCategories = async (_, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json({ success: true, categories });
};

export const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, description: req.body.description },
    { new: true }
  );
  if (!category)
    return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, category });
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category)
    return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, message: "Deleted" });
};
