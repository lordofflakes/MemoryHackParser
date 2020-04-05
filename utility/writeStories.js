const uuid = require('uuid')
require('colors')

module.exports = function (stories, realm) {
  console.log(`Adding ${stories.length} stories`.green)

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
        const veteran = realm.create('Veteran', {
          uuid: uuid.v1(),
          firstName,
          lastName,
          middleName,
          yearBorn: 0,
          feats: '',
          rank: '',
          bio: '',
          filled: false,
          profileUrl: url
        })
        veteran.facePhotos.push(facePhoto)
      }
    }
    console.log('Collisions count: '.yellow, collisionsCount)
  })
}
