const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");
const { PAGE } = require("../const");
const { CURRENT_PAGE, LIMITS_PAGE } = require("../const/const");

// Phương thức tạo mới brand
const createBrand = asyncHandler(async (req, res) => {
  const response = await Brand.create(req.body);
  return res.json({
    success: response ? true : false,
    msg: response ? `Tạo mới brand thành công` : `Tạo mới brand thất bại`,
    createdBrand: response ? response : null,
  });
});

// Phương thức lấy toàn bộ brand
const getBrand = asyncHandler(async (req, res) => {
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
  let queryCommand = Brand.find(forMatedQueries).select("title _id");

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
  const counts = await Brand.find(forMatedQueries).countDocuments();
  const brand = await queryCommand;
  return res.status(200).json({
    success: brand ? true : false,
    msg: brand
      ? `Lấy dữ liệu toàn bộ dữ liệu brand thành công`
      : `Lấy dữ liệu toàn bộ dữ liệu brand thất bại`,
    brandData: brand ? brand : null,
    total: counts,
  });
});

// UPDATE BLOG CATEGORIES
const updatedBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await Brand.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    msg: response ? `Cập nhập dữ liệu brand thành công` : `Cập nhập dữ liệu brand thất bại`,
    blogCategoriesData: response ? response : null,
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await Brand.findByIdAndDelete(id);
  return res.json({
    success: response ? true : false,
    msg: response ? `Xóa dữ liệu brand thành công` : `Xóa dữ liệu brand thất bại`,
    deletedBlogCategory: response ? response : null,
  });
});

module.exports = {
  createBrand,
  getBrand,
  updatedBrand,
  deleteBrand,
};