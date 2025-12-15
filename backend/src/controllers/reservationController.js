const { Reservation, Property, User } = require('../models');
const { Op } = require('sequelize');

// Get all reservations (admin only)
exports.getAllReservations = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      propertyId,
      startDate,
      endDate,
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (propertyId) where.propertyId = propertyId;
    
    if (startDate || endDate) {
      if (startDate && endDate) {
        where.startDate = { [Op.between]: [startDate, endDate] };
      } else if (startDate) {
        where.startDate = { [Op.gte]: startDate };
      } else {
        where.startDate = { [Op.lte]: endDate };
      }
    }

    const { count, rows: reservations } = await Reservation.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        { association: 'property', attributes: ['id', 'title', 'location'] },
        { association: 'user', attributes: ['id', 'name', 'email', 'phone'] },
      ],
    });

    res.json({
      success: true,
      data: {
        reservations,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user's reservations
exports.getMyReservations = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: reservations } = await Reservation.findAndCountAll({
      where: { userId: req.user.id },
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        { association: 'property', attributes: ['id', 'title', 'location', 'images'] },
      ],
    });

    res.json({
      success: true,
      data: {
        reservations,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get reservation by ID
exports.getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [
        { association: 'property' },
        { association: 'user', attributes: ['id', 'name', 'email', 'phone'] },
      ],
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    // Check if user can access this reservation
    if (req.user.role !== 'admin' && reservation.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// Create reservation (pre-reservation request)
exports.createReservation = async (req, res, next) => {
  try {
    const {
      propertyId,
      startDate,
      endDate,
      guestName,
      guestEmail,
      guestPhone,
      numberOfGuests,
      notes,
    } = req.body;

    // Check if property exists
    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check for overlapping reservations
    const overlapping = await Reservation.findOne({
      where: {
        propertyId,
        status: { [Op.in]: ['pending', 'confirmed'] },
        [Op.or]: [
          {
            startDate: { [Op.between]: [startDate, endDate] },
          },
          {
            endDate: { [Op.between]: [startDate, endDate] },
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      return res.status(400).json({
        success: false,
        message: 'The selected dates are not available',
      });
    }

    const reservation = await Reservation.create({
      propertyId,
      userId: req.user?.id || null,
      startDate,
      endDate,
      guestName,
      guestEmail,
      guestPhone,
      numberOfGuests,
      notes,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Reservation request submitted successfully',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// Confirm reservation (admin only)
exports.confirmReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    await reservation.confirm();

    res.json({
      success: true,
      message: 'Reservation confirmed',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel reservation
exports.cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    // Check if user can cancel this reservation
    if (req.user.role !== 'admin' && reservation.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    await reservation.cancel();

    res.json({
      success: true,
      message: 'Reservation cancelled',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// Update reservation (admin only)
exports.updateReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    await reservation.update(req.body);

    res.json({
      success: true,
      message: 'Reservation updated',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// Delete reservation (admin only)
exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    await reservation.destroy();

    res.json({
      success: true,
      message: 'Reservation deleted',
    });
  } catch (error) {
    next(error);
  }
};

// Check availability
exports.checkAvailability = async (req, res, next) => {
  try {
    const { propertyId, startDate, endDate } = req.query;

    const overlapping = await Reservation.findAll({
      where: {
        propertyId,
        status: { [Op.in]: ['pending', 'confirmed'] },
        [Op.or]: [
          { startDate: { [Op.between]: [startDate, endDate] } },
          { endDate: { [Op.between]: [startDate, endDate] } },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } },
            ],
          },
        ],
      },
      attributes: ['startDate', 'endDate'],
    });

    res.json({
      success: true,
      data: {
        available: overlapping.length === 0,
        blockedDates: overlapping,
      },
    });
  } catch (error) {
    next(error);
  }
};
