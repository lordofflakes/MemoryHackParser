const Veteran = {
  name: 'Veteran',
  properties: {
    uuid: 'string',
    firstName: 'string',
    lastName: 'string',
    middleName: 'string',
    yearBorn: 'int',
    facePhotos: 'FacePhoto[]',
    rank: 'string',
    featsImages: 'string[]',
    bio: 'string',
    possiblyRelated: 'Veteran[]'
  }
}
const FacePhoto = {
  name: 'FacePhoto',
  properties: {
    url: 'string',
    descriptor: 'string'
  }
}

module.exports = Object.freeze({
  Veteran,
  FacePhoto
})
