compose-file = docker-compose.dev.yml
container-name = merchant-api
seeder-name = demo-orders
migration-name = create-orders


# Manual setup
install-package:
	npm install

add-new-seeder:
	npx sequelize-cli seed:generate --name $(seeder-name)

add-new-migration:
	npx sequelize migration:generate --name $(migration-name)


run-db:
	npx sequelize migration:generate --name $(migration-name) && npx sequelize-cli seed:generate --name $(seeder-name)

run-app:
	npm run dev

run-migrate:
	npx sequelize db:migrate --config src/configs/config.js

run-seed:
	npx sequelize db:seed:all --config src/configs/config.js



# Setup with docker
docker-start:
	docker compose -f $(compose-file) up -d

docker-start-watch:
	docker compose -f $(compose-file) up

docker-deploy:
	docker compose -f $(compose-file) up --build --remove-orphans --force-recreate -d

docker-deploy-watch:
	docker compose -f $(compose-file) up --build --remove-orphans --force-recreate

docker-down:
	docker compose -f $(compose-file) down --remove-orphans

docker-migrate:
	docker-compose -f $(compose-file) exec $(container-name) npx sequelize db:migrate --config src/configs/config.js

docker-seed:
	docker-compose -f $(compose-file) exec $(container-name) npx sequelize db:seed:all --config src/configs/config.js

