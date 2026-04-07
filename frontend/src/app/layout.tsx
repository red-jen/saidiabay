import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import AuthProvider from '@/components/auth/AuthProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Dynamic import to avoid SSR issues
const ComparisonBar = dynamic(
  () => import('@/components/properties/ComparisonBar'),
  { ssr: false }
);

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Saidia Bay Real Estate - Premium Properties for Rent & Sale',
    template: '%s | Saidia Bay Real Estate',
  },
  description:
    'Discover premium apartments, villas, and real estate properties for rent and sale in Saidia Bay, Morocco. Your trusted partner in finding the perfect property.',
  keywords: [
    'Saidia Bay',
    'real estate',
    'properties',
    'apartments',
    'villas',
    'rent',
    'sale',
    'Morocco',
    'Saidia',
  ],
  authors: [{ name: 'Saidia Bay Real Estate' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://saidiabay.com',
    siteName: 'Saidia Bay Real Estate',
    title: 'Saidia Bay Real Estate - Premium Properties for Rent & Sale',
    description:
      'Discover premium apartments, villas, and real estate properties for rent and sale in Saidia Bay, Morocco.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} overflow-x-hidden`}>
      <body className="font-sans antialiased overflow-x-hidden">
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          <ComparisonBar />
        </AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
