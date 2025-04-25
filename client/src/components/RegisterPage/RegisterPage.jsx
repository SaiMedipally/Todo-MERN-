import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [selected, setSelected] = useState({ email: false, password: false });
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('*All fields are required');
            return;
        }
        if (!validateEmail(email)) {
            setError('*Invalid email format');
            return;
        }
        if (password.length < 6) {
            setError('*Password must be at least 6 characters');
            return;
        }

        try {
            const response = await fetch('http://localhost:5500/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong!');
        }
    };

    const handleBlur = (field) => {
        setSelected((prev) => ({ ...prev, [field]: true }));
    };

    const isFieldEmpty = (fieldValue) => !fieldValue.trim();

    return (
        <div className='main-container'>
            <div className="register-container">
                <h2 className="register-title">Create an Account</h2>
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => handleBlur('email')}
                            className="register-input"
                        />
                        {/* Show error if email is empty or invalid */}
                        {selected.email && isFieldEmpty(email) && (
                            <p className="error-message">*Email is required</p>
                        )}
                        {selected.email && !validateEmail(email) && (
                            <p className="error-message">*Invalid email format</p>
                        )}
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => handleBlur('password')}
                            className="register-input"
                        />
                        {/* Show error if password is empty or too short */}
                        {selected.password && isFieldEmpty(password) && (
                            <p className="error-message">*Password is required</p>
                        )}
                        {selected.password && password.length < 6 && (
                            <p className="error-message">*Password must be at least 6 characters</p>
                        )}
                    </div>

                    {/* General error message */}
                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
