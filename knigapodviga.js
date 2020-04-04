const request = require('request')
const cheerio = require('cheerio')
const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities()
const Realm = require('realm')
const schema = require('./schema')
const striptags = require('striptags')
const uuid = require('uuid')

const realm = new Realm({ schema: [schema.Veteran, schema.FacePhoto], schemaVersion: 3, path: 'default.realm' })

async function main () {
  const letterURLs = await getLeterURLS()
  for (const letter of letterURLs) {
    console.log('Parsing letter', entities.decode(letter.title))
    const people = await getPeopleURLS(letter.href).catch(e => console.log('Failed getting peoples url', e.message))
    if (people) {
      for (const human of people) {
        const humanName = striptags(entities.decode((human.name)))

        const [lastName = '', firstName = '', middleName = ''] = humanName.split(' ')
        const humanData = await getHumanData(human.href).catch(e => console.log('Failed to get human data', e.message))
        if (humanData) {
          const {
            yearBorn,
            bio,
            image,
            feats
          } = humanData
          realm.write(() => {
            const facePhoto = realm.create('FacePhoto', {
              url: image,
              descriptor: ''
            })
            realm.create('Veteran', {
              uuid: uuid.v1(),
              firstName,
              lastName,
              middleName,
              yearBorn,
              feats,
              rank: '',
              profileUrl: '',
              filled: true,
              bio,
              facePhoto: [facePhoto]
            })
          })
        }
      }
    }
  }
}

function getLeterURLS () {
  return new Promise((resolve, reject) => {
    request('http://www.knigapodviga.ru/10501085108010751072-1087108610761074108010751072.html', (error, response, html) => {
      if (error) reject(error)
      else {
        const $ = cheerio.load(html)
        const paragraphs = $('.paragraph')
        const aElements = $('a', paragraphs[0])
        const urls = []
        aElements.each((index, element) => {
          urls.push({
            href: $(element).attr('href'),
            title: $(element).html()
          })
        })
        resolve(urls)
      }
    })
  })
}

function getPeopleURLS (url) {
  console.log('get people')
  return new Promise((resolve, reject) => {
    request('http://www.knigapodviga.ru/' + url, (error, response, html) => {
      if (error) reject(error)
      else {
        const $ = cheerio.load(html)
        const paragraphs = $('.paragraph')
        const aElements = $('a', paragraphs[0])
        const urls = []
        aElements.each((index, element) => {
          urls.push({
            href: $(element).attr('href'),
            name: $(element).html()
          })
        })
        resolve(urls)
      }
    })
  })
}

function getHumanData (url) {
  return new Promise((resolve, reject) => {
    console.log('http://www.knigapodviga.ru/' + url)
    request('http://www.knigapodviga.ru/' + url, (error, response, html) => {
      if (error) reject(error)
      else {
        const $ = cheerio.load(html)
        const image = $('#content img').attr('src')
        const paragraphs = $('.paragraph')
        const paragraph0Data = striptags(entities.decode($(paragraphs[0]).html()), [], '\n')
        const splitData = paragraph0Data.split('\n\n\n')
        let feats = ''
        let featInNext = false
        for (const i in splitData) {
          if (featInNext) {
            const cData = splitData[i]
            cData.replace(/\n/g, '')
            if (cData.length === 0) continue
            else {
              feats = splitData[i].replace(/\n/g, '')
              break
            }
          } else if (splitData[i].includes('Награды, звания')) {
            featInNext = true
          }
        }
        const paragraph1Data = paragraphs[1] ? striptags(entities.decode($(paragraphs[0]).html()), [], '\n') : ''
        const years = paragraph0Data.match(/\d{4}/g)
        const yearBorn = years ? years.reduce((prev, current) => {
          if (parseInt(current) < prev) return parseInt(current)
          else return prev
        }, 1945) : 0

        resolve({
          yearBorn,
          bio: `${paragraph1Data}`.replace(/\n\s*\n/g, '\n'),
          image: 'http://www.knigapodviga.ru/' + image,
          feats
        })
        // Награды, звания
      }
    })
  })
}

main()
