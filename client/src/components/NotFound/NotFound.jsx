import React from 'react';
import { Link } from 'react-router-dom';
import './notfound.css'

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1 className="not-found-title">Page Not Found</h1>
            <p className="not-found-message">The page you are looking for does not exist.</p>
            <Link to="/login">Go Back to Login Page</Link>

        </div>
    );
};

export default NotFound;
