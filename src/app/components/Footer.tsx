const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white p-6 mt-12 shadow-md">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} TechToolsHub. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-1">
          Curated by Luke (WilsonIIRIP)
        </p>
        {/* You can add social links or other relevant links here */}
      </div>
    </footer>
  );
};

export default Footer; 