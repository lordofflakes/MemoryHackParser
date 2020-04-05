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
    feats: 'string',
    featsImages: 'string[]',
    bio: 'string',
    possiblyRelated: 'Veteran[]',
    profileUrl: 'string',
    origin: { type: 'bool', default: false },
    filled: { type: 'bool', default: false }
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
