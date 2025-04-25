import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = '*Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = '*Invalid email format';
        }
        if (!formData.password.trim()) {
            newErrors.password = '*Password is required';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = '*Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setGeneralError('');

        try {
            const response = await fetch('http://localhost:5500/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', data.email);
                navigate('/home');
            } else {
                setGeneralError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Error:', err);
            setGeneralError('Network error. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailBlur = () => {
        if (!formData.email.trim()) {
            setErrors(prev => ({
                ...prev,
                email: '*Email is required'
            }));
        } else if (!validateEmail(formData.email)) {
            setErrors(prev => ({
                ...prev,
                email: '*Invalid email format'
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                email: ''
            }));
        }
    };

    const handlePasswordBlur = () => {
        if (!formData.password.trim()) {
            setErrors(prev => ({
                ...prev,
                password: '*Password is required'
            }));
        } else if (!validatePassword(formData.password)) {
            setErrors(prev => ({
                ...prev,
                password: '*Password must be at least 6 characters'
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                password: ''
            }));
        }
    };

    return (
        <div className='home-container'>
            <div className='heading'>
                <h1 className='app-heading'>Todo Application</h1>
                <p className='title'>Organize your Tasks</p>
            </div>
            <div className='login-container'>
                <h1 className='login-title'>Login</h1>
                <p className='heading'>Enter your email and password to login to your account</p>

                <form onSubmit={handleSubmit} className='login-form'>
                    <div className='input-container'>
                        <input
                            className={`form-input ${errors.email ? 'has-error' : ''}`}
                            type='email'
                            name='email'
                            value={formData.email}
                            placeholder='example@gmail.com'
                            onChange={handleChange}
                            onBlur={handleEmailBlur}
                            disabled={isSubmitting}
                        />
                        {errors.email && <p className='error-text'>{errors.email}</p>}

                        <input
                            className={`form-input ${errors.password ? 'has-error' : ''}`}
                            type='password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handlePasswordBlur}
                            placeholder='Password'
                            disabled={isSubmitting}
                        />
                        {errors.password && <p className='error-text'>{errors.password}</p>}
                    </div>
                    <div className='button-container'>
                        <button
                            type='submit'
                            className='signin-button'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Logging in' : 'Log In'}
                        </button>
                    </div>

                    {generalError && <p className='error-text general-error'>{generalError}</p>}

                    <div className='new-user'>
                        <p>
                            Don't have an account? <Link to="/register">Register</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
