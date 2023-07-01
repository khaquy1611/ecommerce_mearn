const router = require("express").Router();
const ctrls = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.put("/cart", [verifyAccessToken], ctrls.updateCart);
router.post("/register", ctrls.register);
router.post("/login", ctrls.login);
router.get("/current", verifyAccessToken, ctrls.getCurrentUser);
router.post("/refreshToken", ctrls.refreshAcessToken);
router.get("/logout", ctrls.logout);
router.get("/forgotpassword", ctrls.forgotPassWord);
router.put("/resetpassword", ctrls.resetPassWord);
router.get("/", [verifyAccessToken, isAdmin], ctrls.getUsers);
router.delete("/", [verifyAccessToken, isAdmin], ctrls.deleteUser);
router.put("/current", [verifyAccessToken], ctrls.updateUser);
router.put("/:uid", [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin)
router.put("/block-user/:id", [verifyAccessToken, isAdmin], ctrls.userBlocked);
router.put("/unblock-user/:id", [verifyAccessToken, isAdmin], ctrls.unblockedUser);
router.put("/address/:uid", [verifyAccessToken, isAdmin], ctrls.updateUserAddress);
router.get("/wishlist/all", [verifyAccessToken, isAdmin], ctrls.getWishList);
router.put("/wishlist/create", [verifyAccessToken, isAdmin], ctrls.addToWishList)


module.exports = router;
