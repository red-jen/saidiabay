import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FiCheckCircle, FiAward, FiUsers, FiTrendingUp, FiHeart, FiMapPin } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'About Us - Saidia Bay Real Estate',
  description: 'Learn about our mission, values, and the team dedicated to helping you find your dream property in Saidia Bay.',
};

export default function AboutPage() {
  const stats = [
    { value: '10+', label: 'Years Experience' },
    { value: '500+', label: 'Properties Sold' },
    { value: '1000+', label: 'Happy Clients' },
    { value: '100%', label: 'Verified Listings' },
  ];

  const values = [
    {
      icon: FiCheckCircle,
      title: 'Integrity',
      description: 'We operate with complete transparency and honesty in all our dealings.',
    },
    {
      icon: FiAward,
      title: 'Excellence',
      description: 'We strive for the highest standards in everything we do.',
    },
    {
      icon: FiUsers,
      title: 'Client-Focused',
      description: 'Your satisfaction and success are our top priorities.',
    },
    {
      icon: FiHeart,
      title: 'Passion',
      description: 'We love what we do and it shows in our service quality.',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: '15+ years of experience in luxury real estate',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Sales',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      bio: 'Expert in property investment and market analysis',
    },
    {
      name: 'Emma Williams',
      role: 'Property Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Specializes in vacation rentals and property management',
    },
    {
      name: 'David Martinez',
      role: 'Marketing Director',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      bio: 'Digital marketing expert with a passion for real estate',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920"
          alt="About Saidia Bay Real Estate"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/70" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto text-white">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6">
              About Saidia Bay<br />Real Estate
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-2xl">
              Your trusted partner in finding the perfect property in Morocco's Mediterranean paradise
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="section">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-secondary-700 leading-relaxed">
                <p>
                  Founded in 2014, Saidia Bay Real Estate has grown to become one of the most trusted
                  names in Mediterranean property. Our journey began with a simple vision: to help
                  people discover their dream homes in one of Morocco's most beautiful coastal regions.
                </p>
                <p>
                  Over the years, we've built a reputation for exceptional service, deep local knowledge,
                  and a genuine commitment to our clients' success. Whether you're looking for a vacation
                  home, an investment property, or your permanent residence, we're here to guide you
                  every step of the way.
                </p>
                <p>
                  Today, we're proud to have helped over 1,000 families find their perfect property in
                  Saidia Bay. Our team of experienced professionals brings together decades of combined
                  expertise in real estate, property management, and customer service.
                </p>
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-luxury-lg">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                alt="Saidia Bay Properties"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-secondary-50 section">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl font-heading font-bold text-primary-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-secondary-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="section">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl hover:bg-secondary-50 transition-colors"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-secondary-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-secondary-50 section">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Experienced professionals dedicated to your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-luxury transition-shadow"
              >
                <div className="relative h-80">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-700 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-secondary-600 text-sm">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="section">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-primary-900 to-primary-700 rounded-2xl p-12 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Let our experienced team help you discover the perfect property in Saidia Bay
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/properties" className="btn bg-white text-primary-900 hover:bg-primary-50">
                Browse Properties
              </Link>
              <Link href="/contact" className="btn border-2 border-white text-white hover:bg-white/10">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

