export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-violet-700 to-purple-600 text-white mt-16">
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* ✅ BRAND */}
        <div>
          <h2 className="text-2xl font-bold">
            <span className="text-violet-200">Vector</span> Learning App
          </h2>
          <p className="mt-3 text-sm text-violet-100 leading-relaxed">
            A modern e-learning platform to help you learn smarter, faster, and better.
          </p>
        </div>

        {/* ✅ QUICK LINKS */}
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-violet-100">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/courses" className="hover:text-white">Courses</a></li>
            <li><a href="/about" className="hover:text-white">About</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* ✅ SUPPORT */}
        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm text-violet-100">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* ✅ CONTACT */}
        <div>
          <h3 className="font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm text-violet-100">
            <li>Email: support@vectorlearningapp.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>India</li>
          </ul>
        </div>
      </div>

      {/* ✅ BOTTOM BAR */}
      <div className="border-t border-violet-500 text-center py-4 text-sm text-violet-200">
        © {new Date().getFullYear()} Vector Learning App. All rights reserved.
      </div>
    </footer>
  );
}
