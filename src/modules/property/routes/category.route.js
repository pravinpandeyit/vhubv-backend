const router = require("express").Router();
const {createCategory,getCategories,updateCategory,deleteCategory } = require("../controllers/category.controller");


// category routes
router.post("/property/category", createCategory);
router.get("/property/category", getCategories);
router.put("/property/category/:id", updateCategory);
router.delete("/property/category/:id", deleteCategory);


module.exports = router;