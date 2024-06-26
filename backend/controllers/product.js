const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { PAGE } = require("../const");
const { CURRENT_PAGE, LIMITS_PAGE } = require("../const/const");
const makeSKU = require("uniqid");
// Phương thức tạo sản phẩm
const createProduct = asyncHandler(async (req, res) => {
  const { title, price, description, brand, category, color } = req.body;
  const thumb = req?.files?.thumb[0].path;
  const images = req?.files?.images?.map((el) => el?.path);
  if (!(title && price && description && brand && category && color))
    throw new Error("Thiếu trường đầu vào");
  req.body.slug = slugify(title);
  if (thumb) req.body.thumb = thumb;
  if (images) req.body.images = images;
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    msg: newProduct ? `Tạo sản phẩm thành công` : `Tạo sản phẩm thất bại`,
    createdProduct: newProduct ? newProduct : null,
  });
});

// Phương thức lấy sản phẩm hiện tại
const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid).populate({
    path: "ratings",
    populate: {
      path: "postedBy",
      select: "firstName lastName avatar",
    },
  });
  return res.status(200).json({
    success: product ? true : false,
    msg: product
      ? `Lấy dữ liệu sản phẩm hiện tại thành công`
      : `Lấy dữ liệu sản phẩm hiện tại thất bại`,
    productData: product ? product : null,
  });
});
// Filtering, sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
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
  let colorQueriesObject = {};
  /**
   * Filtering
   *
   */
  if (queries?.title) {
    forMatedQueries.title = { $regex: queries?.title, $options: "i" };
  }
  if (queries?.category) {
    forMatedQueries.category = { $regex: queries?.category, $options: "i" };
  }
  if (queries?.color) {
    delete forMatedQueries.color;
    const colorQuery = queries?.color
      .split(",")
      .map((el) => ({ color: { $regex: el, $options: "i" } }));
    colorQueriesObject = { $or: colorQuery };
  }
  let queryObject = {};
  if (queries?.q) {
    delete forMatedQueries.q;
    queryObject = {
      $or: [
        { color: { $regex: queries?.q, $options: "i" } },
        { title: { $regex: queries?.q, $options: "i" } },
        { category: { $regex: queries?.q, $options: "i" } },
        { brand: { $regex: queries?.q, $options: "i" } },
        { description: { $regex: queries?.q, $options: "i" } },
      ],
    };
  }
  let qr = { ...forMatedQueries, ...colorQueriesObject, ...queryObject };
  let queryCommand = Product.find(qr);

  //Sorting
  if (req?.query?.sort) {
    const sortBy = req?.query?.sort.split(",").join(" ");
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
  const counts = await Product.find(qr).countDocuments();
  const products = await queryCommand;
  return res.status(200).json({
    success: products ? true : false,
    msg: products
      ? `Lấy dữ liệu toàn bộ sản phẩm thành công`
      : `Lấy dữ liệu toàn bộ sản phẩm thất bại`,
    productData: products ? products : null,
    total: counts,
  });
});

// Phương thức cập nhập sản phẩm
const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req?.params;
  const files = req?.files;
  if (files?.thumb) {
    req.body.thumb = files?.thumb[0]?.path;
  }
  if (files?.images) {
    req.body.images = files?.images?.map((el) => el.path);
  }
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updatedProduct ? true : false,
    msg: updatedProduct
      ? `Câp nhập sản phẩm thành công`
      : `Cập nhập sản phẩm thất bại`,
  });
});
// Phương thức xóa sản phẩm
const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deletedProduct ? true : false,
    msg: deletedProduct
      ? `Xóa dữ liệu sản phẩm thành công`
      : `Xóa dữ liệu sản phẩm thất bại`,
    deletedProduct: deletedProduct
      ? deletedProduct
      : "Xóa dữ liệu sản phẩm thất bại",
  });
});

// Phương thức đánh giá sản phẩm
const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user || {};
  const { star, comment, pid, updatedAt } = req.body;
  if (!star || !comment || !pid) throw new Error("Thiếu trường đầu vào");
  const ratingsProducts = await Product.findById(pid);
  // tìm xem sản phẩm này đã được đánh giá hay chưa
  const alreadyRated = ratingsProducts?.ratings?.find(
    (userId) => userId?.postedBy?.toString() === _id
  );
  if (alreadyRated) {
    // update star & comment
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRated },
      },
      {
        $set: {
          "ratings.$.star": star,
          "ratings.$.comment": comment,
          "ratings.$.updatedAt": updatedAt,
        },
      },
      {
        new: true,
      }
    );
  } else {
    // add star & comment
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id, updatedAt } },
      },
      { new: true }
    );
  }
  // Sum Ratings
  const updatedProduct = await Product.findById(pid);
  const ratingsCount = updatedProduct.ratings.length;
  const sumRatings = updatedProduct.ratings.reduce(
    (sum, el) => sum + +el.star,
    0
  );
  updatedProduct.totalRatings =
    Math.round((sumRatings * 10) / ratingsCount) / 10;

  await updatedProduct.save();

  return res.status(200).json({
    status: true,
    updatedProduct,
  });
});

// Phương thức upload ảnh vào Product
const uploadImagesProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!req.files) throw new Error("Bạn phải tải ảnh lên");
  const response = await Product.findByIdAndUpdate(
    pid,
    { images: req.files.map((el) => el.path) },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    msg: response
      ? `Upload ảnh sản phẩm thành công`
      : `Upload ảnh sản phẩm thất bại`,
    updatedProduct: response ? response : null,
  });
});

// Add Variants
const addVariants = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { title, price, color } = req.body;
  const thumb = req?.files?.thumb[0]?.path;
  const images = req.files?.images?.map((el) => el.path);
  if (!(title && price && color)) throw new Error("Missing Inputs");
  req.body.slug = slugify(title);
  const response = await Product.findByIdAndUpdate(
    pid,
    {
      $push: {
        varriants: {
          color,
          price,
          title,
          thumb,
          images,
          sku: makeSKU().toUpperCase(),
        },
      },
    },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    status: response ? true : false,
    mes: response ? `Thêm variants thành công` : `Thêm variants thất bại`,
  });
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
  uploadImagesProduct,
  addVariants,
};
