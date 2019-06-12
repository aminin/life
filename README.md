# Игра «Жизнь»

## Установка зависимостей

Для работы с проектом понадобятся

 * PHP 7.2
 * Node 10

```bash
# JS зависимости
npm install
# PHP зависимости
composer install
```

## Запуск

Веб-сервер

```bash
# запускается командой
php -S 127.0.0.1:8000 -t public/
```

Сборка JS и CSS

```bash
# запускается командой
npm run watch
# или
npm run build
```

## Дано

### Игра «Жизнь»

см. [Игра_«Жизнь»]

Реализация на языке JavaScript (см. файл `assets/js/life.js`) создаёт игровое поле соответствующее
размеру окна браузера и запускает игру из случайного начального состояния.

### Веб-сервер

Умеет хранить матрицы начальных состояний игры «Жизнь».

```json
// Пример начального состояния игры «Жизнь»
{
  "1": {
    "id": 1,
    // Название
    "name": "Матрица",
    // Ширина поля
    "width": 10,
    // Высота поля
    "height": 10,
    // Информация о состоянии клеток игрового поля.
    // Каждая клетка кодируется двоичным кодом 1 - живая клетка, 0 - мёртвая
    // Последовательность нулей и единиц соединяется в одну строку и преобразуется в цестнадцатиричный код
    "data": "FD44CF5C716A0385EAB4D9E84F13C454"
  }
}
```

Веб-сервер отвечает на следующие запросы:

```
 -------------------- -------- -------- ------ -------------------------- -------------------------- 
  Name                 Method   Scheme   Host   Path                       Comment
 -------------------- -------- -------- ------ -------------------------- -------------------------- 
  index_html           ANY      ANY      ANY    /                          Главная страница
  api_matrix_list      GET      ANY      ANY    /api/matrix                Список всех матриц (JSON)
  api_matrix_create    POST     ANY      ANY    /api/matrix                Создание матрицы (JSON-request-body)
  api_matrix_show      GET      ANY      ANY    /api/matrix/{id}           Просмотр матрицы (JSON)
  api_matrix_delete    DELETE   ANY      ANY    /api/matrix/{id}           Удаление матрицы
  api_matrix_deletee   GET      ANY      ANY    /api/matrix/{id}/destroy   Удаление матрицы
 -------------------- -------- -------- ------ -------------------------- -------------------------- 

```

## Задание

 * Создать Backbone приложение на языке CoffeeScript.
 * Страница приложения должна содержать боковую панель навигации и основную область
 * Навигация должна содержать кнопки _Создать игру_ и _Список игр_
 * В основной области приложения могут отображаться
    - Список игр — cписок сохранённых начальных состояний игры «Жизнь».
      При клике на игру в списке, открывается экран просмотра игры.
        или
    - Экран создания игры на котором задаётся размер поля и расположение живых клеток.
      Живые клетки можно создавать вручную или генерировать случайно
        или
    - Экран просмотра игры (На котором можно запустить игру, остановить, запустить сначала или вернйться к списку игр)

## Ссылки

[Backbone.js]: http://backbonejs.org/
[Backbone.js по-русски]: http://backbonejs.ru/
[Marionette.js]: https://marionettejs.com/
[CoffeeScript]: https://coffeescript.org/#functions
[Twitter Bootstrap]: https://getbootstrap.com
[Игра_«Жизнь»]: https://ru.wikipedia.org/wiki/Игра_«Жизнь»
