const User = require("../Models/user");

const category = (req,res)=>{
    const {category,id} = req.params;
    const user = User.findByIdAndUpdate(id, category);
}

module.exports = category;