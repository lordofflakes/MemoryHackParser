const fs = require('fs')
const request = require('request')
const Jimp = require('jimp')
const uuid = require('uuid')
const downloadsFolder = 'downloads/'

const download = (downAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const name = uuid.v4()
      request
        .get(downAddress)
        .on('error', function (err) {
          console.error(err)
        })
        .pipe(fs.createWriteStream(downloadsFolder + name))
        .on('close', () => resolve(downloadsFolder + name))
    } catch (e) {
      reject(e)
    }
  })
}

const convertToJPG = (openAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const name = uuid.v4()
      await Jimp.read(openAddress, (err, pic) => {
        if (err) resolve(false)
        else {
          pic
            .quality(60)
            .writeAsync(downloadsFolder + name + '.jpg').then((Result) => {
              resolve(downloadsFolder + name + '.jpg')
            })
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  download,
  convertToJPG
}
