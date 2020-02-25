//global
require('dotenv').config();

//requirements
const express = require('express');
const Sequelize = require('sequelize');
const { ApolloServer, gql } = require('apollo-server-express');
const schema = require('./schema');
const resolvers = require('./resolvers');
const models = require('./models');
const path = require('path');

//setup and test sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
	host: process.env.DB_HOST,
	dialect: 'mysql',
	logging: false
});

sequelize.authenticate()
	.then(() => console.log('Database connected'))
	.catch(e => console.error('Database connection failure', e))
;

//invoke the types
const db = {};
Object.keys(models).forEach(key => db[key] = models[key](sequelize, Sequelize.DataTypes));

sequelize.sync();

//create the apollo server
const server = new ApolloServer({
	typeDefs: gql(schema),
	resolvers,
	context: { db },
});

//create the express app
const app = express();
server.applyMiddleware({ app });

//send static files
app.use('/', express.static(path.resolve(__dirname, '../public')));

//fallback to the index file
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, `../public/index.html`));
});

//startup
app.listen(process.env.WEB_PORT || 3100, (err) => {
	console.log(`listening to *:${process.env.WEB_PORT || 3100}`);
});
