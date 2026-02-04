const { Property } = require('../models');
const { Op } = require('sequelize');

// Get all properties (public)
exports.getAllProperties = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      listingType,
      status = 'available',
      city,
      minPrice,
      maxPrice,
      bedrooms,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      featured,
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (type) where.type = type;
    if (listingType) where.listingType = listingType;
    if (status) where.status = status;
    if (city) where.city = { [Op.iLike]: `%${city}%` };
    if (featured === 'true') where.isFeatured = true;
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    
    if (bedrooms) where.bedrooms = { [Op.gte]: bedrooms };
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows: properties } = await Property.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, sortOrder]],
      include: [{
        association: 'owner',
        attributes: ['id', 'name'],
      }],
    });

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get property by ID or slug
exports.getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    console.log('Fetching property with identifier:', id);
    console.log('Identifier type check - UUID format:', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
    console.log('Identifier type check - CUID format:', /^c[a-z0-9]{24}$/i.test(id));
    
    // Support both UUID and CUID formats, or slug
    // Try to find by ID first (works for both UUID and CUID), then by slug
    let property = await Property.findOne({
      where: {
        [Op.or]: [
          { id: id },
          { slug: id },
        ],
      },
      include: [{
        association: 'owner',
        attributes: ['id', 'name', 'phone', 'email'],
      }],
    });

    if (!property) {
      console.log('Property not found with identifier:', id);
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    console.log('Property found:', property.id, property.title);

    // Increment views
    await property.increment('views');

    // Transform property data to match frontend expectations
    const propertyData = property.toJSON();
    
    // Map backend field names to frontend expectations
    const transformedProperty = {
      ...propertyData,
      // Map listingType values
      listingType: propertyData.listingType === 'rent' ? 'LOCATION' : 'VENTE',
      // Map status values
      status: propertyData.status === 'available' ? 'AVAILABLE' : 
              propertyData.status === 'rented' ? 'LOUE' :
              propertyData.status === 'sold' ? 'VENDU' :
              propertyData.status === 'pending' ? 'EN_ATTENTE' : propertyData.status,
      // Map propertyCategory from type
      propertyCategory: propertyData.type === 'villa' ? 'VILLA' : 
                        propertyData.type === 'apartment' ? 'APPARTEMENT' : 
                        propertyData.type?.toUpperCase(),
      // Map field names for French frontend
      chambres: propertyData.bedrooms,
      sallesDeBain: propertyData.bathrooms,
      surface: propertyData.area,
      // Ensure city object structure if city is a string
      city: propertyData.city && typeof propertyData.city === 'string' ? {
        name: propertyData.city,
        id: propertyData.cityId || '',
        slug: propertyData.city.toLowerCase().replace(/\s+/g, '-')
      } : propertyData.city,
      // Map user/owner
      user: propertyData.owner || propertyData.user,
    };

    res.json({
      success: true,
      data: transformedProperty,
    });
  } catch (error) {
    console.error('Error in getPropertyById:', error);
    next(error);
  }
};

// Get featured properties
exports.getFeaturedProperties = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const properties = await Property.findAll({
      where: {
        isFeatured: true,
        status: 'available',
      },
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// Create property (admin only)
exports.createProperty = async (req, res, next) => {
  try {
    const propertyData = {
      ...req.body,
      userId: req.user.id,
    };

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// Update property (admin only)
exports.updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    await property.update(req.body);

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// Delete property (admin only)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    await property.destroy();

    res.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Mark property as sold
exports.markAsSold = async (req, res, next) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    await property.markAsSold();

    res.json({
      success: true,
      message: 'Property marked as sold',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// Update property status
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    await property.updateStatus(status);

    res.json({
      success: true,
      message: 'Property status updated',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};
