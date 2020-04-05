const Realm = require('realm')
const schema = require('./schema')
const uuid = require('uuid')
const fs = require('fs')
const realm = new Realm({ schema: [schema.Veteran, schema.FacePhoto], schemaVersion: 4, path: 'knigapodviga.realm' })
const compare = require('./compare')
const pic = require('./pictureWorker')

compare.initialize()

const capitalize = function (string, lower = true) {
  return (lower ? string.toLowerCase() : string).replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase() })
}

const capitalizeFirst = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const searchDublicate = function (firstName, middleName, lastName) {
  const trimFirstName = firstName.trim()
  const capFirstName = capitalize(trimFirstName)
  const lowerFirstName = trimFirstName.toLowerCase()
  const capFirstFirstName = capitalizeFirst(lowerFirstName)
  const upperFirstName = trimFirstName.toUpperCase()

  const trimMiddleName = middleName.trim()
  const capMiddleName = capitalize(trimMiddleName)
  const lowerMiddleName = trimMiddleName.toLowerCase()
  const capFirstMiddleName = capitalizeFirst(lowerMiddleName)
  const upperMiddleName = trimMiddleName.toUpperCase()

  const trimLastName = lastName.trim()
  const capLastName = capitalize(trimLastName)
  const lowerLastName = trimLastName.toLowerCase()
  const capFirstLastName = capitalizeFirst(lowerLastName)
  const upperLastName = trimLastName.toUpperCase()

  const firstNameQ = '(firstName = $0 OR firstName = $1 OR firstName = $2 OR firstName = $3 OR firstName = $4)'
  const middleNameQ = '(middleName = $5 OR middleName = $6 OR middleName = $7 OR middleName = $8 OR middleName = $9)'
  const lastNameQ = '(lastName = $10 OR lastName = $11 OR lastName = $12 OR lastName = $13 OR lastName = $14)'

  const dublicate = realm
    .objects('Veteran')
    .filtered(firstNameQ + ' AND ' + middleNameQ + ' AND ' + lastNameQ,
      trimFirstName, capFirstName, lowerFirstName, capFirstFirstName, upperFirstName, trimMiddleName, capMiddleName, lowerMiddleName, capFirstMiddleName, upperMiddleName, trimLastName, capLastName, lowerLastName, capFirstLastName, upperLastName)
  if (dublicate.length > 1) {
    const dubleArray = []
    for (const duble of dublicate) {
      dubleArray.push(duble)
    }
    return dubleArray
  } else return false
}

const checkVeteranAdequate = function (Veteran) {
  let cnt = 0
  let string = Veteran.firstName
  string.replace(/\s+/g, '')
  if (string === '') {
    cnt++
  }
  string = Veteran.lastName
  string.replace(/\s+/g, '')
  if (string === '') {
    cnt++
  }
  string = Veteran.middleName
  string.replace(/\s+/g, '')
  if (string === '') {
    cnt++
  }
  if (cnt > 1) return false
  else return true
}

const starterCheck = function (veteran) {
  let allOrigins = []
  let result = searchDublicate(veteran.firstName, veteran.middleName, veteran.lastName)
  if (result) allOrigins = allOrigins.concat(result)
  result = searchDublicate(veteran.firstName, veteran.lastName, veteran.middleName)
  if (result) allOrigins = allOrigins.concat(result)
  result = searchDublicate(veteran.middleName, veteran.firstName, veteran.lastName)
  if (result) allOrigins = allOrigins.concat(result)
  result = searchDublicate(veteran.middleName, veteran.lastName, veteran.firstName)
  if (result) allOrigins = allOrigins.concat(result)
  result = searchDublicate(veteran.lastName, veteran.firstName, veteran.middleName)
  if (result) allOrigins = allOrigins.concat(result)
  result = searchDublicate(veteran.lastName, veteran.middleName, veteran.firstName)
  if (result) allOrigins = allOrigins.concat(result)
  if (allOrigins.length === 0) return false
  else return allOrigins
}

const getDiscriptor = async function (veteran) {
  return new Promise(async (resolve, reject) => {
    try {
      if (veteran.facePhotos.length > 0) {
        const desc = veteran.facePhotos[0].descriptor
        if (desc.replace(/\s+/g, '') === '') {
          const addressSave = await pic.download(veteran.facePhotos[0].url)
          const addressConvert = await pic.convertToJPG(addressSave)
          if (addressConvert) {
            fs.unlinkSync(addressSave)
            const n = await compare.getNumberOfPeoples(addressConvert)
            if (n === 1) {
              await compare.getDescriptor(addressConvert)
                .then(result => {
                  fs.unlinkSync(addressConvert)
                  realm.write(() => {
                    veteran.facePhotos[0].descriptor = JSON.stringify(result)
                  })
                  resolve(veteran.facePhotos[0].descriptor)
                })
                .catch(e => {
                  fs.unlinkSync(addressConvert)
                  resolve(false)
                })
            } else {
              fs.unlinkSync(addressConvert)
              resolve(false)
            }
          } else {
            resolve(false)
          }
        }
        else resolve(veteran.facePhotos[0].descriptor)
      }
    } catch (e) {
      reject(e)
    }
  })
}

const checkPictures = async function (testSubject, originSubject) {
  return new Promise(async (resolve, reject) => {
    try {
      const mainDesc = await getDiscriptor(testSubject)
      let isCopy = false
      if (mainDesc) {
        for (const orig of originSubject) {
          const desc = await getDiscriptor(orig)
          isCopy = await compare.compare2Descriptors(JSON.parse(mainDesc), JSON.parse(desc))
          if (isCopy) break
        }
        if (isCopy) {
          resolve(true)
        } else resolve(false)
      } else resolve(false)
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  checkVeteranAdequate,
  starterCheck,
  checkPictures
}
