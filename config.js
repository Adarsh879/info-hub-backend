module.exports = {
  db: {
    prod: "mongodb://localhost:27017/info-hub",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: "development_secret",
    expiry: "7d",
  },
};
