const ProductCategories = require("../models/productCategories");
const asyncHandler = require("express-async-handler");
const { PAGE } = require("../const/index");
const { CURRENT_PAGE, LIMITS_PAGE } = require("../const/const");
// CREATE PRODUCT CATEGORIES
const createProductCategories = asyncHandler(async (req, res) => {
  const response = await ProductCategories.create(req.body);
  return res.json({
    success: response ? true : false,
    msg: response ? `Tạo danh mục sản phẩm thành công` : `Tạo danh mục sản phẩm thất bại`,
    createdProductCategories: response
      ? response
      : null
  });
});

// GET PRODUCT CATEGORIES
const getProductCategories = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach(el => delete queries[el])
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
    if (queries?.title) {
      forMatedQueries.title = { $regex: queries?.title, $options: "i" };
    }
    let queryCommand = ProductCategories.find(forMatedQueries);
    
    //Sorting
    if (req?.query?.sort) {
      const sortBy = req?.query?.sort.split(',').join(' ')
      queryCommand = queryCommand.sort(sortBy)
    } else {
      queryCommand = queryCommand.sort('-createdAt')
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
    const counts = await ProductCategories.find(forMatedQueries).countDocuments();
    const productsCategories = await queryCommand;
    return res.status(200).json({
      success: productsCategories ? true : false,
      msg: productsCategories
        ? `Lấy dữ liệu toàn bộ danh mục sản phẩm thành công`
        : `Lấy dữ liệu toàn bộ danh mục sản phẩm thất bại`,
      productData: productsCategories ? productsCategories : null,
      total: counts,
    });
});

// uPDATE PRODUCT CATEGORIES
const updatedProductCategories = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await ProductCategories.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    msg: response ? `Cập nhập danh mục sản phẩm thành công` : `Cập nhập danh mục sản phẩm thất bại`,
    productCategories: response
      ? response
      : null,
  });
});

const deleteProductCategories = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await ProductCategories.findByIdAndDelete(id);
  return res.json({
    success: response ? true : false,
    msg: response ? `Xóa danh mục sản phẩm thành công` : `Xóa danh mục sản phẩm thất bại`,
    deletedProductCategories: response
      ? response
      : null,
  });
});

module.exports = {
  createProductCategories,
  getProductCategories,
  updatedProductCategories,
  deleteProductCategories,
};