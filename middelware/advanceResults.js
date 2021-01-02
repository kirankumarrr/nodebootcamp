const advanceResults = (model, populate) => async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };
  /**
   * @desc :Reason to Fields to exclude
   *       :get all the records without any quertString
   */
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //loops and remove fields
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  /**
   * /b : search at the beginning of a word in a string:
   * query:{{URL}}/api/v1/bootcamps?averageCost[gte]=1000&location.city=Lowell&careers[in]=Mobile Development
   */

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //Finding resource
  //Note: Added populate for course modal in bootcamps
  query = model.find(JSON.parse(queryStr));
  //Selected Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    //selecting specific fields out the resources received from DB
    query = query.select(fields);
  }

  //Sort
  //Sorting it by mulitple fields

  //TODO: Why its failing
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    //Sort default by date
    //1 : ascending  & -1:descending
    query = query.sort('-createdAt');
  }

  /**
   * @QueryOperation: pagination
   * @desc :"creating pagination"
   */

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalDocuments = await model.countDocuments();
  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  //Executing query
  let results = await query;

  //Pagination result

  const pagination = {};
  if (endIndex < totalDocuments) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advanceResults = {
    succes: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advanceResults;
