const request 	= require('request')
const cheerio 	= require('cheerio')
const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities()
const Realm = require('realm')
const schema = require('./schema')
const striptags = require('striptags')
const uuid = require('uuid')

console.log(uuid.v1())

let realm = new Realm({schema: [schema.Veteran, schema.FacePhoto], schemaVersion: 1 })

function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getPolkHtmlByName (firstname, lastname) {
  return new Promise((resolve, reject) => {
    request(`https://www.moypolk.ru/search/soldiers?s=${encodeURIComponent(lastname)}%20${encodeURIComponent(firstname)}`, (error, response, html) => {
      if (error) reject(error)
      else resolve(html)
    })
  })
}

async function main () {
  const html = await getPolkHtmlByName('Герасименко', 'Василий').catch(e => console.log(e))
  if (html) {
    
  }
}

main()
