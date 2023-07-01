const router = require("express").Router();
const ctrls = require("../controllers/brand");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post(
  "/create",
  [verifyAccessToken, isAdmin],
  ctrls.createBrand
);
router.get("/", ctrls.getBrand);
router.put(
  "/:id",
  [verifyAccessToken, isAdmin],
  ctrls.updatedBrand
);
router.delete(
  "/:id",
  [verifyAccessToken, isAdmin],
  ctrls.deleteBrand
);

module.exports = router;