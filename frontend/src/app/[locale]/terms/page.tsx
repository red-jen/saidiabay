import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - Saidia Bay Real Estate',
  description: 'Terms and conditions for using Saidia Bay Real Estate services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-secondary-50 py-16 border-b border-secondary-200">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-900 mb-4">
            Terms of Service
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
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Saidia Bay Real Estate's website and services, you accept and agree
              to be bound by the terms and provision of this agreement. If you do not agree to these terms,
              please do not use our services.
            </p>

            <h2>2. Use of Service</h2>
            <h3>2.1 Eligibility</h3>
            <p>
              You must be at least 18 years old to use our services. By using our services, you represent
              and warrant that you meet this requirement.
            </p>

            <h3>2.2 Account Registration</h3>
            <p>
              To access certain features, you may be required to register for an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>

            <h2>3. Property Listings</h2>
            <h3>3.1 Accuracy of Information</h3>
            <p>
              While we strive to provide accurate and up-to-date property information, we cannot guarantee
              the accuracy, completeness, or timeliness of the information. Property details, prices, and
              availability are subject to change without notice.
            </p>

            <h3>3.2 Third-Party Content</h3>
            <p>
              Some property listings may be provided by third parties. We are not responsible for the
              accuracy or legality of third-party content.
            </p>

            <h2>4. Reservations and Bookings</h2>
            <h3>4.1 Booking Process</h3>
            <p>
              When you make a reservation through our platform:
            </p>
            <ul>
              <li>You enter into a direct contractual relationship with the property owner</li>
              <li>You agree to pay the total amount as specified</li>
              <li>You agree to the cancellation and refund policy for that specific property</li>
              <li>You are responsible for reviewing and accepting the property's specific terms</li>
            </ul>

            <h3>4.2 Cancellations and Refunds</h3>
            <p>
              Cancellation policies vary by property. Please review the specific cancellation policy before
              making a reservation. Refunds are subject to the property's cancellation policy and may include
              processing fees.
            </p>

            <h2>5. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for any illegal purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>Transmit any harmful code or malware</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Impersonate any person or entity</li>
              <li>Collect information about other users</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, images, and software, is the
              property of Saidia Bay Real Estate or its content suppliers and is protected by international
              copyright laws. You may not reproduce, distribute, or create derivative works without our
              express written permission.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Saidia Bay Real Estate shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, or any loss of profits or
              revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or
              other intangible losses resulting from:
            </p>
            <ul>
              <li>Your use or inability to use the service</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
              <li>Any interruption or cessation of transmission to or from the service</li>
              <li>Any bugs, viruses, or other harmful code that may be transmitted through our service</li>
            </ul>

            <h2>8. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Saidia Bay Real Estate and its officers,
              directors, employees, and agents from any claims, liabilities, damages, losses, and expenses,
              including reasonable legal fees, arising out of or in any way connected with your access to
              or use of the service or your violation of these terms.
            </p>

            <h2>9. Modifications to Service</h2>
            <p>
              We reserve the right to modify or discontinue, temporarily or permanently, the service (or any
              part thereof) with or without notice. We shall not be liable to you or any third party for any
              modification, suspension, or discontinuance of the service.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of Morocco, without
              regard to its conflict of law provisions.
            </p>

            <h2>11. Dispute Resolution</h2>
            <p>
              Any disputes arising out of or relating to these terms or the service shall be resolved through
              binding arbitration in accordance with the rules of Morocco, except that either party may seek
              injunctive relief in any court of competent jurisdiction.
            </p>

            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to update or modify these terms at any time without prior notice. Your
              continued use of the service after any such changes constitutes your acceptance of the new terms.
            </p>

            <h2>13. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <ul>
              <li>Email: legal@saidiabay.com</li>
              <li>Phone: +212 XXX XXX XXX</li>
              <li>Address: Saidia Bay, Morocco</li>
            </ul>

            <div className="mt-12 pt-8 border-t border-secondary-200 not-prose">
              <div className="flex gap-4">
                <Link href="/contact" className="btn-primary">
                  Contact Us
                </Link>
                <Link href="/privacy" className="btn-secondary">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

