const Product = require("../models/product");
const ProductCategories = require("../models/productCategories");
const Role = require("../models/role");
const asyncHandler = require("express-async-handler");
const dataProduct = require("../../data/ecommerce.json");
const dataCategory = require("../../data/cate_brand");
const dataRole = require("../../data/role");
const slugify = require("slugify");

const fn = async (product) => {
  await Product.create({
    title: product?.name,
    slug: slugify(product?.name) + Math.round(Math.random() * 100) + "",
    description: product?.description,
    brand: product?.brand,
    price: Math.round(Number(product?.price?.match(/\d/g).join("")) / 100),
    category: product?.category[1],
    quantity: Math.round(Math.random() * 1000),
    sold: Math.round(Math.random() * 100),
    images: product?.images,
    color: product?.variants?.find((el) => el.label === "Color")?.variants[0],
    thumb: product?.thumb,
    totalRatings: Math.round(Math.random() * 5)
  });
};
const insertProduct = asyncHandler(async (req, res) => {
  const promises = [];
  for (let product of dataProduct) promises.push(fn(product));
  await Promise.all(promises);
  return res.json("Done");
});

const fn2 = async (cate) => {
  await ProductCategories.create({
    title: cate?.cate,
    brand: cate?.brand,
    image: cate?.image
  });
};

const insertCategory = asyncHandler(async (req, res) => {
  const promises = [];
  for (let category of dataCategory) promises.push(fn2(category));
  await Promise.all(promises);
  return res.json("Done");
});

const fn3 = async (role = '') => {
  await Role.create({
    code: role?.code,
    value: role?.value,
  });
}
const insertRole = asyncHandler(async (req, res) => {
  const promises = [];
  for (let role of dataRole) promises.push(fn3(role));
  await Promise.all(promises);
  return res.json("Done");
});
module.exports = {
  insertProduct,
  insertCategory,
  insertRole
};
