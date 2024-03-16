const asyncWrapper = require("../middleware/asyncWrapper");
const ApiError = require("../errors/apiError");
const APIQuery = require("../utils/apiQuery");

exports.getAll = (Model) =>
  asyncWrapper(async (req, res) => {
    const apiQuery = new APIQuery(Model, req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    const count = await apiQuery.count;
    const doc = await apiQuery.query;

    const total = count.length;
    const nbHits = doc.length;

    const { page, limit } = apiQuery.pages;
    const pageCount = total > 0 ? Math.ceil(total / limit) : 1;

    res.status(200).json({
      status: "success",
      stats: { nbHits, total, page, pageCount },
      data: doc,
    });
  });

exports.getOne = (Model, options) =>
  asyncWrapper(async (req, res) => {
    let query = Model.findById(req.params.id);
    if (options) query = query.populate(options);

    const doc = await query;
    if (!doc) {
      throw new ApiError(`${req.model} with this ID does not exist`, 404);
    }
    res.status(200).json({ status: "success", data: doc });
  });

exports.createOne = (Model) =>
  asyncWrapper(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ status: "success", data: doc });
  });

exports.updateOne = (Model) =>
  asyncWrapper(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      throw new ApiError(`${req.model} with this ID does not exist`, 404);
    }
    res.status(200).json({ status: "success", data: doc });
  });

exports.deleteOne = (Model) =>
  asyncWrapper(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      throw new ApiError(`${req.model} with this ID does not exist`, 404);
    }
    res.status(204).json({ status: "success", data: null });
  });
