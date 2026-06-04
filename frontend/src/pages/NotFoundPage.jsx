import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold">
        404
      </h1>

      <p>Page Not Found</p>

      <Link to="/">
        Back Home
      </Link>
    </div>
  );
}

export default NotFoundPage;