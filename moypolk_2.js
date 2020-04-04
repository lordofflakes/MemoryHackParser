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

function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const realm = new Realm({ schema: [schema.Veteran, schema.FacePhoto], schemaVersion: 3, path: 'realm/default.realm' })
const searchHistoryRealm = new Realm({
  path: 'realm/searchHistory.realm',
  schema: [{
    name: 'History',
    properties: { query: 'string' }
  }]
})

async function main () {
  const entries = Array.from(realm.objects('Veteran'))
  console.log()
  for (const i in entries) {
    const veteran = entries[i]
    const query = veteran.lastName
    const searches = searchHistoryRealm.objects('History').filtered('query = $0', query)
    if (searches.length === 0) {
      searchHistoryRealm.write(() => searchHistoryRealm.create('History', { query }))
      console.log('Search', query)
      const stories = await moypolkSearch(query)
      writeStories(stories, realm)
    } else {
      console.log('Skip', query)
    }
    await timeout(10)
  }
}

main()
