module.exports = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define('BlogPost', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255],
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft',
    },
    slug: {
      type: DataTypes.STRING(300),
      unique: true,
    },
    featuredImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metaTitle: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'blog_posts',
    timestamps: true,
    indexes: [
      { fields: ['status'] },
      { unique: true, fields: ['slug'] },
      { fields: ['publishedAt'] },
    ],
    hooks: {
      beforeCreate: (post) => {
        if (!post.slug) {
          post.slug = post.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now();
        }
      },
    },
  });

  // Instance methods
  BlogPost.prototype.publish = async function() {
    this.status = 'published';
    this.publishedAt = new Date();
    return await this.save();
  };

  BlogPost.prototype.unpublish = async function() {
    this.status = 'draft';
    this.publishedAt = null;
    return await this.save();
  };

  return BlogPost;
};
