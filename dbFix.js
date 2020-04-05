const request = require('request')
const cheerio = require('cheerio')
const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities()
const Realm = require('realm')
const schema = require('./schema')
const striptags = require('striptags')
const uuid = require('uuid')
const moypolkSearch = require('./moypolkSearch')
const writeStories = require('./writeStories')

const realm = new Realm({ schema: [schema.Veteran, schema.FacePhoto], schemaVersion: 3, path: 'realm/default_backup_1.realm' })

const veterans = realm.objects('Veteran')
const faces = realm.objects('FacePhoto')
realm.write(() => {
  for (let i = 0; i < veterans.length; i++) {
    veterans[i].facePhotos.push(faces[i])
  }
})
