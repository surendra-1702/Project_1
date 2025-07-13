import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-fitness-primary opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <span className="text-3xl font-black text-energy text-athletic tracking-wider">FITTRACK PRO</span>
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed font-medium">
              Your complete fitness companion for achieving health and wellness goals through 
              personalized plans and powerful tracking.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition-all duration-300 hover-lift hover-glow">
                <i className="fab fa-facebook text-lg"></i>
              </a>
              <a href="#" className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition-all duration-300 hover-lift hover-glow">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition-all duration-300 hover-lift hover-glow">
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a href="#" className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition-all duration-300 hover-lift hover-glow">
                <i className="fab fa-youtube text-lg"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black mb-6 text-athletic uppercase tracking-wide text-red-400">Features</h3>
            <ul className="space-y-4 text-gray-300">
              <li>
                <Link href="/exercises">
                  <span className="hover:text-red-400 transition-all duration-300 cursor-pointer font-bold uppercase tracking-wide text-sm hover-lift">
                    Exercise Library
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/bmi">
                  <span className="hover:text-red-400 transition-all duration-300 cursor-pointer font-bold uppercase tracking-wide text-sm hover-lift">
                    BMI Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/planner">
                  <span className="hover:text-red-400 transition-all duration-300 cursor-pointer font-bold uppercase tracking-wide text-sm hover-lift">
                    Workout Planner
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/calories">
                  <span className="hover:text-red-400 transition-all duration-300 cursor-pointer font-bold uppercase tracking-wide text-sm hover-lift">
                    Calorie Counter
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/workout-tracker">
                  <span className="hover:text-red-400 transition-all duration-300 cursor-pointer font-bold uppercase tracking-wide text-sm hover-lift">
                    Workout Tracker
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-black mb-6 text-athletic uppercase tracking-wide text-red-400">Support</h3>
            <ul className="space-y-4 text-gray-300">
              <li><a href="#" className="hover:text-red-400 transition-all duration-300 font-bold uppercase tracking-wide text-sm hover-lift">Help Center</a></li>
              <li><a href="#" className="hover:text-red-400 transition-all duration-300 font-bold uppercase tracking-wide text-sm hover-lift">Contact Us</a></li>
              <li><a href="#" className="hover:text-red-400 transition-all duration-300 font-bold uppercase tracking-wide text-sm hover-lift">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-red-400 transition-all duration-300 font-bold uppercase tracking-wide text-sm hover-lift">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-black mb-6 text-athletic uppercase tracking-wide text-red-400">Stay Updated</h3>
            <p className="text-gray-300 mb-6 font-medium leading-relaxed">
              Subscribe to get the latest fitness tips and updates.
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-800/50 border border-red-600/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 font-medium backdrop-blur-sm transition-all duration-300"
              />
              <button
                type="submit"
                className="w-full btn-primary py-3 rounded-lg font-bold uppercase tracking-wide hover-glow"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-red-600/20 mt-16 pt-8 text-center">
          <p className="text-gray-400 font-medium tracking-wide">
            &copy; 2025 <span className="text-red-400 font-bold">FITTRACK PRO</span>. All rights reserved. Built with passion for fitness and health.
          </p>
        </div>
      </div>
    </footer>
  );
}
