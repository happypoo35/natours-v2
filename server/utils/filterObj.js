/**
 * @param obj `initial object`
 * @param allowedFields `allowed fields`
 * @returns object cleaned of any params
 * not given in allowedFields sequence
 */
const filterObj = (obj, ...allowedFields) => {
  Object.keys(obj).map((el) => !allowedFields.includes(el) && delete obj[el]);
  return obj;
};

module.exports = filterObj;
