import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-gray-300">
          TechToolsHub
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/ai-tools" className="hover:text-gray-300">
              AI Tools
            </Link>
          </li>
          <li>
            <Link href="/smartphone-tech" className="hover:text-gray-300">
              Smartphone Tech
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 