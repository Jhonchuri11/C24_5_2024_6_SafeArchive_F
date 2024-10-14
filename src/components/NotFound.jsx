import React from "react";
import { Link } from "react-router-dom";
import '../style/NotFound.css';

const NotFound = () => {
  return (
    <section className="container d-flex justify-content-center align-items-center vh-100">
      <div className="py-8 text-center card shadow p-4">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 dark:text-white">
            Something's missing.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.
          </p>
          <Link
            to="/inicio"
            className="btn btn-primary mt-3 bg-primary"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
