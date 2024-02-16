# Project structure

/
├── .env
├── package.json
├── yarn.lock 
├── README.md 
├── src
│   ├── config (group routes)
│   ├── controllers (call usescases. Controllers should be as thin as possible)
│   ├── database (has migrations and run db init, also has db entities if needed and mappers for them)
│   ├── entities (has domain entities and mappers for them if needed)
|   ├── extensions (validation)
│   ├── middlewares (auth, not fond page, etc.)
│   ├── repositories (communication with db)
│   ├── routes (group routes)
│   ├── services (call another backend, receive response and map it to domain entity)
│   ├── usecases (business logic and calls repositories, or services)
│   ├── utils (helper functions)
├── migrations
├── tests  (TODO, maybe add test not in special folder, but in src like user.repository.ts and user.repository.test.ts)
├── .gitignore  
├── .eslintrc (TODO)