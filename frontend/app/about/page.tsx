export default function AboutPage() {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About Saidia Bay</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              Saidia Bay is dedicated to connecting potential clients with property owners and administrators,
              making the process of finding, viewing, and reserving real estate properties as seamless as possible.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-600">Extensive collection of premium properties for rent and sale</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-600">Easy-to-use booking system with smart calendar integration</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-600">Secure administrative interface for property management</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-600">Lead generation and contact management system</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-600">SEO-optimized platform for maximum visibility</span>
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 mb-4">
              Our platform is designed with both property seekers and owners in mind. We provide a responsive,
              scalable, and secure environment that simplifies the entire property transaction process.
            </p>
            <p className="text-gray-600">
              Whether you&apos;re looking to rent, buy, or manage properties, Saidia Bay offers the tools and
              support you need to succeed in the real estate market.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
