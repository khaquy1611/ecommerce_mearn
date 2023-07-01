const router = require("express").Router();
const ctrls = require("../controllers/blog");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");

router.post(
  "/create",
  [verifyAccessToken, isAdmin],
  ctrls.createNewBlog
);

router.put(
  "/update/:bid",
  [verifyAccessToken, isAdmin],
  ctrls.updateBlog
);
router.get("/", ctrls.getBlogs);
router.put("/like/:bid", [verifyAccessToken], ctrls.likeBlog);
router.put("/dislike/:bid", [verifyAccessToken], ctrls.dislikedBlog);
router.get("/:bid", [verifyAccessToken], ctrls.getBlog);
router.put(
  "/uploadImage/:bid",
  [verifyAccessToken, isAdmin],
  uploader.single("image"),
  ctrls.uploadImagesBlog
);
router.delete("/:bid", [verifyAccessToken, isAdmin], ctrls.deleteBlog);
module.exports = router;
