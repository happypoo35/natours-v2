const setFilterBy = (req, res, next) => {
  if (req.params.tourId) {
    req.query.tour = req.params.tourId;
  }
  if (req.params.userId) {
    req.query.user = req.params.userId;
  }
  next();
};

module.exports = setFilterBy;
