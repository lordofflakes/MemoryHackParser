const tf = require('@tensorflow/tfjs-node')
const fs = require('fs')
const canvas = require('canvas')

const faceapi = require('face-api.js')

const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

const initialize = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models')
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./models')
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./models')
}

function getPhotoTensor(pathPhoto) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathPhoto, (err, buffer) => {
      if (err) {
        reject(err)
      }
      else {
        const input = tf.node.decodeImage(new Uint8Array(buffer))
        resolve(input)
      }
    })
  })
}

const getNumberOfPeoples = imagePath => {
  return new Promise(async (resolve, reject) => {
    try {
      const input = await getPhotoTensor(imagePath)
      faceapi.detectAllFaces(input).then(async () => {
        const detections = await faceapi.detectAllFaces(input)
        resolve(detections.length)
      }).catch(e => reject(e))
    } catch (e) {
      reject(e)
    }
  })
}

const getDescriptor = imagePath => {
  return new Promise(async (resolve, reject) => {
    try {
      const input = await getPhotoTensor(imagePath)
      faceapi.detectAllFaces(input).then(async () => {
        const detections = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors()
        resolve(detections[0].descriptor)
      }).catch(e => reject(e))
    } catch (e) {
      reject(e)
    }
  })
}

const compare2Descriptors = (desc1, desc2) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dist = faceapi.euclideanDistance(desc1, desc2)
      if (1 - dist > 0.6) resolve(true)
      else resolve(false)
    }
    catch (e) {
      reject(e)
    }
  })
}

const compare = (imagePath1, imagePath2) => {
  return new Promise(async (resolve, reject) => {
    try {
      // https://cdn.moypolk.ru/static/resize/w390/soldiers/photo/2020/04/04/5cef4dcd114654b5a257664746abbac9.jpeg
      const desc1 = await getDescriptor(imagePath1)
      const desc2 = await getDescriptor(imagePath2)
      const dist = faceapi.euclideanDistance(desc1, desc2)
      if (1 - dist > 0.6) resolve(true)
      else resolve(false)
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  initialize,
  compare,
  getDescriptor,
  compare2Descriptors,
  getNumberOfPeoples
}

// initialize().then(async () => {
//   const name1 = uuid.v4()
//   const name2 = uuid.v4()
//   const name3 = uuid.v4()
//   const name4 = uuid.v4()
//   await download('https://cdn.moypolk.ru/static/resize/w1000/soldiers/unknown/2020/04/03/072f0be88c2c5ad0f253b35b66e3fd22.jpeg', `Downloads/${name1}`)
//   await download('https://cdn.moypolk.ru/static/resize/w512/soldiers/photo/2020/04/04/aac2708efcaab9f9993f0a01fe049a32.jpeg', `Downloads/${name2}`)
//   await convertToJPG(`Downloads/${name1}`, `Downloads/${name3}.jpg`)
//   await convertToJPG(`Downloads/${name2}`, `Downloads/${name4}.jpg`)
//   await getNumberOfPeoples(`Downloads/${name3}.jpg`).then((res) => console.log(res))
//   await compare(`Downloads/${name3}.jpg`, `Downloads/${name4}.jpg`).then((Result) => {
//     fs.unlinkSync(`Downloads/${name1}`)
//     fs.unlinkSync(`Downloads/${name2}`)
//     fs.unlinkSync(`Downloads/${name4}.jpg`)
//     fs.unlinkSync(`Downloads/${name3}.jpg`)
//   })
// })
