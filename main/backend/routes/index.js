const express = require("express");
const userRouter = require("./user.js");
const rootRouter = express.Router();

rootRouter.use("/user", userRouter);


module.exports = rootRouter;