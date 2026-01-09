import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seed...");

  // Clear existing data
  await prisma.sale.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.property.deleteMany();
  await prisma.city.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.heroSection.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@realestate.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin créé:", admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash("User123!", 10);
  const user = await prisma.user.create({
    data: {
      email: "user@realestate.com",
      name: "John Doe",
      password: userPassword,
      role: "USER",
    },
  });

  console.log("✅ User créé:", user.email);

  // Create cities
  const casablanca = await prisma.city.create({
    data: {
      name: "Casablanca",
      slug: "casablanca",
      userId: admin.id,
    },
  });

  const rabat = await prisma.city.create({
    data: {
      name: "Rabat",
      slug: "rabat",
      userId: admin.id,
    },
  });

  const marrakech = await prisma.city.create({
    data: {
      name: "Marrakech",
      slug: "marrakech",
      userId: admin.id,
    },
  });

  const tanger = await prisma.city.create({
    data: {
      name: "Tanger",
      slug: "tanger",
      userId: admin.id,
    },
  });

  console.log("✅ 4 villes créées");

  // Create properties for RENT
  const rentProperties = await Promise.all([
    prisma.property.create({
      data: {
        title: "Appartement Moderne Centre-Ville",
        description:
          "Magnifique appartement 2 chambres au cœur de Casablanca avec vue sur la ville, appareils modernes, accès gym et piscine.",
        price: 2500,
        propertyType: "RENT",
        listingType: "LOCATION",
        propertyCategory: "APPARTEMENT",
        status: "AVAILABLE",
        city: { connect: { id: casablanca.id } },
        user: { connect: { id: admin.id } },
        address: "123 Boulevard Hassan II, Casablanca",
        latitude: 33.5731,
        longitude: -7.5898,
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600",
        ],
        thumbnail:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        chambres: 2,
        sallesDeBain: 1,
        surface: 85.5,
        anneeCons: 2020,
        balcon: true,
        climatisation: true,
        wifi: true,
        parking: true,
        cuisine: true,
      },
    }),
    prisma.property.create({
      data: {
        title: "Villa Bord de Mer",
        description:
          "Belle villa avec accès direct à la plage, 3 chambres, cuisine équipée et terrasse extérieure.",
        price: 4500,
        propertyType: "RENT",
        listingType: "LOCATION",
        propertyCategory: "VILLA",
        status: "AVAILABLE",
        city: { connect: { id: tanger.id } },
        user: { connect: { id: admin.id } },
        address: "456 Avenue de la Plage, Tanger",
        latitude: 35.7595,
        longitude: -5.834,
        images: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600",
        ],
        thumbnail:
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        chambres: 3,
        sallesDeBain: 2,
        surface: 150,
        anneeCons: 2018,
        piscine: true,
        gazon: true,
        wifi: true,
        parking: true,
        cuisine: true,
      },
    }),
    prisma.property.create({
      data: {
        title: "Appartement Riad Marrakech",
        description:
          "Charmant appartement dans un riad traditionnel, 2 chambres, décoration marocaine.",
        price: 3000,
        propertyType: "RENT",
        listingType: "LOCATION",
        propertyCategory: "APPARTEMENT",
        status: "AVAILABLE",
        city: { connect: { id: marrakech.id } },
        user: { connect: { id: admin.id } },
        address: "789 Médina, Marrakech",
        images: [
          "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600",
        ],
        thumbnail:
          "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
        chambres: 2,
        sallesDeBain: 1,
        surface: 95,
        anneeCons: 2015,
        climatisation: true,
        wifi: true,
        cuisine: true,
      },
    }),
  ]);

  console.log(`✅ ${rentProperties.length} propriétés en location créées`);

  // Create properties for SALE
  const saleProperties = await Promise.all([
    prisma.property.create({
      data: {
        title: "Villa Luxueuse avec Piscine",
        description:
          "Magnifique villa 5 chambres avec piscine privée, home cinéma, cave à vin et domotique.",
        price: 3500000,
        propertyType: "SALE",
        listingType: "VENTE",
        propertyCategory: "VILLA",
        status: "AVAILABLE",
        city: { connect: { id: casablanca.id } },
        user: { connect: { id: admin.id } },
        address: "321 Quartier Anfa, Casablanca",
        latitude: 33.5892,
        longitude: -7.6323,
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600",
        ],
        thumbnail:
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
        chambres: 5,
        sallesDeBain: 3,
        surface: 350,
        garage: 2,
        anneeCons: 2022,
        piscine: true,
        gazon: true,
        climatisation: true,
        parking: true,
        wifi: true,
        cuisine: true,
      },
    }),
    prisma.property.create({
      data: {
        title: "Appartement Centre Rabat",
        description:
          "Bel appartement rénové dans un immeuble historique. Plafonds hauts, 2 chambres, 2 salles de bain.",
        price: 1200000,
        propertyType: "SALE",
        listingType: "VENTE",
        propertyCategory: "APPARTEMENT",
        status: "AVAILABLE",
        city: { connect: { id: rabat.id } },
        user: { connect: { id: admin.id } },
        address: "555 Avenue Mohammed V, Rabat",
        images: [
          "https://images.unsplash.com/photo-1560448204-e1a3f50e6a42?w=1600",
        ],
        thumbnail:
          "https://images.unsplash.com/photo-1560448204-e1a3f50e6a42?w=800",
        chambres: 2,
        sallesDeBain: 2,
        surface: 120,
        anneeCons: 1980,
        balcon: true,
        climatisation: true,
        wifi: true,
        cuisine: true,
      },
    }),
    prisma.property.create({
      data: {
        title: "Villa Familiale Marrakech",
        description:
          "Spacieuse villa 4 chambres dans quartier calme. Grand jardin, garage 2 places, proche écoles.",
        price: 2800000,
        propertyType: "SALE",
        listingType: "VENTE",
        propertyCategory: "VILLA",
        status: "PENDING",
        city: { connect: { id: marrakech.id } },
        user: { connect: { id: admin.id } },
        address: "888 Quartier Guéliz, Marrakech",
        images: [
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1600",
        ],
        thumbnail:
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
        chambres: 4,
        sallesDeBain: 2,
        surface: 250,
        garage: 2,
        anneeCons: 2010,
        gazon: true,
        parking: true,
        climatisation: true,
        wifi: true,
        cuisine: true,
      },
    }),
  ]);

  console.log(`✅ ${saleProperties.length} propriétés en vente créées`);

  // Create reservations
  const reservations = await Promise.all([
    prisma.reservation.create({
      data: {
        propertyId: rentProperties[0].id,
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-03-15"),
        guestName: "Ahmed Bennani",
        guestEmail: "ahmed@example.com",
        guestPhone: "+212-6-12-34-56-78",
        message: "Hâte de séjourner ici!",
        status: "CONFIRMED",
        totalPrice: 2500 * 14,
        userId: user.id,
      },
    }),
    prisma.reservation.create({
      data: {
        propertyId: rentProperties[1].id,
        startDate: new Date("2024-04-10"),
        endDate: new Date("2024-04-20"),
        guestName: "Fatima El Amrani",
        guestEmail: "fatima@example.com",
        guestPhone: "+212-6-98-76-54-32",
        status: "PRE_RESERVED",
        totalPrice: 4500 * 10,
      },
    }),
  ]);

  console.log(`✅ ${reservations.length} réservations créées`);

  // Create leads
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        propertyId: saleProperties[0].id,
        name: "Mohammed Alami",
        email: "mohammed@example.com",
        phone: "+212-6-11-22-33-44",
        message: "Très intéressé par cette villa. Possibilité de visite?",
        status: "NEW",
      },
    }),
    prisma.lead.create({
      data: {
        propertyId: saleProperties[1].id,
        name: "Sarah Idrissi",
        email: "sarah@example.com",
        phone: "+212-6-55-66-77-88",
        message: "Le prix est-il négociable?",
        status: "CONTACTED",
        userId: user.id,
      },
    }),
  ]);

  console.log(`✅ ${leads.length} leads créés`);

  // Create blog posts
  const blogs = await Promise.all([
    prisma.blog.create({
      data: {
        title: "10 Conseils pour Acheter votre Premier Bien",
        slug: "10-conseils-acheter-premier-bien",
        content:
          "Acheter votre premier bien immobilier est une étape excitante. Voici nos 10 meilleurs conseils...",
        excerpt: "Conseils essentiels pour les primo-accédants.",
        coverImage:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600",
        category: "Guide d'Achat",
        isPublished: true,
        publishedAt: new Date(),
        metaTitle:
          "10 Conseils pour Acheter votre Premier Bien | Guide Immobilier",
        metaDescription:
          "Conseils d'experts pour les primo-accédants. Apprenez à faire le bon choix.",
        userId: admin.id,
      },
    }),
    prisma.blog.create({
      data: {
        title: "Les Meilleurs Quartiers de Casablanca 2024",
        slug: "meilleurs-quartiers-casablanca-2024",
        content:
          "Casablanca offre des quartiers variés. Découvrez les zones les plus prisées...",
        excerpt: "Guide des quartiers les plus recherchés à Casablanca.",
        coverImage:
          "https://images.unsplash.com/photo-1533745848184-3db07256e163?w=1600",
        videoUrl: "https://www.youtube.com/watch?v=example",
        category: "Guide des Villes",
        isPublished: true,
        publishedAt: new Date(),
        userId: admin.id,
      },
    }),
  ]);

  console.log(`✅ ${blogs.length} articles de blog créés`);

  // Create hero sections
  const heroSections = await Promise.all([
    prisma.heroSection.create({
      data: {
        title: "Trouvez la Maison de vos Rêves",
        subtitle: "Découvrez la propriété parfaite en location ou vente",
        imageUrl:
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920",
        ctaText: "Voir les Propriétés",
        ctaLink: "/properties",
        order: 1,
        isActive: true,
      },
    }),
    prisma.heroSection.create({
      data: {
        title: "Luxe et Confort",
        subtitle: "Propriétés exclusives dans des emplacements de choix",
        imageUrl:
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920",
        ctaText: "Voir les Villas",
        ctaLink: "/properties?type=SALE",
        order: 2,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ ${heroSections.length} sections hero créées`);

  console.log("\n🎉 Seed complété avec succès!");
  console.log("\n📋 Identifiants de test:");
  console.log("Admin: admin@realestate.com / Admin123!");
  console.log("User: user@realestate.com / User123!");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
