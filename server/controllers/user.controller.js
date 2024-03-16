const User = require("../models/user.model");
const handlers = require("./.handlers");

exports.getAllUsers = handlers.getAll(User);
exports.getUser = handlers.getOne(User);
exports.updateUser = handlers.updateOne(User);
exports.deleteUser = handlers.deleteOne(User);
