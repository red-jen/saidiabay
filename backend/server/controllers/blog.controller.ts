import { Response, NextFunction } from 'express';
import { BlogService } from '../services/blog.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const blogService = new BlogService();

export class BlogController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const published = req.query.published === 'true' ? true : undefined;
      const blogs = await blogService.getAllBlogs(published);
      res.json({ data: blogs });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const blog = await blogService.getBlogBySlug(slug);
      res.json({ data: blog });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const blog = await blogService.createBlog(req.body, req.userId!);
      res.status(201).json({
        message: 'Blog created successfully',
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const blog = await blogService.updateBlog(id, req.body, req.userId!);
      res.json({
        message: 'Blog updated successfully',
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await blogService.deleteBlog(id, req.userId!);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}