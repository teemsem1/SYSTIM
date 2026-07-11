require("dotenv").config();

module.exports = {
  token: process.env.TOKEN,
  prefix: "!",
  owner: process.env.OWNER || "869944197472456794"
};
