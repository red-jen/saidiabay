module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      defaultValue: 'pending',
    },
    guestName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    guestEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    guestPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    numberOfGuests: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
  }, {
    tableName: 'reservations',
    timestamps: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['startDate'] },
      { fields: ['endDate'] },
      { fields: ['propertyId'] },
      { fields: ['userId'] },
    ],
    validate: {
      endDateAfterStartDate() {
        if (this.endDate <= this.startDate) {
          throw new Error('End date must be after start date');
        }
      },
    },
  });

  // Instance methods
  Reservation.prototype.confirm = async function() {
    this.status = 'confirmed';
    return await this.save();
  };

  Reservation.prototype.cancel = async function() {
    this.status = 'cancelled';
    return await this.save();
  };

  return Reservation;
};
