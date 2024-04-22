// NotFound.js
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found">
        <h1 className="not-found-title">404 - Page Not Found</h1>
        <p className="not-found-text">
          Oops! The page you are looking for does not exist.
        </p>
        <Link to="/" className="not-found-link">
          Go to Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
