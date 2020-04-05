const fs = require('fs')
const request = require('request')
const Jimp = require('jimp')
const uuid = require('uuid')


const download = (downAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const name = uuid.v4()
      request
        .get(downAddress)
        .on('error', function (err) {
          console.error(err)
        })
        .pipe(fs.createWriteStream('Downloads/' + name))
        .on('close', () => resolve('Downloads/' + name))
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
        if (err) throw err
        pic
          .quality(60)
          .writeAsync('Downloads/' + name + '.jpg').then((Result) => {
            resolve('Downloads/' + name + '.jpg')
          })
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
