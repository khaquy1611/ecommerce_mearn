const User = require("../models/users");
const Order = require("../models/order");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");
const { PAGE } = require("../const");
const { CURRENT_PAGE, LIMITS_PAGE } = require("../const/const");

// Phương thức tạo đơn hàng
const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cid } = req.body;
  const userCart = await User.findById(_id)
    .select("cart")
    .populate("cart.product", "title price");
  const products = userCart?.cart?.map((el) => ({
    product: el.product._id,
    count: el.quantity,
    color: el.color,
  }));
  let total = userCart?.cart?.reduce(
    (sum, el) => el.product.price * el.quantity + sum,
    0
  );
  const createData = { products, total, orderBy: _id };
  if (cid) {
    const selectedCoupon = await Coupon.findById(cid);
    total =
      Math.round((total * (1 - +selectedCoupon?.discount / 100)) / 1000) *
        1000 || total;
    createData.total = total;
    createData.coupon = cid;
  }
  const result = await Order.create(createData);
  return res.json({
    success: result ? true : false,
    createdOrder: result ? result : "Không thể tạo đơn hàng",
  });
});

// Cập nhập trang thái của đơn hàng
const updateStatusOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) throw new Error("Thiếu trường trạng thái");
  const response = await Order.findByIdAndUpdate(id, { status }, { new: true });
  return res.json({
    success: response ? true : false,
    response: response
      ? response
      : "Không thể cập nhập trạng thái của đơn hàng",
  });
});

// Lấy về đơn hàng đã đặt của người dùng
const getUserOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const response = await Order.find({ orderBy: _id });
  return res.json({
    success: response ? true : false,
    response: response ? response : "Có gì đó bị lỗi!!!",
  });
});

// Lấy dữ liệu tất cả đơn hàng
const getOrders = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((el) => delete queries[el]);
    // Format lại các operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const forMatedQueries = JSON.parse(queryString);
  
    /**
     * Filtering
     *
     */
    if (queries?.status)
      forMatedQueries.title = { $regex: queries.status, $options: "i" };
    let queryCommand = Order.find(forMatedQueries);
  
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queryCommand = queryCommand.sort(sortBy);
    } else {
      queryCommand = queryCommand.sort("-createdAt");
    }
  
    // Field Limiting
  
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queryCommand = queryCommand.select(fields);
    } else {
      queryCommand = queryCommand.select("-__v");
    }
  
    // Pagination
    // limit: số object lấy về sau 1 lần gọi API
    const page = +req.query.page * 1 || PAGE[CURRENT_PAGE];
    const limit = +req.query.limit * 1 || PAGE[LIMITS_PAGE];
    const skip = (page - 1) * limit;
  
    queryCommand = await queryCommand.skip(skip).limit(limit);
  
    // Execute query
    // Số lượng sp thỏa mãn điều kiện !== số lượng sp trả về 1 lần gọi API
    const counts = await Order.find(forMatedQueries).countDocuments();
    const orders = await queryCommand;
    return res.status(200).json({
      success: orders ? true : false,
      msg: orders
        ? `Lấy dữ liệu toàn bộ dữ liệu đơn hàng thành công`
        : `Lấy dữ liệu toàn bộ dữ liệu đơn hàng thất bại`,
      orderData: orders ? orders : null,
      total: counts,
    });
});

module.exports = {
  createOrder,
  updateStatusOrder,
  getUserOrder,
  getOrders
};