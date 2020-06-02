const concurrently = require('concurrently')

console.log(process.argv, 'process.argv')
let [version = ''] = process.argv.filter(
  (item, index) => {
    if (index > 1) {
      return item[index]
    }
  }
)
console.log(version, 'version')

concurrently([
  `npm version ${version}`,
  `npm run serve --appVersion=v${version}`
])