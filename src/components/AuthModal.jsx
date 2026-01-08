import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import './AuthModal.css'

function AuthModal({ isOpen, onClose, onLoginSuccess }) {
    const [activeTab, setActiveTab] = useState('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            onLoginSuccess(data.user)
            onClose()
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSignup = () => {
        // Redirect to onboarding page
        window.location.href = '/onboarding'
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={20} strokeWidth={2} />
                </button>

                <h2 className="modal-title">Seller Access</h2>

                <div className="modal-tabs">
                    <button
                        className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Log In
                    </button>
                    <button
                        className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
                        onClick={() => setActiveTab('signup')}
                    >
                        Sign Up
                    </button>
                </div>

                {activeTab === 'login' ? (
                    <form className="auth-form" onSubmit={handleLogin}>
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                ) : (
                    <div className="signup-content">
                        <p>New to FAD? Create your seller account to get verified.</p>
                        <button className="auth-submit-btn" onClick={handleSignup}>
                            Start Onboarding
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AuthModal
