const Predial = require("../models/predial");

const getPredialById = async (req, res, next) => {
  try {
    //TODO: Use "ficha" as the ID on the DB so it can be indexed => Use .findById() instead of .findOne()
    // TODO: Do data validation to prevent SQL injection
    const { id } = req.params;
    const query = { ficha: { $in: [id] } };
    const predial = await Predial.findOne(query);

    if (!predial) {
      res.status(404);
      throw new Error(`Can't find predial ${id}`);
    }

    res.status(200).json(predial);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPredialById
};
