import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { BlogInput, UpdateBlogInput } from '../../lib/validators/blog';

export class BlogService {
  async getAllBlogs(published?: boolean) {
    const where: any = published !== undefined ? { isPublished: published } : {};

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return blogs;
  }

  async getBlogBySlug(slug: string) {
    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    if (!blog) {
      throw new AppError('Blog post not found', 404);
    }

    return blog;
  }

  async createBlog(data: BlogInput, userId: string) {
    // Check if slug already exists
    const existing = await prisma.blog.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new AppError('Slug already exists', 400);
    }

    const blog = await prisma.blog.create({
      data: {
        ...data,
        userId,
        publishedAt: data.isPublished ? new Date() : null,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    return blog;
  }

  async updateBlog(id: string, data: UpdateBlogInput, userId: string) {
    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      throw new AppError('Blog post not found', 404);
    }

    if (blog.userId !== userId) {
      throw new AppError('Unauthorized to update this blog', 403);
    }

    // Check slug uniqueness if updating slug
    if (data.slug && data.slug !== blog.slug) {
      const existing = await prisma.blog.findUnique({
        where: { slug: data.slug },
      });

      if (existing) {
        throw new AppError('Slug already exists', 400);
      }
    }

    const updateData: any = { ...data };

    // Set publishedAt when publishing for the first time
    if (data.isPublished && !blog.isPublished) {
      updateData.publishedAt = new Date();
    }

    const updated = await prisma.blog.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    return updated;
  }

  async deleteBlog(id: string, userId: string) {
    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      throw new AppError('Blog post not found', 404);
    }

    if (blog.userId !== userId) {
      throw new AppError('Unauthorized to delete this blog', 403);
    }

    await prisma.blog.delete({ where: { id } });

    return { message: 'Blog deleted successfully' };
  }
}