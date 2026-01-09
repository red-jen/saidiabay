import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { CityInput, UpdateCityInput } from '../../lib/validators/city';

export class CityService {
  async getAllCities() {
    const cities = await prisma.city.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { properties: true },
        },
      },
    });

    return cities;
  }

  async getCityById(id: string) {
    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        _count: {
          select: { properties: true },
        },
      },
    });

    if (!city) {
      throw new AppError('Ville non trouvée', 404);
    }

    return city;
  }

  async createCity(data: CityInput, userId: string) {
    // Check if slug already exists
    const existing = await prisma.city.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new AppError('Ce slug existe déjà', 400);
    }

    const city = await prisma.city.create({
      data: {
        ...data,
        userId,
      },
    });

    return city;
  }

  async updateCity(id: string, data: UpdateCityInput) {
    const city = await prisma.city.findUnique({ where: { id } });

    if (!city) {
      throw new AppError('Ville non trouvée', 404);
    }

    // Check slug uniqueness if updating
    if (data.slug && data.slug !== city.slug) {
      const existing = await prisma.city.findUnique({
        where: { slug: data.slug },
      });

      if (existing) {
        throw new AppError('Ce slug existe déjà', 400);
      }
    }

    const updated = await prisma.city.update({
      where: { id },
      data,
    });

    return updated;
  }

  async deleteCity(id: string) {
    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        _count: {
          select: { properties: true },
        },
      },
    });

    if (!city) {
      throw new AppError('Ville non trouvée', 404);
    }

    if (city._count.properties > 0) {
      throw new AppError(
        `Impossible de supprimer cette ville car elle contient ${city._count.properties} propriété(s)`,
        400
      );
    }

    await prisma.city.delete({ where: { id } });

    return { message: 'Ville supprimée avec succès' };
  }
}