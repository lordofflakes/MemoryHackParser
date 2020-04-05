const request = require('request')
const cheerio = require('cheerio')
const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities()

const searchForStories = (query, page = 1, cards = []) => {
  return new Promise((resolve, reject) => {
    request(`https://www.moypolk.ru/search/soldiers?page=${page}&s=${encodeURIComponent(query)}`, (error, response, html) => {
      console.log('Got page', page)
      if (error) reject(error)
      else {
        const $ = cheerio.load(html)
        const searchCards = $('.search2__search-card')
        const cardsData = []
        searchCards.each((index, card) => {
          const img = $('.search-card__photo-container img', card).attr('src')
          if (img) {
            const wrapping = $('.search-card__wrap .search-card__wrapping a.search-card__caption', card)
            const [lastName, firstName, ...middleName] = entities.decode($(wrapping).html()).replace(/\n/g, '').replace(/\s\s+/g, ' ').trim().split(' ')
            const url = $(wrapping).attr('href')
            cardsData.push({ img: img.replace('/h200/', '/w390/'), lastName, firstName, middleName: middleName.join(' '), url })
          }
        })
        if (cardsData.length > 0) {
          resolve(searchForStories(query, page + 1, [...cards, ...cardsData]))
        } else {
          resolve(cards)
        }
      }
    })
  })
}

module.exports = searchForStories
