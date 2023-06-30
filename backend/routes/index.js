const userRouter = require("./user");
const productRouter = require("./product");
const productCategories = require("./productCategories");

const { notFound, errHandler } = require("../middlewares/errorHandler");

const initRoutes = (app) => {
    app.use("/api/user", userRouter);
    app.use("/api/product", productRouter);
    app.use("/api/product_categories", productCategories);


    app.use(notFound);
    app.use(errHandler);
}

module.exports = initRoutes;