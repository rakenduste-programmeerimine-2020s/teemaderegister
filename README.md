# teemaderegister

# Docs

## 1. Install required dependencies

Inside `local-dev` folder run next install commands

```
docker-compose run --rm --no-deps tr-node install
docker-compose run --rm --no-deps tr-react install
```

## 2. Start docker containers

Inside `local-dev` folder to run locally start with next command
```
docker-compose up -d
```

Ports that are available from docker machine
* `8080` - nginx
* `3000` - Node server
* `27017` - Mongo Database
* `3446` - webpack hot reload


## 3. Import sample database

Login to tr-mongo container from local machine (use Docker dashboard or next command)

```
docker exec -it tr-mongo bash
```

Inside container run next command to restore database

```
mongorestore --uri mongodb://root:root@tr-mongo/teemaderegister?authSource=admin --drop --dir /teemaderegister
```

### If needed export database for local seed update

Login to tr-mongo container from local machine (use Docker dashboard or next command)

```
docker exec -it tr-mongo bash
```

Inside container and inside `/teemaderegister/teemaderegister` directory run next command that will create `dump` folder and is synced to `local-dev/data/seed/dump` and could be used to replace initial seed files

```
mongodump --uri mongodb://root:root@tr-mongo/teemaderegister?authSource=admin
```