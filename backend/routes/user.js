const router = require("express").Router();
const ctrls = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");

router.put("/cart", [verifyAccessToken], ctrls.updateCart);
router.post("/register", ctrls.register);
router.post("/mock", ctrls.createUsers);
router.put("/finalRegister/:token", ctrls.finalRegister);
router.post("/login", ctrls.login);
router.get("/current", verifyAccessToken, ctrls.getCurrentUser);
router.post("/refreshToken", ctrls.refreshAcessToken);
router.get("/logout", ctrls.logout);
router.post("/forgotpassword", ctrls.forgotPassWord);
router.put("/resetpassword", ctrls.resetPassWord);
router.get("/", [verifyAccessToken, isAdmin], ctrls.getUsers);
router.delete("/:uid", [verifyAccessToken, isAdmin], ctrls.deleteUser);
router.put("/current", verifyAccessToken, uploader.single("avatar"), ctrls.updateUser);
router.put("/:uid", [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin)
router.put("/block-user/:id", [verifyAccessToken, isAdmin], ctrls.userBlocked);
router.put("/unblock-user/:id", [verifyAccessToken, isAdmin], ctrls.unblockedUser);
router.put("/address/:uid", [verifyAccessToken, isAdmin], ctrls.updateUserAddress);
router.get("/wishlist/all", [verifyAccessToken, isAdmin], ctrls.getWishList);
router.put("/wishlist/create", [verifyAccessToken, isAdmin], ctrls.addToWishList)


module.exports = router;
