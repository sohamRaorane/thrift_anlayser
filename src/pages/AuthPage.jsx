import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { Instagram, ArrowRight, X } from 'lucide-react';
import './AuthPage.css'; // We'll create this CSS next

export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [instagramUsername, setInstagramUsername] = useState('');

    // Get return URL from state or default to home
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await authService.signInWithPassword(email, password);
            } else {
                if (!instagramUsername) {
                    throw new Error("Instagram username is required for verification.");
                }
                await authService.signUp(email, password, instagramUsername);
                alert("Account created! Please check your email to verify account.");
            }
            // Redirect back to where they came from
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <button className="close-btn" onClick={() => navigate('/')}><X size={20} /></button>

                <div className="auth-header">
                    <h1>{isLogin ? 'Welcome Back' : 'Join Our Community'}</h1>
                    <p>{isLogin ? 'Sign in to file reports and write reviews.' : 'Create an account to start reviewing verified stores.'}</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">

                    {!isLogin && (
                        <div className="form-group">
                            <label>Instagram Username</label>
                            <div className="input-with-icon">
                                <Instagram size={18} className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="your_insta_handle"
                                    value={instagramUsername}
                                    onChange={(e) => setInstagramUsername(e.target.value)}
                                    required={!isLogin}
                                />
                            </div>
                            <small>Used to display as author for reports/reviews</small>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            className="toggle-auth-btn"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
