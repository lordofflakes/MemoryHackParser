const moypolk = require('./moypolk')
const knigapodviga = require('./knigapodviga')
const filter = require('./filter')
require('colors')

function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main () {
  if (process.argv.indexOf('polk_skip') < 0) {
    console.log('Parsing moypolk.ru'.bold.green)
    await moypolk()
  } else {
    console.log('Skipping moypolk.ru'.bold.yellow)
  }
  if (process.argv.indexOf('kniga_skip') < 0) {
    console.log('Parsing knigapodviga.ru'.bold.green)
    await knigapodviga()
  } else {
    console.log('Skipping knigapodviga.ru'.bold.yellow)
    await timeout(3000)
  }

  if (process.argv.indexOf('filter_skip') < 0) {
    console.log('Filtering results'.bold.green)
    await filter()
  } else {
    console.log('Skipping filter'.bold.yellow)
  }
  process.exit()
}
main()
