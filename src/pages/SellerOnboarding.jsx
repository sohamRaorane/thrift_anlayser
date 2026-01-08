import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Instagram } from 'lucide-react'
import { supabase } from '../lib/supabase'
import './SellerOnboarding.css'

function SellerOnboarding() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        instagramUrl: '',
        phoneNumber: '',
        email: '',
        gstin: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [step, setStep] = useState(1) // 1: Form, 2: OTP Verification

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Sign up with Supabase
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        instagram_url: formData.instagramUrl,
                        phone_number: formData.phoneNumber,
                        gstin: formData.gstin
                    }
                }
            })

            if (error) throw error

            // Move to verification step or redirect to dashboard
            setStep(2)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="page seller-onboarding">
            <header className="onboarding-header">
                <div className="breadcrumb" onClick={() => navigate('/')}>
                    <ArrowLeft size={16} strokeWidth={2} />
                    <span>Back</span>
                </div>
                <h1>Seller Onboarding</h1>
            </header>

            <div className="onboarding-container">
                <div className="onboarding-card">
                    <div className="card-header">
                        <h2>Verify Your Store on FAD!</h2>
                        <p>Complete the form below to start your verification process</p>
                    </div>

                    {step === 1 ? (
                        <form className="onboarding-form" onSubmit={handleSubmit}>
                            {error && <div className="error-message">{error}</div>}

                            <div className="form-section">
                                <label htmlFor="instagramUrl">Instagram Store URL</label>
                                <input
                                    id="instagramUrl"
                                    name="instagramUrl"
                                    type="url"
                                    value={formData.instagramUrl}
                                    onChange={handleChange}
                                    required
                                    placeholder="https://instagram.com/yourstore"
                                />
                            </div>

                            <div className="form-section">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>

                            <div className="form-section">
                                <label htmlFor="email">Email ID</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div className="form-section">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Create a secure password"
                                    minLength={6}
                                />
                            </div>

                            <div className="form-section">
                                <label htmlFor="gstin">GSTIN</label>
                                <input
                                    id="gstin"
                                    name="gstin"
                                    type="text"
                                    value={formData.gstin}
                                    onChange={handleChange}
                                    required
                                    placeholder="22AAAAA0000A1Z5"
                                />
                                <small>GST Identification Number (required for verification)</small>
                            </div>

                            <div className="verification-note">
                                <Instagram size={20} strokeWidth={2} />
                                <div>
                                    <strong>Instagram Verification</strong>
                                    <p>You'll be asked to verify store ownership via Instagram login after submission</p>
                                </div>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit for Verification'}
                            </button>
                        </form>
                    ) : (
                        <div className="verification-success">
                            <h3>Registration Successful!</h3>
                            <p>Please check your email to verify your account.</p>
                            <p>After verification, you can log in to access your seller dashboard.</p>
                            <button className="submit-btn" onClick={() => navigate('/dashboard')}>
                                Go to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default SellerOnboarding
