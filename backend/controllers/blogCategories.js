const BlogCategory = require("../models/blogCategories");
const asyncHandler = require("express-async-handler");
const { PAGE } = require("../const");
const { CURRENT_PAGE, LIMITS_PAGE } = require("../const/const");

// Phương thức tạo blog categories
const createBlogCategories = asyncHandler(async (req, res) => {
  const response = await BlogCategory.create(req.body);
  return res.json({
    success: response ? true : false,
    msg: response ? `Tạo Blog Categries thành công` : `Tạo Blog Categories thất bại`,
    createdBlogCategories: response
      ? response
      : null,
  });
});

// Phương thức lấy blog categories
const getBlogCategories = asyncHandler(async (req, res) => {
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
  let queryCommand = BlogCategory.find(forMatedQueries).select("title _id");

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
  const counts = await BlogCategory.find(forMatedQueries).countDocuments();
  const blogCategories = await queryCommand;
  return res.status(200).json({
    success: blogCategories ? true : false,
    msg: blogCategories
      ? `Lấy dữ liệu toàn bộ blog categories thành công`
      : `Lấy dữ liệu toàn bộ blog categories thất bại`,
    blogCategoriesData: blogCategories ? blogCategories : null,
    total: counts,
  });
});

// Phương thức cập nhập blog categories
const updatedBlogCategories = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await BlogCategory.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    msg: response ? `Cập nhập blog categories thành công` : `Cập nhập blog categories thất bại`,
    blogCategoriesData: response
      ? response
      : null,
  });
});

// phương thức xóa blogCategories
const deleteBlogCategories = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await BlogCategory.findByIdAndDelete(id);
  return res.json({
    success: response ? true : false,
    msg: response ? `Xóa blog categories thành công` : `Xóa blog categories thất bại`,
    deletedBlogCategory: response
      ? response
      : null,
  });
});

module.exports = {
  createBlogCategories,
  getBlogCategories,
  updatedBlogCategories,
  deleteBlogCategories,
};