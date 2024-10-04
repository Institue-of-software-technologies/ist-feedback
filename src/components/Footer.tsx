export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-4">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-medium text-gray-300">&copy; {new Date().getFullYear()} Institute of Software Technologies. All rights reserved.</p>
        <p className="text-xs mt-2">Empowering Innovators Through Quality IT Education</p>
        <div className="flex justify-center mt-4 space-x-4">
          <a 
            href="https://www.facebook.com/ISTeducation" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-red-600 transition-colors duration-300"
          >
            Facebook
          </a>
          <a 
            href="https://www.linkedin.com/school/ist-kenya" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-red-600 transition-colors duration-300"
          >
            LinkedIn
          </a>
          <a 
            href="https://twitter.com/IST_Kenya" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-red-600 transition-colors duration-300"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}
