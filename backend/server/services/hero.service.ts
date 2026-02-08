import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { HeroInput, UpdateHeroInput } from '../../lib/validators/hero';

export class HeroService {
  async getAllHeroes(activeOnly?: boolean) {
    const where = activeOnly ? { isActive: true } : {};

    const heroes = await prisma.heroSection.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return heroes;
  }

  async getHeroById(id: string) {
    const hero = await prisma.heroSection.findUnique({
      where: { id },
    });

    if (!hero) {
      throw new AppError('Hero section not found', 404);
    }

    return hero;
  }

  async createHero(data: HeroInput) {
    const hero = await prisma.heroSection.create({
      data,
    });

    return hero;
  }

  async updateHero(id: string, data: UpdateHeroInput) {
    const hero = await prisma.heroSection.findUnique({ where: { id } });

    if (!hero) {
      throw new AppError('Hero section not found', 404);
    }

    const updated = await prisma.heroSection.update({
      where: { id },
      data,
    });

    return updated;
  }

  async deleteHero(id: string) {
    const hero = await prisma.heroSection.findUnique({ where: { id } });

    if (!hero) {
      throw new AppError('Hero section not found', 404);
    }

    await prisma.heroSection.delete({ where: { id } });

    return { message: 'Hero section deleted successfully' };
  }

  async reorderHeroes(heroIds: string[]) {
    const updates = heroIds.map((id, index) =>
      prisma.heroSection.update({
        where: { id },
        data: { order: index + 1 },
      })
    );

    await Promise.all(updates);

    return { message: 'Hero sections reordered successfully' };
  }
}