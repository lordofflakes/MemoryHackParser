const Realm = require('realm')
const schema = require('./schema')
const realm = new Realm({ schema: [schema.Veteran, schema.FacePhoto], schemaVersion: 4, path: 'knigapodviga.realm' })
const checkers = require('./checkers')

const setOrigin = function (veteran) {
  realm.write(() => {
    veteran.origin = true
  })
}

async function main () {
  const veterans = realm.objects('Veteran')
  cnt = 0
  cnt_origin = 0
  for (const veteran of veterans) {
    console.log(`Checked ${cnt} veterans found ${cnt_origin} original ones`)
    cnt++
    if (!checkers.checkVeteranAdequate(veteran)) continue
    const origins = checkers.starterCheck(veteran)
    if (origins) {
      if (await checkers.checkPictures(veteran, origins)) continue
    }
    setOrigin(veteran)
    cnt_origin++
  }
}

main()
