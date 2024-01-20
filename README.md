<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Описание

API для финансового приложения "Кредитный менеджер" на NestJS

## Установка

```bash
# Установка пакетов
$ npm install

# Копирование шаблона для env настроек проекта 
$ cp .env.example .env
```

## Настройка Prisma ORM

```bash
# Обновление моделей БД 
$ npx prisma generate

# Добавить изменения в БД
$ npx prisma db pull

# Создание миграций
$ npx prisma migrate dev --name init

# Запуск сидов, заполняющих таблицы тестовыми данными
$ npx prisma db seed
```

## Запуск приложения

```bash
# В режиме разработки
$ npm run start:dev
```

```bash
# В продакшн режиме
$ npm run start:prod
```

## О проекте

Готовое API со встроенным Сваггером, установленными необходимыми пакетами, реализованной авторизацией по JWT токену,
а так же с реализацией блока пользователей, как примера CRUD.
Рутовый пользователь - u:root@gmail.com p:root

## Авторы

- Author - [ASt](https://github.com/ast39)
- Telegram - [@ASt39](https://t.me/ASt39)

## Лицензия
Открытая, со ссылкой на автора 