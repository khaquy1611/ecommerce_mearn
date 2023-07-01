const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");
const { PAGE } = require("../const");
const { CURRENT_PAGE, LIMITS_PAGE } = require("../const/const");

// Tạo mới mã giảm giá
const createNewCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("Thiếu trường đầu vào");
  const response = await Coupon.create({
    ...req.body,
    expiry: Date.now() + +(expiry * 24 * 60 * 60 * 1000),
  });
  return res.json({
    success: response ? true : false,
    msg: response ? `Không thể tạo mới mã giảm giá` : `Tạo mới mã giảm giá thành công`,
    createdCoupon: response ? response : null,
  });
});

// Lấy toàn bộ dữ liệu coupons
const getCoupons = asyncHandler(async (req, res) => {
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
  if (queries?.title)
    forMatedQueries.title = { $regex: queries.title, $options: "i" };
  let queryCommand = Coupon.find(forMatedQueries).select("name _id");

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
  const counts = await Coupon.find(forMatedQueries).countDocuments();
  const coupon = await queryCommand;
  return res.status(200).json({
    success: coupon ? true : false,
    msg: coupon
      ? `Lấy dữ liệu toàn bộ dữ liệu coupon thành công`
      : `Lấy dữ liệu toàn bộ dữ liệu coupon thất bại`,
    couponData: coupon ? coupon : null,
    total: counts,
  });
});

// Cập nhập Coupon
const updateCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("Thiếu trường đầu vào");
  if (Object.keys(req.body).length === 0) throw new Error("Thiếu trường đầu vào");
  if (req.body.expiry)
    req.body.expiry = Date.now() + +expiry * 24 * 60 * 60 * 1000;
  const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
  return res.json({
    success: response ? true : false,
    msg: response ? `Sửa đổi dữ liệu coupon thành công` : `Sửa đổi dữ liệu coupon thất bại`,
    createdCoupon: response ? response : null,
  });
});

// Xóa  Coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const { expiry } = req.body;
  if (req.body.expiry)
    req.body.expiry = Date.now() + +expiry * 24 * 60 * 60 * 1000;
  const response = await Coupon.findByIdAndDelete(cid);
  return res.json({
    success: response ? true : false,
    msg: response ? `Xóa dữ liệu Coupon thành công` : `Xóa dữ liệu Coupon thất bại`,
    deletedCoupon: response ? response : null,
  });
});
module.exports = {
  createNewCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
};