const setModel = (name) => (req, res, next) => {
  req.model = name;
  next();
};

module.exports = setModel;
