const fs = require("fs");
const pathUtil = require("path");

const snippets = require("./etc/snippets/index");

function getNameUnderscored(name) {
  let firstChar = name[0].toLowerCase();
  let nName = name.toString();
  nName = firstChar + name.substring(1);
  return nName.replace(/([A-Z])/g, match => `_${match.toLowerCase()}`);
}

function getNameCamelCase(name) {
  let firstChar = name[0].toLowerCase();
  let nName = name.toString();
  return firstChar + name.substring(1);
}

function createFolders(directory) {
  let path = directory.replace(/\/$/, "").split("/");

  for (let i = 1; i <= path.length; i++) {
    let segment = path.slice(0, i).join("/");
    !fs.existsSync(segment) ? fs.mkdirSync(segment) : null;
  }
}

function createSnippets(name) {
  let name_underscored = getNameUnderscored(name);
  let name_camelcase = getNameCamelCase(name);
  let path = `src/apis/${name_underscored}`;
  let capitalRegex = new RegExp("__nameCapital__", "g");
  let lowerRegex = new RegExp("__nameLowerCase__", "g");
  let camelRegex = new RegExp("__nameCamelCase__", "g");
  
  createFolders(path);
  let controller = `${name_underscored}_controller.js`;
  let controllerContent = snippets.controller
    .replace(capitalRegex, name)
    .replace(lowerRegex, name_underscored);

  let repository = `${name_underscored}_repository.js`;
  let repositoryContent = snippets.repository
    .replace(capitalRegex, name)
    .replace(lowerRegex, name_underscored);

  let test = `${name_underscored}_test.js`;
  let testContent = snippets.test
    .replace(capitalRegex, name)
    .replace(lowerRegex, name_underscored);

  let validator = `${name_underscored}_validator.js`;
  let validatorContent = snippets.validator
    .replace(capitalRegex, name)
    .replace(lowerRegex, name_underscored);

  let schema = `${name_underscored}_schema.js`;
  let schemaContent = snippets.schema
    .replace(capitalRegex, name);

  let route = `${name_underscored}_route.js`;
  let routeContent = snippets.route
      .replace(capitalRegex, name)
      .replace(camelRegex, name_camelcase)
      .replace(lowerRegex, name_underscored)

  console.info(`Following files are created for ${name}`);
  let controllerPath = pathUtil.join(path, controller);
  let repositoryPath = pathUtil.join(path, repository);
  let testPath = pathUtil.join(path, test);
  let validatorPath = pathUtil.join(path, validator);
  let schemaPath = pathUtil.join(path, schema);
  let routePath = pathUtil.join(path, route);

  fs.appendFileSync(routePath, routeContent);
  console.info(`\t- ${routePath}`);
  fs.appendFileSync(controllerPath, controllerContent);
  console.info(`\t- ${controllerPath}`);
  fs.appendFileSync(repositoryPath, repositoryContent);
  console.info(`\t- ${repositoryPath}`);
  fs.appendFileSync(testPath, testContent);
  console.info(`\t- ${testPath}`);
  fs.appendFileSync(schemaPath, schemaContent);
  console.info(`\t- ${schemaPath}`);
  fs.appendFileSync(validatorPath, validatorContent);
  console.info(`\t- ${validatorPath}\n\n`);

  console.info("");
  console.info("Register your route to /apis/index.js");  
}

createSnippets(process.argv[2]);
