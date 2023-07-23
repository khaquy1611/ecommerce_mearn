const Role = require("../models/role");
const asyncHandler = require("express-async-handler");
const { PAGE } = require("../const");
const { CURRENT_PAGE, LIMITS_PAGE } = require("../const/const");

const getRoles = asyncHandler(async (req, res) => {
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
      forMatedQueries.code = { $regex: queries?.code, $options: "i" };
    }
    let queryCommand = Role.find(forMatedQueries);
  
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
    const counts = await Role.find(forMatedQueries).countDocuments();
    const Roles = await queryCommand;
    return res.status(200).json({
      success: Roles ? true : false,
      msg: Roles
        ? `Lấy dữ liệu toàn bộ Role thành công`
        : `Lấy dữ liệu toàn bộ Role thất bại`,
      RoleData: Roles ? Roles : null,
      total: counts,
    });
  });

  module.exports = {
    getRoles
  };
  