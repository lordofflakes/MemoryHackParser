const Realm = require('realm')
const schema = require('./utility/schema')
const realm = new Realm({ schema: [schema.Veteran, schema.FacePhoto], schemaVersion: 4, path: 'realm/default.realm' })
const checkers = require('./utility/checkers')

const setOrigin = function (veteran) {
  realm.write(() => {
    veteran.origin = true
  })
}

async function main () {
  const veterans = realm.objects('Veteran')
  let cnt = 0
  let cntOrigin = 0
  for (const veteran of veterans) {
    console.log(`Checked ${cnt} veterans found ${cntOrigin} original ones`)
    cnt++
    if (veteran.origin) {
      cntOrigin++
      continue
    }
    if (!checkers.checkVeteranAdequate(veteran)) continue
    const origins = checkers.starterCheck(veteran, realm)
    if (origins) {
      if (await checkers.checkPictures(veteran, origins, realm)) continue
    }
    setOrigin(veteran)
    cntOrigin++
  }
}

module.exports = main
