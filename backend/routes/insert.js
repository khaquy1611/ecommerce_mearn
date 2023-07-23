const router = require("express").Router();
const ctrls = require("../controllers/insertData");

router.post('/', ctrls.insertProduct);
router.post('/cate', ctrls.insertCategory);
router.post('/role', ctrls.insertRole);

module.exports = router;