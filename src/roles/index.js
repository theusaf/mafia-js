const fs = require("fs"),
  roleMap = {},
  roles = fs.readdirSync(__dirname, {
    withFileTypes: true
  }).filter((file) => {
    return file.isFile() && /\.js$/.test(file.name) && file.name !== "index.js";
  }).map((file) => {
    return require(`./${file.name}`);
  }),
  Cleaned = require("./other/Cleaned");

roles.push(Cleaned);

for (const role of roles) {
  const test = new role,
    name = test.getName(true);
  roleMap[name] = role;
}

module.exports = {
  roles,
  roleMap
};
