const getPredialPage = async (req, res, next) => {
  const { ctx } = req.tenant;
  res.render('main', ctx);
};

module.exports = {
  getPredialPage
};
