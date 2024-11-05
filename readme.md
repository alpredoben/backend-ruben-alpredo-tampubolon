### Rest API Documentation

> > > http://localhost:[port]/documentation

### Login Credential

1. Customer Account

```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

2. Merchant Account

```json
{
  "email": "merchant@example.com",
  "password": "password123"
}
```

### Manual Setup Application

1. Clone Project
2. Install Dependency

```cli
  npm install
```

3. Copy file .env.example to .enn

```cli
  cp .env.example .env
```

4. Setup database environment

```
  DB_DRIVER=mysql
  DB_HOST=localhost
  DB_PORT=3306
  DB_NAME=databaseName
  DB_USER=yourUsername
  DB_PASS=yourPassword

```

5. Run Migration

```cli
  npx sequelize db:migrate --config src/configs/config.js
```

6. Run Seeder

```cli
  npx sequelize db:seed:all --config src/configs/config.js
```

7. Run Application

```cli
  npm run dev
```

### Setup Application Via Dockerfile

Running command below :

```cli
  docker compose -f docker-compose.dev.yml up --build --remove-orphans --force-recreate -d
```
