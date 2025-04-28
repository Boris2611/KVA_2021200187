import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FaHome, FaFilm, FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import '../styles/components/BottomNav.css';

const BottomNav: React.FC = () => {
    const { user, logout } = useAppContext();
    const history = useHistory();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        history.push('/');
    };

    return (
        <nav className="bottom-nav">
            <ul>
                <li>
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                        {FaHome({ className: "nav-icon" })}
                    </Link>
                </li>
                <li>
                    <Link to="/movies" className={location.pathname.startsWith('/movies') ? 'active' : ''}>
                        {FaFilm({ className: "nav-icon" })}
                    </Link>
                </li>
                {user ? (
                    <>
                        <li>
                            <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
                                {FaUser({ className: "nav-icon" })}
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="bottom-nav-btn">
                                {FaSignOutAlt({ className: "nav-icon" })}
                            </button>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                            {FaSignInAlt({ className: "nav-icon" })}
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default BottomNav;