# README #

### Парсер для MemomyHack ###

Приложение занимается парсингом фотографий ветеранов и последующей фильтрацией из следующих источников:
* Сайт "Бессмертный полк": https://www.moypolk.ru
* Сайт "Книга Подвига": http://www.knigapodviga.ru

### Запуск парсера ###

* npm install
* npm start

### Параметры ###
* polk_skip - Пропускает парсинг https://www.moypolk.ru
* kniga_skip - Пропускает парсинг http://www.knigapodviga.ru
* filter_skip - Пропускает фильтрацию

Например:
`npm start polk_skip kniga_skip`
