module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define('Property', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 200],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    type: {
      type: DataTypes.ENUM('apartment', 'house', 'villa', 'studio', 'commercial', 'land'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('available', 'rented', 'sold', 'pending'),
      defaultValue: 'available',
    },
    listingType: {
      type: DataTypes.ENUM('rent', 'sale'),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Area in square meters',
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: [],
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    slug: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    metaTitle: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'properties',
    timestamps: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['type'] },
      { fields: ['listingType'] },
      { fields: ['city'] },
      { fields: ['price'] },
      { unique: true, fields: ['slug'] },
    ],
    hooks: {
      beforeCreate: (property) => {
        if (!property.slug) {
          property.slug = property.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now();
        }
      },
    },
  });

  // Instance methods
  Property.prototype.markAsSold = async function() {
    this.status = 'sold';
    return await this.save();
  };

  Property.prototype.updateStatus = async function(newStatus) {
    this.status = newStatus;
    return await this.save();
  };

  return Property;
};
