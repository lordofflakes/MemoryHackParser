const moypolk = require('./moypolk')
const knigapodviga = require('./knigapodviga')
const filter = require('./filter')
require('colors')

async function main () {
  console.log('Parsing moypolk.ru'.bold.green)
  await moypolk()
  console.log('Parsing knigapodviga.ru'.bold.green)
  await knigapodviga()
  console.log('Filtering results'.bold.green)
  filter()
}
main()
