import User_Test from "../models/user-model";

export interface UpdateCategoryRequest extends Request {
  params: {
    id: string;
    key: string;
  };
  query: {
    category?: string;
    quesId?: string;
    ansId?: string;
    status?: string;
    id?: string;
  };
}
export async function updateCategory(
  req: UpdateCategoryRequest,
  //@ts-ignore
  res
) {
  try {
    const { category } = req.query;
    const { id } = req.params;

    if (!category) {
      const foundCategory = await User_Test.findById(id).select("category");
      if (foundCategory) {
        return res.status(200).json({ category: foundCategory.category });
      } else {
        return res.status(404).json({ message: "Category not found" });
      }
    }
    const updatedUser = await User_Test.findOneAndUpdate(
      { _id: id },
      { $set: { category } }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Category updated successfully", category: category });
  } catch (error) {
    return (
      res
        .status(500)
        //@ts-ignore
        .json({ error: "Internal Server Error", message: error.message })
    );
  }
}
