const express = require("express");
const router = express.Router();
const {
  validateUser,
  signup,
  authenticate,
  listUsers,
  search,
  find,
} = require("../controller/users");

const {
  loadQuestions,
  questionValidate,
  createQuestion,
  show,
  listQuestions,
  listByTags,
  listByUser,
  removeQuestion,
} = require("../controller/questions");
const {
  loadComments,
  validate,
  createComment,
  removeComment,
} = require("../controller/comments");
const {
  loadAnswers,
  answerValidate,
  createAnswer,
  removeAnswer,
} = require("../controller/answers");
const { upvote, downvote, unvote } = require("../controller/votes");
const { listPopulerTags, searchTags, listTags } = require("../controller/tags");

const requireAuth = require("../middlewares/requireAuth");
const questionAuth = require("../middlewares/questionAuth");
const answerAuth = require("../middlewares/answerAuth");

// authenticate
router.post("/signup", signup);
router.post("/authenticate", authenticate);

//questions
router.param("question", loadQuestions);
router.get("/question", listQuestions);
router.post("/questions", [requireAuth, questionValidate], createQuestion);
router.get("/question/:question", show);
router.delete(
  "/question/:question",
  [requireAuth, questionAuth],
  removeQuestion
);

//tags
router.get("/tags/populertags", listPopulerTags);
router.get("/tags/:tag", searchTags);
router.get("/tags", listTags);

//answers
router.param("answer", loadAnswers);
router.post("/answer/:question", [requireAuth], createAnswer);
router.delete(
  "/answer/:question/:answer",
  [requireAuth, answerAuth],
  removeAnswer
);

//votes
router.get("/votes/upvote/:question/:answer?", requireAuth, upvote);
router.get("/votes/downvote/:question/:answer?", requireAuth, downvote);
router.get("/votes/unvote/:question/:answer?", requireAuth, unvote);

module.exports = router;
