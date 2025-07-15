import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-blue-400">Sportzal Fitness</span>
            </div>
            <p className="text-gray-300 mb-6">
              Your complete fitness companion for achieving health and wellness goals through 
              personalized plans and community support.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/exercises">
                  <span className="hover:text-blue-400 transition-colors cursor-pointer">
                    Exercise Library
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/bmi">
                  <span className="hover:text-blue-400 transition-colors cursor-pointer">
                    BMI Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/planner">
                  <span className="hover:text-blue-400 transition-colors cursor-pointer">
                    Workout Planner
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/calories">
                  <span className="hover:text-blue-400 transition-colors cursor-pointer">
                    Calorie Counter
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/blogs">
                  <span className="hover:text-blue-400 transition-colors cursor-pointer">
                    Community Blogs
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to get the latest fitness tips and updates.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Sportzal Fitness. All rights reserved. Built with passion for fitness and health.</p>
        </div>
      </div>
    </footer>
  );
}
