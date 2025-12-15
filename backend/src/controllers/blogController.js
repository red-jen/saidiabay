const { BlogPost, User } = require('../models');
const { Op } = require('sequelize');

// Get all published blog posts (public)
exports.getAllPosts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      tag,
      search,
      status = 'published',
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Non-admin users can only see published posts
    if (!req.user || req.user.role !== 'admin') {
      where.status = 'published';
    } else if (status) {
      where.status = status;
    }

    if (tag) {
      where.tags = { [Op.contains]: [tag] };
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows: posts } = await BlogPost.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']],
      include: [{
        association: 'author',
        attributes: ['id', 'name'],
      }],
    });

    res.json({
      success: true,
      data: {
        posts,
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

// Get post by ID or slug
exports.getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const where = {
      [Op.or]: [
        { id: id.match(/^[0-9a-f-]{36}$/i) ? id : null },
        { slug: id },
      ],
    };

    // Non-admin users can only see published posts
    if (!req.user || req.user.role !== 'admin') {
      where.status = 'published';
    }

    const post = await BlogPost.findOne({
      where,
      include: [{
        association: 'author',
        attributes: ['id', 'name'],
      }],
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Increment views
    await post.increment('views');

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Get recent posts
exports.getRecentPosts = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const posts = await BlogPost.findAll({
      where: { status: 'published' },
      limit: parseInt(limit),
      order: [['publishedAt', 'DESC']],
      attributes: ['id', 'title', 'slug', 'excerpt', 'featuredImage', 'publishedAt'],
    });

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// Create blog post (admin only)
exports.createPost = async (req, res, next) => {
  try {
    const postData = {
      ...req.body,
      authorId: req.user.id,
    };

    const post = await BlogPost.create(postData);

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Update blog post (admin only)
exports.updatePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    await post.update(req.body);

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Delete blog post (admin only)
exports.deletePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    await post.destroy();

    res.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Publish blog post
exports.publishPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    await post.publish();

    res.json({
      success: true,
      message: 'Blog post published',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Unpublish blog post
exports.unpublishPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    await post.unpublish();

    res.json({
      success: true,
      message: 'Blog post unpublished',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
