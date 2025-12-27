import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Saidia Bay Real Estate',
  description: 'Our privacy policy and how we handle your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-secondary-50 py-16 border-b border-secondary-200">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-secondary-600">
            Last updated: December 27, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="section">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Saidia Bay Real Estate. We respect your privacy and are committed to protecting
              your personal data. This privacy policy will inform you about how we look after your personal
              data when you visit our website and tell you about your privacy rights.
            </p>

            <h2>2. Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you:</p>
            <ul>
              <li>
                <strong>Identity Data:</strong> includes first name, last name, username or similar identifier
              </li>
              <li>
                <strong>Contact Data:</strong> includes email address and telephone numbers
              </li>
              <li>
                <strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version,
                time zone setting and location, operating system and platform
              </li>
              <li>
                <strong>Usage Data:</strong> includes information about how you use our website and services
              </li>
              <li>
                <strong>Marketing and Communications Data:</strong> includes your preferences in receiving marketing
                from us and your communication preferences
              </li>
            </ul>

            <h2>3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul>
              <li>To register you as a new customer</li>
              <li>To process and deliver your property search or reservation</li>
              <li>To manage our relationship with you</li>
              <li>To improve our website, products/services, marketing or customer relationships</li>
              <li>To send you marketing communications (with your consent)</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being
              accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We limit
              access to your personal data to those employees, agents, contractors and other third parties
              who have a business need to know.
            </p>

            <h2>5. Data Retention</h2>
            <p>
              We will only retain your personal data for as long as necessary to fulfil the purposes we
              collected it for, including for the purposes of satisfying any legal, accounting, or reporting
              requirements.
            </p>

            <h2>6. Your Legal Rights</h2>
            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
            <ul>
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>

            <h2>7. Third-Party Links</h2>
            <p>
              This website may include links to third-party websites, plug-ins and applications. Clicking
              on those links or enabling those connections may allow third parties to collect or share data
              about you. We do not control these third-party websites and are not responsible for their
              privacy statements.
            </p>

            <h2>8. Cookies</h2>
            <p>
              We use cookies to distinguish you from other users of our website. This helps us to provide
              you with a good experience when you browse our website and also allows us to improve our site.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us:
            </p>
            <ul>
              <li>Email: privacy@saidiabay.com</li>
              <li>Phone: +212 XXX XXX XXX</li>
              <li>Address: Saidia Bay, Morocco</li>
            </ul>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by
              posting the new privacy policy on this page and updating the "last updated" date.
            </p>

            <div className="mt-12 pt-8 border-t border-secondary-200 not-prose">
              <Link
                href="/contact"
                className="btn-primary"
              >
                Contact Us About Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

