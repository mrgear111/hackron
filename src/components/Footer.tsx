const Footer = () => {
  return (
    <footer className="bg-black/90 border-t border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">HACKRON</h3>
            <p className="text-gray-400">Empowering innovation through technology</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/projects" className="hover:text-white">Projects</a></li>
              <li><a href="/teams" className="hover:text-white">Teams</a></li>
              <li><a href="/submit" className="hover:text-white">Submit Project</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@hackron.com</li>
              <li>Follow us on Twitter @hackron</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 Hackron. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 