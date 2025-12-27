import { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Contact Us - Saidia Bay Real Estate',
  description: 'Get in touch with our team for any inquiries about properties, rentals, or sales in Saidia Bay.',
};

export default function ContactPage() {
  const contactInfo = [
    {
      icon: FiMapPin,
      title: 'Visit Us',
      details: ['Saidia Bay Marina', 'Saidia, Morocco'],
    },
    {
      icon: FiPhone,
      title: 'Call Us',
      details: ['+212 6 00 00 00 00', '+212 5 00 00 00 00'],
    },
    {
      icon: FiMail,
      title: 'Email Us',
      details: ['contact@saidiabay.com', 'info@saidiabay.com'],
    },
    {
      icon: FiClock,
      title: 'Working Hours',
      details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM'],
    },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="section">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form - 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                  Send Us a Message
                </h2>
                <ContactForm />
              </div>
            </div>

            {/* Contact Info - 1 column */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="text-primary-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 mb-2">
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-secondary-600 text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Map Placeholder */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-64 bg-secondary-200 flex items-center justify-center">
                  <FiMapPin className="text-secondary-400" size={48} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Browse our extensive collection of properties or speak with one of our expert agents today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/properties" className="btn bg-white text-primary-600 hover:bg-primary-50">
              Browse Properties
            </a>
            <a
              href="tel:+212600000000"
              className="btn border-2 border-white text-white hover:bg-white/10"
            >
              <FiPhone className="mr-2" />
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
