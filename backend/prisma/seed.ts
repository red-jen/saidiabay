import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // Clean existing data
  await prisma.heroClick.deleteMany();
  await prisma.heroSection.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.blockedDate.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.property.deleteMany();
  await prisma.city.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.oTPCode.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Données existantes nettoyées');

  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const userPassword = await bcrypt.hash('User@123', 10);

  // Create Admin User
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      name: 'Admin SaidiaBay',
      email: 'admin@saidiabay.com',
      password: adminPassword,
      phone: '+212 6 00 00 00 00',
      role: 'ADMIN',
    },
  });
  console.log('✅ Utilisateur admin créé');

  // Create Regular Users
  const user1 = await prisma.user.create({
    data: {
      username: 'ahmed_benali',
      name: 'Ahmed Benali',
      email: 'ahmed@example.com',
      password: userPassword,
      phone: '+212 6 12 34 56 78',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'fatima_zahra',
      name: 'Fatima Zahra',
      email: 'fatima@example.com',
      password: userPassword,
      phone: '+212 6 98 76 54 32',
      role: 'USER',
    },
  });
  console.log('✅ Utilisateurs réguliers créés');

  // Create Cities
  const saidia = await prisma.city.create({
    data: {
      name: 'Saïdia',
      slug: 'saidia',
      userId: admin.id,
    },
  });

  const nador = await prisma.city.create({
    data: {
      name: 'Nador',
      slug: 'nador',
      userId: admin.id,
    },
  });

  const oujda = await prisma.city.create({
    data: {
      name: 'Oujda',
      slug: 'oujda',
      userId: admin.id,
    },
  });

  const casablanca = await prisma.city.create({
    data: {
      name: 'Casablanca',
      slug: 'casablanca',
      userId: admin.id,
    },
  });

  const marrakech = await prisma.city.create({
    data: {
      name: 'Marrakech',
      slug: 'marrakech',
      userId: admin.id,
    },
  });

  const tanger = await prisma.city.create({
    data: {
      name: 'Tanger',
      slug: 'tanger',
      userId: admin.id,
    },
  });
  console.log('✅ Villes créées');

  // Sample Cloudinary images (placeholder URLs - replace with real ones)
  const propertyImages = [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  ];

  const villaImages = [
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
  ];

  const apartmentImages = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  ];

  // Create Properties - RENTALS (LOCATION)
  const property1 = await prisma.property.create({
    data: {
      title: 'Villa de Luxe avec Piscine - Vue Mer',
      description: `<p>Magnifique villa de luxe située à Saïdia, offrant une vue imprenable sur la mer Méditerranée.</p>
      <h3>Caractéristiques:</h3>
      <ul>
        <li>4 chambres spacieuses avec climatisation</li>
        <li>3 salles de bain modernes</li>
        <li>Piscine privée</li>
        <li>Jardin paysager de 500m²</li>
        <li>Terrasse avec vue panoramique</li>
      </ul>
      <p>Idéale pour des vacances en famille ou entre amis. À 5 minutes de la plage.</p>`,
      price: 2500,
      propertyType: 'RENT',
      listingType: 'LOCATION',
      propertyCategory: 'VILLA',
      status: 'AVAILABLE',
      cityId: saidia.id,
      address: 'Marina Saïdia, Boulevard Mohammed VI',
      latitude: 35.0867,
      longitude: -2.3311,
      images: villaImages,
      thumbnail: villaImages[0],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      chambres: 4,
      sallesDeBain: 3,
      surface: 350,
      anneeCons: 2020,
      garage: 2,
      balcon: true,
      climatisation: true,
      gazon: true,
      machineLaver: true,
      tv: true,
      parking: true,
      piscine: true,
      wifi: true,
      cuisine: true,
      isActive: true,
      userId: admin.id,
    },
  });

  const property2 = await prisma.property.create({
    data: {
      title: 'Appartement Moderne Face à la Mer',
      description: `<p>Superbe appartement moderne avec vue directe sur la mer. Parfait pour les couples ou petites familles.</p>
      <h3>Points forts:</h3>
      <ul>
        <li>Vue mer panoramique</li>
        <li>Entièrement meublé et équipé</li>
        <li>Résidence sécurisée avec piscine commune</li>
        <li>Proche de toutes commodités</li>
      </ul>`,
      price: 800,
      propertyType: 'RENT',
      listingType: 'LOCATION',
      propertyCategory: 'APPARTEMENT',
      status: 'AVAILABLE',
      cityId: saidia.id,
      address: 'Résidence Méditerranée, Saïdia',
      latitude: 35.0890,
      longitude: -2.3400,
      images: apartmentImages,
      thumbnail: apartmentImages[0],
      chambres: 2,
      sallesDeBain: 1,
      surface: 85,
      anneeCons: 2018,
      garage: 1,
      balcon: true,
      climatisation: true,
      gazon: false,
      machineLaver: true,
      tv: true,
      parking: true,
      piscine: true,
      wifi: true,
      cuisine: true,
      isActive: true,
      userId: admin.id,
    },
  });

  const property3 = await prisma.property.create({
    data: {
      title: 'Villa Familiale avec Grand Jardin',
      description: `<p>Belle villa familiale dans un quartier calme de Nador. Idéale pour les grandes familles.</p>`,
      price: 1500,
      propertyType: 'RENT',
      listingType: 'LOCATION',
      propertyCategory: 'VILLA',
      status: 'AVAILABLE',
      cityId: nador.id,
      address: 'Quartier Al Wahda, Nador',
      latitude: 35.1740,
      longitude: -2.9287,
      images: propertyImages.slice(0, 3),
      thumbnail: propertyImages[0],
      chambres: 5,
      sallesDeBain: 3,
      surface: 400,
      anneeCons: 2015,
      garage: 2,
      balcon: true,
      climatisation: true,
      gazon: true,
      machineLaver: true,
      tv: true,
      parking: true,
      piscine: false,
      wifi: true,
      cuisine: true,
      isActive: true,
      userId: admin.id,
    },
  });

  const property4 = await prisma.property.create({
    data: {
      title: 'Studio Cosy Centre-Ville',
      description: `<p>Charmant studio entièrement rénové au cœur d'Oujda. Parfait pour les voyageurs solo ou couples.</p>`,
      price: 400,
      propertyType: 'RENT',
      listingType: 'LOCATION',
      propertyCategory: 'APPARTEMENT',
      status: 'AVAILABLE',
      cityId: oujda.id,
      address: 'Boulevard Mohammed V, Oujda',
      latitude: 34.6867,
      longitude: -1.9114,
      images: apartmentImages,
      thumbnail: apartmentImages[1],
      chambres: 1,
      sallesDeBain: 1,
      surface: 45,
      anneeCons: 2022,
      garage: 0,
      balcon: true,
      climatisation: true,
      gazon: false,
      machineLaver: true,
      tv: true,
      parking: false,
      piscine: false,
      wifi: true,
      cuisine: true,
      isActive: true,
      userId: admin.id,
    },
  });

  // Create Properties - SALES (VENTE)
  const property5 = await prisma.property.create({
    data: {
      title: 'Villa de Prestige à Vendre - Marina Saïdia',
      description: `<p>Exceptionnelle villa de prestige à vendre dans le complexe Marina Saïdia.</p>
      <h3>Une opportunité rare:</h3>
      <ul>
        <li>Construction haut de gamme</li>
        <li>Finitions luxueuses</li>
        <li>Emplacement premium face à la marina</li>
        <li>Rentabilité locative excellente</li>
      </ul>
      <p>Investissement idéal dans la première destination balnéaire du Maroc oriental.</p>`,
      price: 3500000,
      propertyType: 'SALE',
      listingType: 'VENTE',
      propertyCategory: 'VILLA',
      status: 'AVAILABLE',
      cityId: saidia.id,
      address: 'Marina Saïdia, Front de Mer',
      latitude: 35.0850,
      longitude: -2.3280,
      images: [...villaImages, ...propertyImages.slice(0, 2)],
      thumbnail: villaImages[1],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      chambres: 5,
      sallesDeBain: 4,
      surface: 450,
      anneeCons: 2021,
      garage: 3,
      balcon: true,
      climatisation: true,
      gazon: true,
      machineLaver: true,
      tv: true,
      parking: true,
      piscine: true,
      wifi: true,
      cuisine: true,
      isActive: true,
      userId: admin.id,
    },
  });

  const property6 = await prisma.property.create({
    data: {
      title: 'Appartement Neuf T3 - Casablanca',
      description: `<p>Appartement neuf dans une résidence moderne à Casablanca. Proche du tramway et des commerces.</p>`,
      price: 1200000,
      propertyType: 'SALE',
      listingType: 'VENTE',
      propertyCategory: 'APPARTEMENT',
      status: 'AVAILABLE',
      cityId: casablanca.id,
      address: 'Quartier Maârif, Casablanca',
      latitude: 33.5731,
      longitude: -7.5898,
      images: apartmentImages,
      thumbnail: apartmentImages[2],
      chambres: 3,
      sallesDeBain: 2,
      surface: 120,
      anneeCons: 2024,
      garage: 1,
      balcon: true,
      climatisation: true,
      gazon: false,
      machineLaver: false,
      tv: false,
      parking: true,
      piscine: false,
      wifi: false,
      cuisine: true,
      isActive: true,
      userId: admin.id,
    },
  });

  const property7 = await prisma.property.create({
    data: {
      title: 'Riad Traditionnel Rénové - Marrakech',
      description: `<p>Magnifique riad traditionnel entièrement rénové dans la médina de Marrakech. Un bijou architectural.</p>`,
      price: 4500000,
      propertyType: 'SALE',
      listingType: 'VENTE',
      propertyCategory: 'VILLA',
      status: 'PENDING',
      cityId: marrakech.id,
      address: 'Médina de Marrakech',
      latitude: 31.6295,
      longitude: -7.9811,
      images: propertyImages,
      thumbnail: propertyImages[2],
      chambres: 6,
      sallesDeBain: 6,
      surface: 300,
      anneeCons: 1920,
      garage: 0,
      balcon: false,
      climatisation: true,
      gazon: true,
      machineLaver: true,
      tv: true,
      parking: false,
      piscine: true,
      wifi: true,
      cuisine: true,
      isActive: true,
      userId: admin.id,
    },
  });

  const property8 = await prisma.property.create({
    data: {
      title: 'Duplex Vue Mer - Tanger',
      description: `<p>Superbe duplex avec terrasse et vue imprenable sur le détroit de Gibraltar.</p>`,
      price: 2800000,
      propertyType: 'SALE',
      listingType: 'VENTE',
      propertyCategory: 'APPARTEMENT',
      status: 'AVAILABLE',
      cityId: tanger.id,
      address: 'Malabata, Tanger',
      latitude: 35.7595,
      longitude: -5.8340,
      images: [...apartmentImages, propertyImages[3]],
      thumbnail: propertyImages[3],
      chambres: 4,
      sallesDeBain: 3,
      surface: 200,
      anneeCons: 2019,
      garage: 2,
      balcon: true,
      climatisation: true,
      gazon: false,
      machineLaver: true,
      tv: true,
      parking: true,
      piscine: true,
      wifi: true,
      cuisine: true,
      isActive: true,
      userId: admin.id,
    },
  });
  console.log('✅ Propriétés créées (4 locations, 4 ventes)');

  // Create Reservations
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  await prisma.reservation.create({
    data: {
      propertyId: property1.id,
      startDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000),
      nights: 7,
      guestName: 'Mohamed Alami',
      guestEmail: 'mohamed.alami@gmail.com',
      guestPhone: '+212 6 11 22 33 44',
      status: 'CONFIRMED',
      totalPrice: 2500 * 7,
      userId: user1.id,
    },
  });

  await prisma.reservation.create({
    data: {
      propertyId: property2.id,
      startDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
      nights: 7,
      guestName: 'Sara Benjelloun',
      guestEmail: 'sara.benjelloun@outlook.com',
      guestPhone: '+212 6 55 66 77 88',
      status: 'PENDING',
      totalPrice: 800 * 7,
    },
  });

  await prisma.reservation.create({
    data: {
      propertyId: property1.id,
      startDate: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 52 * 24 * 60 * 60 * 1000),
      nights: 7,
      guestName: 'Youssef El Mansouri',
      guestEmail: 'youssef.mansouri@yahoo.fr',
      guestPhone: '+212 6 99 88 77 66',
      status: 'PENDING',
      totalPrice: 2500 * 7,
      userId: user2.id,
    },
  });

  await prisma.reservation.create({
    data: {
      propertyId: property3.id,
      startDate: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      nights: 7,
      guestName: 'Khalid Rachidi',
      guestEmail: 'khalid.rachidi@gmail.com',
      guestPhone: '+212 6 44 33 22 11',
      status: 'CONFIRMED',
      totalPrice: 1500 * 7,
    },
  });

  await prisma.reservation.create({
    data: {
      propertyId: property4.id,
      startDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
      nights: 3,
      guestName: 'Amina Tazi',
      guestEmail: 'amina.tazi@hotmail.com',
      guestPhone: '+212 6 22 11 00 99',
      status: 'CANCELLED',
      totalPrice: 400 * 3,
    },
  });
  console.log('✅ Réservations créées');

  // Create Leads (for SALE properties)
  await prisma.lead.create({
    data: {
      propertyId: property5.id,
      guestName: 'Hassan Berrada',
      guestEmail: 'hassan.berrada@gmail.com',
      guestPhone: '+212 6 61 62 63 64',
      guestCountry: 'Morocco',
      message: 'Je suis très intéressé par cette villa. Serait-il possible d\'organiser une visite ce weekend?',
      status: 'NEW',
      userId: user1.id,
    },
  });

  await prisma.lead.create({
    data: {
      propertyId: property5.id,
      guestName: 'Karim Fassi',
      guestEmail: 'karim.fassi@outlook.com',
      guestPhone: '+212 6 71 72 73 74',
      guestCountry: 'Morocco',
      message: 'Investisseur immobilier cherchant des opportunités à Saïdia. Prix négociable?',
      status: 'CONTACTED',
    },
  });

  await prisma.lead.create({
    data: {
      propertyId: property6.id,
      guestName: 'Laila Chraibi',
      guestEmail: 'laila.chraibi@yahoo.fr',
      guestPhone: '+212 6 81 82 83 84',
      guestCountry: 'Morocco',
      message: 'Premier achat immobilier. Possibilité de financement?',
      status: 'QUALIFIED',
    },
  });

  await prisma.lead.create({
    data: {
      propertyId: property7.id,
      guestName: 'Jean-Pierre Dubois',
      guestEmail: 'jp.dubois@gmail.com',
      guestPhone: '+33 6 12 34 56 78',
      guestCountry: 'France',
      message: 'Français expatrié cherchant à investir au Maroc. Ce riad m\'intéresse beaucoup.',
      status: 'CONTACTED',
    },
  });

  await prisma.lead.create({
    data: {
      propertyId: property8.id,
      guestName: 'Nadia Bennani',
      guestEmail: 'nadia.bennani@gmail.com',
      guestPhone: '+212 6 91 92 93 94',
      guestCountry: 'Morocco',
      message: 'Je cherche un bien pour ma retraite avec vue mer.',
      status: 'NEW',
    },
  });
  console.log('✅ Leads créés');

  // Create Blocked Dates
  await prisma.blockedDate.create({
    data: {
      propertyId: property1.id,
      startDate: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 65 * 24 * 60 * 60 * 1000),
      reason: 'Maintenance piscine',
    },
  });

  await prisma.blockedDate.create({
    data: {
      propertyId: property2.id,
      startDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 32 * 24 * 60 * 60 * 1000),
      reason: 'Rénovation salle de bain',
    },
  });
  console.log('✅ Dates bloquées créées');

  // Create Hero Sections (updated schema - no title/subtitle/ctaText)
  await prisma.heroSection.create({
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920',
      ctaLink: '/properties',
      order: 1,
      isActive: true,
    },
  });

  await prisma.heroSection.create({
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920',
      ctaLink: '/properties?type=SALE',
      order: 2,
      isActive: true,
    },
  });

  await prisma.heroSection.create({
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920',
      ctaLink: '/properties?type=RENT',
      order: 3,
      isActive: true,
    },
  });
  console.log('✅ Hero sections créées');

  // Create Blogs
  await prisma.blog.create({
    data: {
      title: 'Guide Complet pour Investir à Saïdia',
      slug: 'guide-investir-saidia',
      content: `<h2>Pourquoi investir à Saïdia?</h2>
      <p>Saïdia, surnommée la "Perle Bleue" du Maroc, est devenue l'une des destinations les plus prisées pour l'investissement immobilier. Avec sa plage de 14 km, son climat méditerranéen et ses infrastructures modernes, la ville attire chaque année des milliers de touristes et d'investisseurs.</p>
      
      <h3>Les avantages de l'investissement</h3>
      <ul>
        <li><strong>Rentabilité locative élevée</strong> - La saison estivale génère d'excellents revenus</li>
        <li><strong>Prix attractifs</strong> - Comparé à d'autres destinations balnéaires</li>
        <li><strong>Développement continu</strong> - Nouveaux projets et infrastructures</li>
        <li><strong>Qualité de vie</strong> - Environnement sain et sécurisé</li>
      </ul>
      
      <h3>Conseils pour bien investir</h3>
      <p>Avant tout achat, il est essentiel de bien étudier le marché, de visiter plusieurs biens et de s'entourer de professionnels de confiance. Notre équipe SaidiaBay est là pour vous accompagner dans toutes les étapes de votre projet.</p>`,
      excerpt: 'Découvrez pourquoi Saïdia est la destination idéale pour votre investissement immobilier au Maroc.',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
      category: 'Investissement',
      isPublished: true,
      publishedAt: new Date(),
      metaTitle: 'Investir à Saïdia - Guide Complet | SaidiaBay',
      metaDescription: 'Guide complet pour investir dans l\'immobilier à Saïdia. Conseils, avantages et opportunités.',
      userId: admin.id,
    },
  });

  await prisma.blog.create({
    data: {
      title: 'Les 5 Meilleures Activités à Saïdia',
      slug: '5-meilleures-activites-saidia',
      content: `<h2>Que faire à Saïdia?</h2>
      <p>Saïdia offre une multitude d'activités pour tous les goûts. Voici notre sélection des incontournables.</p>
      
      <h3>1. La Plage</h3>
      <p>Avec 14 km de sable fin, la plage de Saïdia est l'une des plus belles du Maroc.</p>
      
      <h3>2. La Marina</h3>
      <p>Promenez-vous le long des quais, admirez les bateaux et profitez des restaurants.</p>
      
      <h3>3. Le Golf</h3>
      <p>Deux parcours de golf de classe internationale vous attendent.</p>
      
      <h3>4. Sports Nautiques</h3>
      <p>Jet-ski, kayak, paddle... Les amateurs de sensations fortes seront comblés.</p>
      
      <h3>5. Excursions</h3>
      <p>Découvrez les environs: Nador, les montagnes du Rif, la frontière algérienne...</p>`,
      excerpt: 'Découvrez les meilleures activités à faire lors de votre séjour à Saïdia.',
      coverImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200',
      category: 'Tourisme',
      isPublished: true,
      publishedAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      metaTitle: 'Top 5 Activités à Saïdia | SaidiaBay',
      metaDescription: 'Les meilleures activités à faire à Saïdia: plage, marina, golf, sports nautiques et excursions.',
      userId: admin.id,
    },
  });

  await prisma.blog.create({
    data: {
      title: 'Comment Bien Préparer Son Séjour à Saïdia',
      slug: 'preparer-sejour-saidia',
      content: `<h2>Préparez votre séjour</h2>
      <p>Un séjour réussi à Saïdia commence par une bonne préparation. Suivez nos conseils!</p>
      
      <h3>Quand partir?</h3>
      <p>La meilleure période est de juin à septembre pour profiter de la plage. Le printemps et l'automne sont parfaits pour éviter la foule.</p>
      
      <h3>Comment venir?</h3>
      <p>L'aéroport d'Oujda est à 60 km. Des navettes et taxis sont disponibles.</p>
      
      <h3>Que mettre dans sa valise?</h3>
      <ul>
        <li>Crème solaire et chapeau</li>
        <li>Maillots de bain</li>
        <li>Vêtements légers</li>
        <li>Une veste pour les soirées</li>
      </ul>`,
      excerpt: 'Tous nos conseils pour préparer votre séjour à Saïdia.',
      coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
      category: 'Conseils',
      isPublished: true,
      publishedAt: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
      userId: admin.id,
    },
  });

  await prisma.blog.create({
    data: {
      title: 'Le Marché Immobilier à Saïdia en 2026',
      slug: 'marche-immobilier-saidia-2026',
      content: `<h2>Tendances du marché immobilier</h2>
      <p>Analyse complète du marché immobilier à Saïdia pour l'année 2026...</p>
      <p>Article en cours de rédaction.</p>`,
      excerpt: 'Analyse des tendances du marché immobilier à Saïdia pour 2026.',
      coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
      category: 'Immobilier',
      isPublished: false,
      userId: admin.id,
    },
  });
  console.log('✅ Blogs créés');

  // Create some Sales records for statistics
  await prisma.sale.create({
    data: {
      propertyId: property1.id,
      amount: 17500,
      type: 'reservation',
      status: 'completed',
      userId: admin.id,
    },
  });

  await prisma.sale.create({
    data: {
      propertyId: property2.id,
      amount: 5600,
      type: 'reservation',
      status: 'completed',
      userId: admin.id,
    },
  });

  await prisma.sale.create({
    data: {
      propertyId: property3.id,
      amount: 10500,
      type: 'reservation',
      status: 'completed',
      userId: admin.id,
    },
  });
  console.log('✅ Ventes créées');

  console.log('\n🎉 Seed terminé avec succès!\n');
  console.log('📊 Résumé:');
  console.log('  - 3 Utilisateurs (1 admin, 2 utilisateurs)');
  console.log('  - 6 Villes (Saïdia, Nador, Oujda, Casablanca, Marrakech, Tanger)');
  console.log('  - 8 Propriétés (4 locations, 4 ventes)');
  console.log('  - 5 Réservations');
  console.log('  - 5 Leads');
  console.log('  - 2 Périodes de dates bloquées');
  console.log('  - 3 Sections hero');
  console.log('  - 4 Articles de blog (3 publiés, 1 brouillon)');
  console.log('  - 3 Enregistrements de ventes\n');
  console.log('🔐 Identifiants de connexion:');
  console.log('  Admin: admin@saidiabay.com / Admin@123');
  console.log('  User 1: ahmed@example.com / User@123');
  console.log('  User 2: fatima@example.com / User@123\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur pendant le seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });