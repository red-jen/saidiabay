import { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with SaidiaBay Real Estate. Contact us for property inquiries, viewings, or any questions about our services.',
};

export default function ContactPage() {
  return (
    <div className="section">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Address */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-1">Address</h3>
                  <p className="text-secondary-600">
                    123 Boulevard Mohammed VI<br />
                    Saidia Bay, Morocco 60600
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiPhone className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-1">Phone</h3>
                  <p className="text-secondary-600">
                    <a href="tel:+212600000000" className="hover:text-primary-600">
                      +212 6 00 00 00 00
                    </a>
                  </p>
                  <p className="text-secondary-600">
                    <a href="tel:+212500000000" className="hover:text-primary-600">
                      +212 5 00 00 00 00
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-1">Email</h3>
                  <p className="text-secondary-600">
                    <a href="mailto:contact@saidiabay.com" className="hover:text-primary-600">
                      contact@saidiabay.com
                    </a>
                  </p>
                  <p className="text-secondary-600">
                    <a href="mailto:sales@saidiabay.com" className="hover:text-primary-600">
                      sales@saidiabay.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiClock className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-1">Working Hours</h3>
                  <p className="text-secondary-600">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-secondary-100">
              <h2 className="text-2xl font-semibold text-secondary-800 mb-6">
                Send us a Message
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
