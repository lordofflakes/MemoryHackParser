const moypolk = require('./moypolk')
const knigapodviga = require('./knigapodviga')
const filter = require('./filter')

async function main () {
  console.log('Parsing knigapodviga.ru')
  await knigapodviga()
  console.log('Parsing moypolk.ru')
  await moypolk()
  console.log('Filtering results')
  filter()
}
main()
