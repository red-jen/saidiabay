const { Ad } = require('../models');
const { Op } = require('sequelize');

// Get active ads (public)
exports.getActiveAds = async (req, res, next) => {
  try {
    const { position } = req.query;
    const today = new Date().toISOString().split('T')[0];

    const where = {
      active: true,
      [Op.or]: [
        { startDate: null },
        { startDate: { [Op.lte]: today } },
      ],
      [Op.or]: [
        { endDate: null },
        { endDate: { [Op.gte]: today } },
      ],
    };

    if (position) {
      where.position = position;
    }

    const ads = await Ad.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    // Increment impressions
    await Ad.increment('impressions', {
      where: { id: ads.map(ad => ad.id) },
    });

    res.json({
      success: true,
      data: ads,
    });
  } catch (error) {
    next(error);
  }
};

// Get all ads (admin only)
exports.getAllAds = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, active, position } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (active !== undefined) where.active = active === 'true';
    if (position) where.position = position;

    const { count, rows: ads } = await Ad.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        ads,
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

// Get ad by ID
exports.getAdById = async (req, res, next) => {
  try {
    const ad = await Ad.findByPk(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found',
      });
    }

    res.json({
      success: true,
      data: ad,
    });
  } catch (error) {
    next(error);
  }
};

// Create ad (admin only)
exports.createAd = async (req, res, next) => {
  try {
    const ad = await Ad.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Ad created successfully',
      data: ad,
    });
  } catch (error) {
    next(error);
  }
};

// Update ad (admin only)
exports.updateAd = async (req, res, next) => {
  try {
    const ad = await Ad.findByPk(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found',
      });
    }

    await ad.update(req.body);

    res.json({
      success: true,
      message: 'Ad updated successfully',
      data: ad,
    });
  } catch (error) {
    next(error);
  }
};

// Delete ad (admin only)
exports.deleteAd = async (req, res, next) => {
  try {
    const ad = await Ad.findByPk(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found',
      });
    }

    await ad.destroy();

    res.json({
      success: true,
      message: 'Ad deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Activate ad
exports.activateAd = async (req, res, next) => {
  try {
    const ad = await Ad.findByPk(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found',
      });
    }

    await ad.activate();

    res.json({
      success: true,
      message: 'Ad activated',
      data: ad,
    });
  } catch (error) {
    next(error);
  }
};

// Deactivate ad
exports.deactivateAd = async (req, res, next) => {
  try {
    const ad = await Ad.findByPk(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found',
      });
    }

    await ad.deactivate();

    res.json({
      success: true,
      message: 'Ad deactivated',
      data: ad,
    });
  } catch (error) {
    next(error);
  }
};

// Track ad click
exports.trackClick = async (req, res, next) => {
  try {
    const ad = await Ad.findByPk(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found',
      });
    }

    await ad.increment('clicks');

    res.json({
      success: true,
      data: { link: ad.link },
    });
  } catch (error) {
    next(error);
  }
};
