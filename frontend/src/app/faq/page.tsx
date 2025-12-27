'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

const faqs = [
  {
    category: 'General',
    questions: [
      {
        question: 'What areas do you cover?',
        answer: 'We primarily focus on properties in Saidia Bay and the surrounding Mediterranean coast of Morocco. Our expertise includes beachfront properties, golf resorts, and urban developments in the region.',
      },
      {
        question: 'How do I start my property search?',
        answer: 'You can start by browsing our property listings on the website, or contact our team directly for personalized assistance. We recommend scheduling a consultation to discuss your specific needs and preferences.',
      },
      {
        question: 'Do you work with international buyers?',
        answer: 'Yes! We have extensive experience working with international clients and can assist with the entire process, including legal requirements, currency exchange, and property management.',
      },
    ],
  },
  {
    category: 'Buying',
    questions: [
      {
        question: 'What are the costs involved in buying property?',
        answer: 'Besides the purchase price, you should budget for registration fees (approximately 2.5-5% of the property value), notary fees, legal fees, and potential agency fees. We provide a detailed breakdown for each property.',
      },
      {
        question: 'Can foreigners buy property in Morocco?',
        answer: 'Yes, foreigners can buy property in Morocco without restrictions in most areas. However, there are some regulations for agricultural land. We guide you through all legal requirements.',
      },
      {
        question: 'How long does the buying process take?',
        answer: 'Typically, the process takes 2-3 months from offer acceptance to completion. This includes due diligence, contract preparation, and registration. We can expedite this in certain circumstances.',
      },
      {
        question: 'Do you offer property inspections?',
        answer: 'Yes, we recommend professional property inspections for all purchases and can arrange these for you. This helps identify any potential issues before you commit to the purchase.',
      },
    ],
  },
  {
    category: 'Renting',
    questions: [
      {
        question: 'What is the minimum rental period?',
        answer: 'Minimum rental periods vary by property. Short-term vacation rentals typically have a minimum of 3-7 nights, while long-term rentals usually require a minimum 6-month lease.',
      },
      {
        question: 'What is included in the rental price?',
        answer: 'This varies by property. Most rentals include utilities, WiFi, and basic maintenance. Vacation rentals often include linens and housekeeping. Always check the specific listing for details.',
      },
      {
        question: 'Is there a security deposit?',
        answer: 'Yes, security deposits are standard. For vacation rentals, it\'s typically 25-50% of the rental price. For long-term rentals, it\'s usually equivalent to 1-2 months\' rent.',
      },
      {
        question: 'Can I cancel my reservation?',
        answer: 'Cancellation policies vary by property and booking type. Most properties offer partial or full refunds if cancelled within a certain timeframe. Check the specific cancellation policy when booking.',
      },
    ],
  },
  {
    category: 'Selling',
    questions: [
      {
        question: 'How do you determine property value?',
        answer: 'We conduct a comprehensive market analysis considering location, property condition, recent sales of comparable properties, and current market trends to provide an accurate valuation.',
      },
      {
        question: 'What marketing do you provide?',
        answer: 'We offer professional photography, virtual tours, listings on major property portals, social media marketing, and targeted advertising to international and local buyers.',
      },
      {
        question: 'How long does it take to sell a property?',
        answer: 'This varies based on property type, price, and market conditions. On average, well-priced properties sell within 3-6 months. Luxury properties may take longer but we have an extensive network of qualified buyers.',
      },
      {
        question: 'What are your commission rates?',
        answer: 'Our commission rates are competitive and transparent. They vary based on property value and services required. Contact us for a personalized quote and full breakdown of services included.',
      },
    ],
  },
  {
    category: 'Property Management',
    questions: [
      {
        question: 'Do you offer property management services?',
        answer: 'Yes, we provide comprehensive property management including maintenance, rent collection, tenant screening, and emergency repairs. We also handle vacation rental management with guest services.',
      },
      {
        question: 'What are the property management fees?',
        answer: 'Fees typically range from 8-15% of monthly rental income, depending on the level of service required. We offer customized packages to suit your specific needs.',
      },
      {
        question: 'Can you help with vacation rental management?',
        answer: 'Absolutely! We handle everything from marketing and bookings to guest check-in/out, cleaning, and maintenance. We maximize your rental income while ensuring excellent guest experiences.',
      },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('General');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const activeFAQ = faqs.find((faq) => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-20">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
            <FiHelpCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Find answers to common questions about buying, selling, and renting properties in Saidia Bay
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="section">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Categories
                </h3>
                <nav className="space-y-1">
                  {faqs.map((faq) => (
                    <button
                      key={faq.category}
                      onClick={() => {
                        setActiveCategory(faq.category);
                        setOpenIndex(0);
                      }}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg transition-all font-medium
                        ${activeCategory === faq.category
                          ? 'bg-primary-50 text-primary-900'
                          : 'text-secondary-700 hover:bg-secondary-50'
                        }
                      `}
                    >
                      {faq.category}
                      <span className="ml-2 text-xs text-secondary-500">
                        ({faq.questions.length})
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* FAQ List */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {activeFAQ?.questions.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-secondary-50 transition-colors"
                    >
                      <span className="font-semibold text-secondary-900 pr-4">
                        {item.question}
                      </span>
                      <FiChevronDown
                        className={`w-5 h-5 text-secondary-600 flex-shrink-0 transition-transform ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openIndex === index && (
                      <div className="px-6 pb-5 text-secondary-700 leading-relaxed border-t border-secondary-100">
                        <div className="pt-4">
                          {item.answer}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Still Have Questions */}
          <div className="mt-16 bg-white rounded-2xl shadow-md p-12 text-center">
            <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-secondary-600 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our team is here to help you with any questions you may have.
            </p>
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

