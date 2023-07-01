const userRouter = require("./user");
const productRouter = require("./product");
const productCategoriesRouter = require("./productCategories");
const blogCategoriesRouter = require("./blogCategories");
const blogRouter = require("./blog");
const brandRouter = require("./brand");
const couponRouter = require("./coupon");
const orderRouter = require("./order");

const { notFound, errHandler } = require("../middlewares/errorHandler");

const initRoutes = (app) => {
    app.use("/api/user", userRouter);
    app.use("/api/product", productRouter);
    app.use("/api/product_categories", productCategoriesRouter);
    app.use("/api/blog", blogRouter);
    app.use("/api/blogCategories", blogCategoriesRouter);
    app.use("/api/brand", brandRouter);
    app.use("/api/coupon", couponRouter);
    app.use("/api/order", orderRouter);

    app.use(notFound);
    app.use(errHandler);
}

module.exports = initRoutes;