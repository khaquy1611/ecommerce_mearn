const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const {
  generateAcessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require("../ultils/sendMail");
const crypto = require("crypto");

// phương thức đăng ký người dùng
const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !lastName || !firstName)
    return res.status(400).json({
      success: false,
      msg: `Thiếu trường đầu vào`,
    });
  const user = await User.findOne({ email });
  if (user) {
    throw new Error(`Người dùng đã tồn tại trong hệ thống`);
  } else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      msg: newUser
        ? `Đăng ký người dùng thành công. Vui lòng đến trang đăng nhập~`
        : "Đăng ký không thành công có gì đó bị lỗi",
    });
  }
});

// Phương thức đăng nhập người dùng
// Refresh Token => Cấp mới access Token
// Access Token => Xác thực người dùng , phân quyền người dùng
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      msg: `Thiếu trường đầu vào`,
    });
  }
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    // Tách password và role ra khỏi response
    const { password, role, ...userData } = response.toObject();
    // Tạo accessToken
    const accessToken = generateAcessToken(response._id, role);
    // Tạo refreshToken
    const refreshToken = generateRefreshToken(response._id);
    // Lưu refreshToken vào database
    await User.findByIdAndUpdate(
      response._id,
      {
        refreshToken,
      },
      { new: true }
    );
    // Lưu refresh Token vào database
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      msg: `Đăng nhập thành công`,
      accessToken,
      userData: response,
    });
  } else {
    throw new Error(
      `Lỗi đăng nhập. ~ Mật khẩu hoặc tài khoản email không chính xác.`
    );
  }
});

// Phương thức lấy về thông tin của 1 người dùng
const getCurrentUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-refreshToken -password -role");
  return res.status(200).json({
    success: user ? true : false,
    userData: user ? user : `Không tìm thấy thông tin người dùng`,
  });
});

// phương thức cấp access token mới
const refreshAcessToken = asyncHandler(async (req, res) => {
  // Lấy token từ cookies;
  const cookie = req.cookies;
  // Check xem có token hay không
  if (!cookie && !cookie.refreshToken)
    throw new Error(`Không có refresh token trong cookies`);
  // Check token có hợp lệ hay không
  const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: decode._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAcessToken(result._id, result.role)
      : `Refresh Token không hợp lệ`,
  });
});

// phương thức logout
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && cookie.refreshToken)
    throw new Error(`Không có refresh token trong cookies`);
  // Xóa refresh token ở db
  const result = await User.findOneAndUpdate(
    {
      refreshToken: cookie.refreshToken,
    },
    {
      refreshToken: "",
    },
    { new: true }
  );
  // Xóa refresh token ở cookie trình duyệt
  res.clearCookie("refreshToken", { http: true, secure: true });
  return res.status(200).json({
    success: result ? true : false,
    msg: result ? `Đăng xuất thành công` : `Đăng xuất thất bại. Có lỗi!!!`,
  });
});

// Client gửi Email
// Server check email xem có hợp lệ hay không => Gửi mail + kèm theo link (password and change token)
// Client click mail => click link thay đổi mật khẩu gửi api kèm token
// Server check Token có giống với token đã gửi mail hay không và thay đổi pass
// Phương thức lấy lại mật khẩu
const forgotPassWord = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Thiếu trường email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("Không tìm thấy người dùng");
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.URL_SERVER}/api/user/resetpassword/${resetToken}>Click here</a>`;

  const data = {
    email,
    html,
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: true,
    rs,
  });
});

// Phương thức lấy lại mật khẩu
const resetPassWord = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password && !token) throw new Error(`Thiếu trường đầu vào`);
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  }).exec();
  if (!user) throw new Error("Mã token không hợp lệ");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Lấy lại mật khẩu thành công" : "Có lỗi!!!!",
  });
});


// phương thức lấy nhiều người dùng

const getUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select('-refreshToken -password -role');
  return res.status(200).json({
      success: response ? true : false,
      msg: response ? `Lấy tất cả dữ liệu người dùng thành công` : `Lấy dữ liệ người dùng thất bại`,
      users: response
  });
});

// phương thức xóa người dùng
const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query
  if (!_id) throw new Error('Thiếu trường đầu vào');
  const response = await User.findByIdAndDelete(_id)
  return res.status(200).json({
      success: response ? true : false,
      deletedUser: response ? `Người dùng có email ${response.email} đã bị xóa` : 'Không có người dùng nào bị xóa'
  })
});

// phương thức cập nhập người dùng
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user
  if (!_id || Object.keys(req.body).length === 0) throw new Error('Thiếu trường đâò vào')
  const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -role -refreshToken')
  return res.status(200).json({
      success: response ? true : false,
      msg: response ? `Cập nhập người dùng thành công` : `Cập nhập người dùng thất bại`,
      updatedUser: response ? response : 'Có lỗi!!!'
  });
});
// phương thức cập nhập người dùng bởi admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params
  if (Object.keys(req.body).length === 0) throw new Error('Thiếu trường đầu vào')
  const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
  return res.status(200).json({
      success: response ? true : false,
      msg: response ? `Admin cập nhập người dùng thành công` : `Admin cập nhập người dùng thất bại`,
      updatedUser: response ? response : 'Có gì đó bị lỗi'
  });
});


// Phương thức cập nhập địa chỉ của người dùng
const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Thiếu trường đầu vào");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    { new: true }
  ).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    msg: response ? `Cập nhập địa chỉ của người dùng thành công` : `Cập nhập địa chỉ của người dùng thất bại`,
    updatedUser: response ? response : null,
  });
});

// Phương thức cập nhập giỏ hàng người dùng
const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error("Thiếu trường đầu vào");
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find((el) => el.product.toString() == pid);
  if (alreadyProduct) {
    if (alreadyProduct.color === color) {
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        { $set: { "cart.$.quantity": quantity } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "Có gì đó bị lỗi!!",
      });
    } else {
      const response = await User.findByIdAndUpdate(
        _id,
        { $push: { cart: { product: pid, quantity, color } } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "Có gì đó bị lỗi!!",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { cart: { product: pid, quantity, color } } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Có gì đó bị lỗi!!",
    });
  }
});

// Phương thức thêm sản phẩm vào danh sách yêu thích
const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid } = req.body;
  if (!pid) throw new Error("Thiếu trường đầu vào");
  const user = User.findById(_id);
  const alreadyAdded = user?.wishlist?.find(
    (id) => id.toString() === pid
  );
  if (alreadyAdded) {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        $pull: { wishlist: pid },
      },
      { new: true }
    ).populate("wishlist", "title");
    return res.status(200).json({
      status: user ? true : false,
      userData: user ? user : "Không thể đưa sản phẩm vào danh sách yêu thích",
    });
  } else {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        $push: { wishlist: pid },
      },
      { new: true }
    ).populate("wishlist", "title");
    return res.status(200).json({
      status: user ? true : false,
      userData: user ? user : "Không thể đưa sản phẩm vào danh sách yêu thích",
    });
  }
});


// Khóa người dùng
const userBlocked = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blockedUser = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
  return res.status(200).json({
    status: blockedUser ? true : false,
    userData: blockedUser ? blockedUser : "Không thể khóa người dùng"
  })
})

// Mở khóa người dùng
const unblockedUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const unblocked = await User.findByIdAndUpdate(id , { isBlocked: false }, { new: true });
  return res.status(200).json({
    status: unblocked ? true : false,
    userData: unblocked ? unblocked : "Không thể mở khóa người dùng" 
  });
});

// GET WISHLIST 
const getWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const response = await User.findById(_id).populate("wishlist");
  return res.status(200).json({
    status: response ? true : false,
    userData: response ? response : "Không thể lấy dữ liệu danh sách sản phẩm yêu thích"
  });
});


module.exports = {
  register,
  login,
  getCurrentUser,
  refreshAcessToken,
  logout,
  forgotPassWord,
  resetPassWord,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  updateCart,
  addToWishList,
  userBlocked,
  unblockedUser,
  getWishList
};
