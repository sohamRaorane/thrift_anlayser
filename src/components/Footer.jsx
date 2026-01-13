import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section brand-section">
                    <h2 className="footer-brand">FAD</h2>
                    <p className="footer-tagline">Trust Benchmark for Verified Thrift Stores</p>
                    <p className="footer-description">
                        Empowering thrift shoppers with verified data and transparent vendor insights.
                    </p>
                </div>

                <div className="footer-section links-section">
                    <h3>Platform</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/discover">Discover Stores</Link></li>
                        <li><Link to="/report">Report a Store</Link></li>
                        <li><Link to="/dashboard">Seller Dashboard</Link></li>
                    </ul>
                </div>

                <div className="footer-section legal-section">
                    <h3>Legal</h3>
                    <ul>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Cookie Policy</a></li>
                    </ul>
                </div>

                <div className="footer-section contact-section">
                    <h3>Contact</h3>
                    <p>support@fad.com</p>
                    <div className="social-links">
                        <a href="#" aria-label="Instagram">Instagram</a>
                        <a href="#" aria-label="Twitter">Twitter</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} FAD. All rights reserved.</p>
                <p className="scrolling-text">Est. 2025 • Digital Edition • Verified Authentic</p>
            </div>
        </footer>
    );
};

export default Footer;
