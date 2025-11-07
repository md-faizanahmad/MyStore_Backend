import Category from "../models/Category.js";

export async function createCategory(req, res) {
  try {
    const { name, description = "" } = req.body;
    if (!name)
      return res.status(400).json({ success: false, message: "Name required" });

    const exists = await Category.findOne({ name });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });

    const cat = await Category.create({ name, description });
    return res
      .status(201)
      .json({ success: true, message: "Category created", category: cat });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
}

export async function getCategories(_req, res) {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.json({ success: true, categories });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch", error: err.message });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description = "" } = req.body;

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });

    return res.json({
      success: true,
      message: "Category updated",
      category: updated,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Update failed", error: err.message });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Not found" });

    return res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Delete failed", error: err.message });
  }
}
