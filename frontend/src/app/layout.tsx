import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: {
    default: 'SaidiaBay Real Estate - Find Your Dream Property',
    template: '%s | SaidiaBay Real Estate',
  },
  description:
    'Discover premium apartments, villas, and properties for rent and sale in Saidia Bay. Professional real estate platform with easy pre-reservation system.',
  keywords: [
    'real estate',
    'Saidia Bay',
    'apartments',
    'villas',
    'property rental',
    'property sale',
    'Morocco real estate',
  ],
  authors: [{ name: 'SaidiaBay' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://saidiabay.com',
    siteName: 'SaidiaBay Real Estate',
    title: 'SaidiaBay Real Estate - Find Your Dream Property',
    description:
      'Discover premium apartments, villas, and properties for rent and sale in Saidia Bay.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SaidiaBay Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaidiaBay Real Estate',
    description:
      'Discover premium apartments, villas, and properties for rent and sale in Saidia Bay.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
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
