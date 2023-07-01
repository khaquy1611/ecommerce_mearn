const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");
const { PAGE } = require("../const");
const { CURRENT_PAGE, LIMITS_PAGE } = require("../const/const");

// Phương thức tạo mới Blog
const createNewBlog = asyncHandler(async (req, res) => {
  const { name, description, category } = req.body;
  if (!name || !description || !category)
    throw new Error("Thiếu trường đầu vào");
  const response = await Blog.create(req.body);
  return res.json({
    success: response ? true : false,
    msg: response ? `Tạo mới blog thành công` : `Tạo mới blog thất bại`,
    createdBlog: response ? response : null,
  });
});

// Phương thức lấy dữ liệu của toàn trang Blog
const getBlogs = asyncHandler(async (req, res) => {
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
  if (queries?.name) {
    forMatedQueries.name = { $regex: queries?.name, $options: "i" };
  }
  let queryCommand = Blog.find(forMatedQueries);

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
  const counts = await Blog.find(forMatedQueries).countDocuments();
  const blogs = await queryCommand;
  return res.status(200).json({
    success: blogs ? true : false,
    msg: blogs
      ? `Lấy dữ liệu toàn bộ blog thành công`
      : `Lấy dữ liệu toàn bộ blog thất bại`,
    blogData: blogs ? blogs : null,
    total: counts,
  });
});

// Phương thức cập nhập Blog
const updateBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (Object.keys(req.body).length === 0)
    throw new Error("Thiếu trường đầu vào");
  const response = await Blog.findByIdAndUpdate(bid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    msg: response
      ? `Cập nhập dữ liệu Blog thành công`
      : `Cập nhập dữ liệu Blog thất bại`,
    createBlog: response ? response : null,
  });
});

// LIKE AND DISLIKE BLOG
const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Thiếu trường đầu vào");
  const blog = await Blog.findById(bid);
  const alreadyDisliked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (alreadyDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $pull: { dislikes: _id },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      result: response,
    });
  }
  const isLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $pull: { likes: _id },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      result: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $push: { likes: _id },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      result: response,
    });
  }
});

// DISLIKE BLOGS
const dislikedBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Thiếu trường đầu vào");
  const blog = await Blog.findById(bid);
  const alreadyLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (alreadyLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $pull: { likes: _id },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      result: response,
    });
  }
  const isDisLiked = blog?.dislikes?.find(
    (el) => el.toString() === _id.toString()
  );
  if (isDisLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $pull: { likes: _id },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      result: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $push: { dislikes: _id },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      result: response,
    });
  }
});

// GET DETAIL BLOG
const getBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndUpdate(
    bid,
    { $inc: { numberViews: 1 } },
    { new: true }
  )
    .populate("likes", "firstName lastName")
    .populate("dislikes", "firstName lastName");
  return res.json({
    success: blog ? true : false,
    result: blog,
  });
});

// Phương thức xóa Blog
const deleteBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blogs = await Blog.findByIdAndDelete(bid);
  console.log('blogs', blogs);
  return res.status(200).json({
    success: blogs ? true : false,
    msg: blogs ? `Xóa Blog thành công` : `Xóa Blog thất bại`,
    deletedBlog: blogs || null,
  });
});

// Phương thức upload ảnh vào Blog
const uploadImagesBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (!req.file) throw new Error("Thiếu trường đầu vào");
  const response = await Blog.findByIdAndUpdate(
    bid,
    { image: req.file.path },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    msg: response ? `Upload ảnh blog thành công` : `Không thể upload ảnh blog`,
    updatedBlog: response ? response : null,
  });
});

module.exports = {
  createNewBlog,
  updateBlog,
  getBlogs,
  likeBlog,
  dislikedBlog,
  getBlog,
  deleteBlog,
  uploadImagesBlog,
};
