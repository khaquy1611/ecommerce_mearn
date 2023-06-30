const router = require("express").Router();
const ctrls = require("../controllers/productCategories");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post('/create', [verifyAccessToken, isAdmin], ctrls.createProductCategories);
router.get('/', ctrls.getProductCategories);
router.put('/:id', [verifyAccessToken, isAdmin], ctrls.updatedProductCategories);
router.delete('/:id', [verifyAccessToken, isAdmin], ctrls.deleteProductCategories);

module.exports = router;