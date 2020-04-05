const Realm = require('realm')
const schema = require('./schema')
const moypolkSearch = require('./moypolkSearch')
const writeStories = require('./writeStories')

function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const realm = new Realm({ schema: [schema.Veteran, schema.FacePhoto], schemaVersion: 4, path: 'realm/default.realm' })
const searchHistoryRealm = new Realm({
  path: 'realm/searchHistory.realm',
  schema: [{
    name: 'History',
    properties: { query: 'string' }
  }]
})

async function main () {
  const entries = Array.from(realm.objects('Veteran'))
  const count = entries.length
  for (const i in entries) {
    const veteran = entries[i]
    const query = veteran.lastName
    const searches = searchHistoryRealm.objects('History').filtered('query = $0', query)
    if (searches.length === 0) {
      console.log(`Query ${i}/${count}: ${query}`)
      const stories = await moypolkSearch(query)
      writeStories(stories, realm)
      searchHistoryRealm.write(() => searchHistoryRealm.create('History', { query }))
    } else {
      console.log('Skip', query)
    }
    await timeout(10)
  }
}

main()
