const router = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const ctrls = require("../controllers/order");

router.get("/all", [verifyAccessToken], ctrls.getUserOrder);
router.post("/create", [verifyAccessToken, isAdmin], ctrls.createOrder);
router.put(
  "/status/:id",
  [verifyAccessToken, isAdmin],
  ctrls.updateStatusOrder
);
router.get("/admin", [verifyAccessToken, isAdmin], ctrls.getOrders);
module.exports = router;
