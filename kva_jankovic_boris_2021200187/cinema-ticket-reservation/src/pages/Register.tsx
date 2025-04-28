import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/pages/Register.css';

const genresList = ['Komedija', 'Drama', 'Avantura', 'Akcija', 'Horor', 'SF', 'Animirani'];

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
    const [error, setError] = useState('');
    const history = useHistory();

    const handleGenreChange = (g: string) => {
        setFavoriteGenres(favoriteGenres.includes(g)
            ? favoriteGenres.filter(x => x !== g)
            : [...favoriteGenres, g]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find((u: any) => u.email === email)) {
            setError('Korisnik sa tim emailom već postoji');
            return;
        }
        users.push({ name, email, password, phone, address, favoriteGenres });
        localStorage.setItem('users', JSON.stringify(users));
        history.push('/login');
    };

    return (
        <div className="register-container">
            <h2>Registracija</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ime i prezime" required />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Lozinka" required />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telefon" required />
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Adresa" required />
                <div>
                    <span>Omiljeni žanrovi:</span>
                    {genresList.map(g => (
                        <label key={g} style={{ marginLeft: 8 }}>
                            <input
                                type="checkbox"
                                value={g}
                                checked={favoriteGenres.includes(g)}
                                onChange={() => handleGenreChange(g)}
                            /> {g}
                        </label>
                    ))}
                </div>
                <button type="submit">Registruj se</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Register;