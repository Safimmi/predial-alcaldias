//TODO: Use "ficha" as the ID on the DB so it can be indexed => Use .findById() instead of .findOne()
const findPredialById = async (db, id) => {
  const predialModel = db.models.predial;
  const query = { ficha: { $in: [id] } };
  return await predialModel.findOne(query);
};

module.exports = {
  findPredialById
};
