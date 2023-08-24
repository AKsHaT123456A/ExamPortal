const User = require("../Models/user");

const updateCategory = async (req, res) => {
    try {
        const { category, id } = req.params;

        const updatedUser = await User.findOneAndUpdate(
            { _id: id },
            { $set: { category } },
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Category updated successfully", category: category });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
};

module.exports = updateCategory;
