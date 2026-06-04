import {
  Link,
} from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between items-center py-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-600"></div>

        <div>
          <h1 className="font-bold">
            Smart Energy
          </h1>

          <p className="text-xs text-gray-400">
            Predictor
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
        <a href="#">Features</a>
        <a href="#">Analytics</a>
        <a href="#">Prediction</a>
        <a href="#">Contact</a>
      </div>

      <Link
        to="/dashboard"
        className="bg-blue-600 text-white px-5 py-3 rounded-2xl"
      >
        Dashboard
      </Link>
    </nav>
  );
}

export default Navbar;