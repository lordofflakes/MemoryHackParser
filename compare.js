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

function getPhotoTensor (pathPhoto) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathPhoto, (err, buffer) => {
      if (err) {
        reject(err)
      } else {
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

const generateDescriptor = imagePath => {
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
    } catch (e) {
      reject(e)
    }
  })
}

const compare = (imagePath1, imagePath2) => {
  return new Promise(async (resolve, reject) => {
    try {
      // https://cdn.moypolk.ru/static/resize/w390/soldiers/photo/2020/04/04/5cef4dcd114654b5a257664746abbac9.jpeg
      const desc1 = await generateDescriptor(imagePath1)
      const desc2 = await generateDescriptor(imagePath2)
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
  generateDescriptor,
  compare2Descriptors,
  getNumberOfPeoples
}
