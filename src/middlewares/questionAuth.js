const questionsAuth = (req, res, next) => {
  if (req.question.author.equals(req.user.id)) return next();
  res.status(401).end();
};

module.exports = questionsAuth;
