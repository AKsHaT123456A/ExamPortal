const User = require("../Models/user");

const category = (req, res) => {
    try {
        const { category, id } = req.params;
        const user = User.findByIdAndUpdate(id, category);
        return res.status(200).json({ message: "Category updated successfully", category:user.category });
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
}

module.exports = category;