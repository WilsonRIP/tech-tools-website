'use client';

import Link from 'next/link';
// We might not need AITool and SmartphoneReview types here if we only pass simple props for links
// Or if we pass the full objects, we would import them.
// For now, assuming the HomePage (Server Component) handles the data structure for cards.

// This component will contain the parts of the homepage that use styled-jsx animations.
const HomeAnimations = () => {
  return (
    <>
      <section className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white dark:from-blue-700 dark:to-indigo-800 rounded-lg shadow-xl text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-extrabold mb-4 animate-fade-in-down">
            Welcome to TechToolsHub!
          </h1>
          <p className="text-xl mb-8 animate-fade-in-up delay-200">
            Your ultimate destination for the latest in smartphone technology and cutting-edge AI tools.
          </p>
          <div className="space-x-4 animate-fade-in-up delay-400">
            <Link href="/ai-tools"
              className="bg-white text-indigo-600 dark:bg-indigo-500 dark:text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-indigo-400 transition duration-300 ease-in-out transform hover:scale-105">
              Explore AI Tools
            </Link>
            <Link href="/smartphone-tech"
              className="bg-yellow-400 text-gray-900 dark:bg-yellow-500 font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-yellow-300 dark:hover:bg-yellow-400 transition duration-300 ease-in-out transform hover:scale-105">
              Smartphone Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Basic animation styles - these are now correctly in a Client Component */}
      <style jsx global>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>
    </>
  );
};

export default HomeAnimations; 