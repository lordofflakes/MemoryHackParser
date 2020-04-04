const request = require('request')

function getDataFromPodvigNaroda (startNumber, numberOfNames) {
  return new Promise((resolve, reject) => {
    request.post({
      url: 'http://podvignaroda.ru/Image3/newsearchservlet',
      form: {
        json: 1,
        xmlParam: `<request firstRecordPosition="${startNumber}" maxNumRecords="${numberOfNames}" countResults="true"><record entity="Человек Награждение"></record><record entity="Человек Представление"></record><record entity="Человек Картотека"></record><record entity="Человек Юбилейная Картотека"></record></request>`
      }
    },
    function (error, response, html) {
      if (error) reject(error)
      else resolve(html)
    })
  })
}

async function main () {
  const data = await getDataFromPodvigNaroda(0, 100).catch(e => console.log(e))
  if (data) {
    const jsoned = JSON.parse(data)
    for (const hero in jsoned.records) {
      console.log(`${jsoned.records[hero].f2} ${jsoned.records[hero].f3} ${jsoned.records[hero].f4} ${jsoned.records[hero].f6}`)
    }
  }
}

main()