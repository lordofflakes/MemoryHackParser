const Realm = require('realm')
const schema = require('./utility/schema')
const moypolkSearch = require('./utility/moypolkSearch')
const writeStories = require('./utility/writeStories')

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
const alphabet = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ь', 'Ы', 'Э', 'Ю', 'Я']

async function main () {
  console.log('Moypolk stage 1')

  for (const f of alphabet) {
    for (const s of alphabet) {
      const query = `${f}${s}`
      console.log('Searching at ', query)
      const stories = await moypolkSearch(query)
      writeStories(stories, realm)
      await timeout(100)
    }
  }

  console.log('Moypolk stage 2')

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
