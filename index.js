const request 	= require('request')
const cheerio 	= require('cheerio')
const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities()
const Realm = require('realm')
const schema = require('./schema')
const striptags = require('striptags')
const uuid = require('uuid')

console.log(uuid.v1())

// let realm = new Realm({schema: [schema.Veteran, schema.FacePhoto], schemaVersion: 1 })

function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function getPolkHtmlByName (firstname, lastname) {
  console.log('1')
  await timeout(1000)
  console.log('2')
  await timeout(1000)
  console.log('3')
  await timeout(1000)
  return 'SHIT'
}

async function main () {
  const html = await getPolkHtmlByName('Герасименко', 'Василий').catch(e => console.log(e))
  console.log(html)
}

main()
