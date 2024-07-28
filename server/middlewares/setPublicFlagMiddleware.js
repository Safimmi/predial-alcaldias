const setPublicFlag = (req, res, next) => {
  res.locals.public = true;
  next();
};

module.exports = setPublicFlag;
