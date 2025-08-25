DB = process.env.MONGODB_INITDB_DATABASE;
USER = process.env.MONGO_USER;
PASSWORD = process.env.MONGO_PASSWORD;

db = db.getSiblingDB(DB);

db.createUser({
	user: USER,
	pwd: PASSWORD,
	roles: [{ role: 'readWrite', db: DB }],
});

db.createCollection('journeys');
db.createCollection('users');

db = db.getSiblingDB('test');

db.createUser({
	user: USER,
	pwd: PASSWORD,
	roles: [{ role: 'readWrite', db: 'test' }],
});
db.createCollection('journeys');
db.createCollection('users');
