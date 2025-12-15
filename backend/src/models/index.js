const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./User')(sequelize, Sequelize);
db.Property = require('./Property')(sequelize, Sequelize);
db.Reservation = require('./Reservation')(sequelize, Sequelize);
db.BlogPost = require('./BlogPost')(sequelize, Sequelize);
db.Ad = require('./Ad')(sequelize, Sequelize);

// Define associations

// User - Property (One to Many): User manages multiple properties
db.User.hasMany(db.Property, {
  foreignKey: 'userId',
  as: 'properties',
});
db.Property.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'owner',
});

// User - BlogPost (One to Many): User writes multiple blog posts
db.User.hasMany(db.BlogPost, {
  foreignKey: 'authorId',
  as: 'blogPosts',
});
db.BlogPost.belongsTo(db.User, {
  foreignKey: 'authorId',
  as: 'author',
});

// User - Reservation (One to Many): User makes multiple reservations
db.User.hasMany(db.Reservation, {
  foreignKey: 'userId',
  as: 'reservations',
});
db.Reservation.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'user',
});

// Property - Reservation (One to Many): Property has multiple reservations
db.Property.hasMany(db.Reservation, {
  foreignKey: 'propertyId',
  as: 'reservations',
});
db.Reservation.belongsTo(db.Property, {
  foreignKey: 'propertyId',
  as: 'property',
});

module.exports = db;
