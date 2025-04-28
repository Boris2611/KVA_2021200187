import React from 'react';
import '../styles/pages/Home.css';

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <h1>Dobrodošli u SingiKino !</h1>
            <p>
                Brzo i jednostavno rezervišite svoje karte za omiljene filmove!<br />
                Prijavite se ili napravite nalog, izaberite film i termin, odaberite sedišta i uživajte u projekciji.
            </p>
            <div className="home-features">
                <div>
                    <span role="img" aria-label="film" className="home-emoji">🎬</span>
                    <h3>Veliki izbor filmova</h3>
                    <p>Pregledajte aktuelne naslove i pronađite projekciju koja vam odgovara.</p>
                </div>
                <div>
                    <span role="img" aria-label="karte" className="home-emoji">🎟️</span>
                    <h3>Online rezervacija</h3>
                    <p>Izaberite sedišta i rezervišite karte iz udobnosti svog doma.</p>
                </div>
                <div>
                    <span role="img" aria-label="user" className="home-emoji">👤</span>
                    <h3>Lični nalog</h3>
                    <p>Pratite svoje rezervacije i uživajte u personalizovanom iskustvu.</p>
                </div>
            </div>
            <div className="home-cta">
                <a href="/movies" className="home-btn">Pogledaj repertoar</a>
                <a href="/register" className="home-btn secondary">Registruj se</a>
            </div>
        </div>
    );
};

export default Home;