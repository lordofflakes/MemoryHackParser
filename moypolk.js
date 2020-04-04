const request = require('request')
const cheerio = require('cheerio')
const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities()
const Realm = require('realm')
const schema = require('./schema')
const striptags = require('striptags')
const uuid = require('uuid')
const moypolkSearch = require('./moypolkSearch')

function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const realm = new Realm({ schema: [schema.Veteran, schema.FacePhoto], schemaVersion: 3, path: 'moypolk.realm' })
const alphabet = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ь', 'Ы', 'Э', 'Ю', 'Я']

async function main () {
  for (const f of alphabet) {
    for (const s of alphabet) {
      const query = `${f}${s}`
      console.log('Searching at ', query)
      const stories = await moypolkSearch(query)
      console.log(`Adding ${stories.length} stories`)

      realm.write(() => {
        let collisionsCount = 0
        for (const { img = '', lastName, firstName, middleName = '', url = '' } of stories) {
          const existingStories = realm.objects('Veteran').filtered('profileUrl = $0', url)
          if (existingStories.length > 0) collisionsCount++
          if (existingStories.length === 0 && lastName && firstName) {
            const facePhoto = realm.create('FacePhoto', {
              url: img,
              descriptor: ''
            })
            realm.create('Veteran', {
              uuid: uuid.v1(),
              firstName,
              lastName,
              middleName,
              yearBorn: 0,
              feats: '',
              rank: '',
              bio: '',
              filled: false,
              profileUrl: url,
              facePhoto: [facePhoto]
            })
          }
        }
        console.log('Collisions count: ', collisionsCount)
      })
      await timeout(1000)
    }
  }
}

main()
