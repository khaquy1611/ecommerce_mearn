const router = require("express").Router();
const ctrls = require("../controllers/role");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/", [verifyAccessToken, isAdmin], ctrls.getRoles);

module.exports = router;