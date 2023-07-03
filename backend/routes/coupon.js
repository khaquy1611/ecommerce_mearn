const router = require("express").Router();
const ctrls = require("../controllers/coupon");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post(
  "/create",
  [verifyAccessToken, isAdmin],
  ctrls.createNewCoupon
);

router.get(
    "/",
    [verifyAccessToken, isAdmin],
    ctrls.getCoupons
);

router.put("/:cid", [verifyAccessToken, isAdmin], ctrls.updateCoupon)
router.delete("/:cid", [verifyAccessToken, isAdmin], ctrls.deleteCoupon)
module.exports = router;