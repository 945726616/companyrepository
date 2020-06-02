const concurrently = require('concurrently');

let version = process.argv.filter((itm, idx) => idx === 1);

concurrently([
    `npm version ${ version }`,
    `npm run build --appVersion=v${ version }`
]);