export default function Footer() {
  return (
    <footer className="mt-12 bg-amber-100 text-amber-900 shadow-inner border-t border-amber-300">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-semibold mb-3">About LankaFurniture</h2>
          <p className="text-amber-800">
            Marketplace for wooden products and expert craftsman services.
            We handle repairs, custom jobs, and doorstep delivery with tracking.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2">
            <li><a href="/privacy" className="hover:text-amber-600 transition">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-amber-600 transition">Terms of Service</a></li>
            <li><a href="/contact" className="hover:text-amber-600 transition">Contact Us</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Follow Us</h2>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-amber-600 transition">Facebook</a>
            <a href="#" className="hover:text-amber-600 transition">Instagram</a>
            <a href="#" className="hover:text-amber-600 transition">Twitter</a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-amber-200 text-center py-3 text-sm text-amber-700 border-t border-amber-300">
        © {new Date().getFullYear()} LankaFurniture. All rights reserved.
      </div>
    </footer>
  );
}