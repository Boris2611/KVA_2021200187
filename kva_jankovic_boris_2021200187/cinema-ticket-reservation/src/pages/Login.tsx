import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import '../styles/pages/Login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAppContext();
    const history = useHistory();
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (user) {
            login({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                favoriteGenres: user.favoriteGenres || []
            });
            history.push('/');
        } else {
            setError('Pogrešan email ili lozinka');
        }
    };

    return (
        <div className="login-container">
            <h2>Prijava</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Lozinka" required />
                <button type="submit">Prijavi se</button>
            </form>
            {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
            <div className="login-register-link">
                <span>Nemate nalog?</span>
                <Link to="/register" className="register-link">Registrujte se</Link>
            </div>
        </div>
    );
};

export default Login;