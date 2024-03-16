class APIQuery {
  constructor(query, queryString) {
    this.query = query;
    this.count = query;
    this.queryString = queryString;
    this.pages = {};
  }

  filter() {
    const { name, numericFilters, sort, fields, page, limit, ...rest } =
      this.queryString;
    const queryObj = { ...rest };

    if (name) {
      queryObj.name = { $regex: name, $options: "i" };
    }

    if (numericFilters) {
      const operatorMap = {
        ">": "$gt",
        ">=": "$gte",
        "=": "$eq",
        "<": "$lt",
        "<=": "$lte",
      };
      const filters = numericFilters.replace(
        /\b(>|>=|=|<|<=)\b/g,
        (match) => `-${operatorMap[match]}-`
      );
      const validFields = [];
      this.query.schema.eachPath((path, type) => {
        if (type.instance === "Number") {
          validFields.push(path);
        }
      });

      filters.split(",").forEach((el) => {
        const [field, operator, value] = el.split("-");
        if (validFields.includes(field)) {
          queryObj[field] = { ...queryObj[field], [operator]: +value };
        }
      });
    }

    this.count = this.query.find(queryObj);
    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortList = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortList);
    } else {
      this.query = this.query.sort("-updatedAt");
    }

    return this;
  }

  limit() {
    if (this.queryString.fields) {
      const fieldsList = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fieldsList);
    }

    return this;
  }

  paginate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 100;
    const skip = (page - 1) * limit;

    this.pages.limit = limit;
    this.pages.page = page;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIQuery;
