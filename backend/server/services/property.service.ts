import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { PropertyInput, UpdatePropertyInput } from '../../lib/validators/property';

export class PropertyService {
  async getAllProperties(filters?: {
    page?: number;
    limit?: number;
    propertyType?: 'RENT' | 'SALE';
    listingType?: 'LOCATION' | 'VENTE';
    propertyCategory?: 'VILLA' | 'APPARTEMENT';
    city?: string;
    cityId?: string;
    minPrice?: number;
    maxPrice?: number;
    chambres?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const skip = (page - 1) * limit;

    // Build base where conditions
    const baseConditions: any = { isActive: true };

    // Filter by propertyType (RENT | SALE)
    if (filters?.propertyType) {
      baseConditions.propertyType = filters.propertyType;
    }

    // Filter by listingType (LOCATION | VENTE)
    if (filters?.listingType) {
      baseConditions.listingType = filters.listingType;
    }

    // Filter by propertyCategory (VILLA | APPARTEMENT)
    if (filters?.propertyCategory) {
      baseConditions.propertyCategory = filters.propertyCategory;
    }

    // Filter by city - prefer cityId (exact match), fallback to city name search
    if (filters?.cityId) {
      baseConditions.cityId = filters.cityId;
    } else if (filters?.city) {
      baseConditions.city = {
        name: { contains: filters.city, mode: 'insensitive' }
      };
    }

    // Filter by price range
    if (filters?.minPrice || filters?.maxPrice) {
      baseConditions.price = {};
      if (filters.minPrice) baseConditions.price.gte = filters.minPrice;
      if (filters.maxPrice) baseConditions.price.lte = filters.maxPrice;
    }

    // Filter by number of bedrooms
    if (filters?.chambres) {
      baseConditions.chambres = { gte: filters.chambres };
    }

    // Filter by status
    if (filters?.status) {
      baseConditions.status = filters.status;
    }

    // Build final where clause
    // If we have search, combine base conditions with OR search using AND
    let where: any;
    if (filters?.search) {
      const searchConditions = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
      ];
      
      where = {
        AND: [
          baseConditions,
          { OR: searchConditions }
        ]
      };
    } else {
      // No search, just use base conditions
      where = baseConditions;
    }

    // Build orderBy from sortBy and sortOrder
    let orderBy: any = { createdAt: 'desc' };
    if (filters?.sortBy) {
      const direction = filters.sortOrder === 'ASC' ? 'asc' : 'desc';
      orderBy = { [filters.sortBy]: direction };
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        include: {
          city: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy,
      }),
      prisma.property.count({ where }),
    ]);

    return {
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPropertyById(id: string) {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        city: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reservations: {
          select: {
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });

    if (!property) {
      throw new Error('Property not found');
    }

    return property;
  }

  async createProperty(data: PropertyInput, userId: string) {
    // Vérifier que la ville existe
    const cityExists = await prisma.city.findUnique({
      where: { id: data.cityId },
    });

    if (!cityExists) {
      throw new AppError('Ville non trouvée', 404);
    }

    const property = await prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        propertyType: data.propertyType,
        listingType: data.listingType,
        propertyCategory: data.propertyCategory,
        status: data.status || 'AVAILABLE',
        
        // Relation avec City
        city: {
          connect: { id: data.cityId }
        },
        
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        
        images: data.images,
        thumbnail: data.thumbnail,
        videoUrl: data.videoUrl,
        
        chambres: data.chambres,
        sallesDeBain: data.sallesDeBain,
        surface: data.surface,
        anneeCons: data.anneeCons,
        garage: data.garage,
        
        balcon: data.balcon || false,
        climatisation: data.climatisation || false,
        gazon: data.gazon || false,
        machineLaver: data.machineLaver || false,
        tv: data.tv || false,
        parking: data.parking || false,
        piscine: data.piscine || false,
        wifi: data.wifi || false,
        cuisine: data.cuisine || false,
        
        isActive: data.isActive ?? true,
        
        // Relation avec User
        user: {
          connect: { id: userId }
        }
      },
      include: {
        city: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return property;
  }

  async updateProperty(id: string, data: UpdatePropertyInput, userId: string) {
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    if (property.userId !== userId) {
      throw new AppError('Unauthorized to update this property', 403);
    }

    // Si cityId change, vérifier que la nouvelle ville existe
    if (data.cityId && data.cityId !== property.cityId) {
      const cityExists = await prisma.city.findUnique({
        where: { id: data.cityId },
      });

      if (!cityExists) {
        throw new AppError('Ville non trouvée', 404);
      }
    }

    const updateData: any = {
      title: data.title,
      description: data.description,
      price: data.price,
      propertyType: data.propertyType,
      listingType: data.listingType,
      propertyCategory: data.propertyCategory,
      status: data.status,
      
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      
      images: data.images,
      thumbnail: data.thumbnail,
      videoUrl: data.videoUrl,
      
      chambres: data.chambres,
      sallesDeBain: data.sallesDeBain,
      surface: data.surface,
      anneeCons: data.anneeCons,
      garage: data.garage,
      
      balcon: data.balcon,
      climatisation: data.climatisation,
      gazon: data.gazon,
      machineLaver: data.machineLaver,
      tv: data.tv,
      parking: data.parking,
      piscine: data.piscine,
      wifi: data.wifi,
      cuisine: data.cuisine,
      
      isActive: data.isActive,
    };

    // Si cityId change, mettre à jour la relation
    if (data.cityId) {
      updateData.city = {
        connect: { id: data.cityId }
      };
    }

    const updated = await prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        city: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return updated;
  }

  async deleteProperty(id: string, userId: string) {
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    if (property.userId !== userId) {
      throw new AppError('Unauthorized to delete this property', 403);
    }

    await prisma.property.delete({ where: { id } });

    return { message: 'Property deleted successfully' };
  }

  async getAvailableDates(propertyId: string, startDate: Date, endDate: Date) {
    const property = await prisma.property.findUnique({ 
      where: { id: propertyId },
      include: { city: true }
    });

    if (!property || property.propertyType !== 'RENT') {
      throw new AppError('Property not available for rent', 400);
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        propertyId,
        status: { in: ['CONFIRMED', 'PENDING'] },
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
      select: { startDate: true, endDate: true },
    });

    return {
      property,
      blockedDates: reservations,
      isAvailable: reservations.length === 0,
    };
  }
}
