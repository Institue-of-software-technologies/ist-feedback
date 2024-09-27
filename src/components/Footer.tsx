export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-4">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} My Website. All rights reserved.</p>
      </div>
    </footer>
  );
}
