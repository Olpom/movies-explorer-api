# movies-explorer-api: бэкенд для дипломного проекта    

**Описание**    

Добро пожаловать в репозиторий бэкенда для дипломного проекта "movies-explorer-api", выполненного в рамках курса "Веб-разработчик" от Яндекс Практикума.    
Это реализация API, развернутого на облачном сервере Яндекс Облака, доступного по публичному IP-адресу и поддерживающего безопасное соединение через HTTPS.    

**Использование сервера**    

В отличие от локальной разработки, для продакшена сервер размещается в Яндекс Облаке, обеспечивая доступ к API проекта из любой точки мира.    
Благодаря использованию домена, подключенного к серверу, API проекта можно достичь по доменному имени.    

**Безопасность**    

При написании кода я придерживалась безопасных практик работы с сервером.    
В частности, .env файл с переменными окружения хранится только на сервере и содержит важные настройки, такие как NODE_ENV=production и JWT_SECRET для создания и проверки JWT. .env файл недоступен в репозитории.      

Код предназначен для работы в продакшене, однако при необходимости он может быть запущен в режиме разработки без .env файла, если process.env.NODE_ENV !== 'production'.    

**Подключение**    

IP 84.201.134.38     
Просмотреть код и внести свои изменения можно в [репозитории на GitHub.](https://github.com/Olpom/movies-explorer-api.git)   
Для прямого обращения к API используйте этот домен: https://olpoma-diploma.nomoreparties.sbs/api/     
