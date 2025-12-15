module.exports = (sequelize, DataTypes) => {
  const Ad = sequelize.define('Ad', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    position: {
      type: DataTypes.ENUM('header', 'sidebar', 'footer', 'inline'),
      defaultValue: 'sidebar',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    clicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    impressions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    tableName: 'ads',
    timestamps: true,
    indexes: [
      { fields: ['active'] },
      { fields: ['position'] },
    ],
  });

  // Instance methods
  Ad.prototype.activate = async function() {
    this.active = true;
    return await this.save();
  };

  Ad.prototype.deactivate = async function() {
    this.active = false;
    return await this.save();
  };

  return Ad;
};
