const router = require("express").Router();
const ctrls = require("../controllers/blogCategories");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post(
  "/create",
  [verifyAccessToken, isAdmin],
  ctrls.createBlogCategories
);
router.get("/", ctrls.getBlogCategories);
router.put(
  "/:id",
  [verifyAccessToken, isAdmin],
  ctrls.updatedBlogCategories
);
router.delete(
  "/:id",
  [verifyAccessToken, isAdmin],
  ctrls.deleteBlogCategories
);

module.exports = router;