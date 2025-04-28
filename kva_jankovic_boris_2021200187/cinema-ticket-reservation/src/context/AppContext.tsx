import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Reservation } from '../types';

interface AppContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    reservations: Reservation[];
    addReservation: (reservation: Reservation) => void;
    updateProfile: (user: User) => void;
    updateReservation: (reservation: Reservation) => void;
    deleteReservation: (movieId: number, userEmail: string, showtime: string) => void;
}
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    const [reservations, setReservations] = useState<Reservation[]>(
        JSON.parse(localStorage.getItem('reservations') || '[]')
    );

    const login = (user: User) => {
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const addReservation = (reservation: Reservation) => {
        setReservations(prev => {
            const updated = [...prev, reservation];
            localStorage.setItem('reservations', JSON.stringify(updated));
            return updated;
        });
    };

    const updateProfile = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        // update user in users list
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.map((u: User) => u.email === updatedUser.email ? updatedUser : u);
        localStorage.setItem('users', JSON.stringify(users));
    };

    const updateReservation = (reservation: Reservation) => {
        setReservations(prev => {
            const updated = prev.map(r =>
                r.movieId === reservation.movieId &&
                r.user.email === reservation.user.email &&
                r.showtime === reservation.showtime
                    ? reservation
                    : r
            );
            localStorage.setItem('reservations', JSON.stringify(updated));
            return updated;
        });
    };
    
    const deleteReservation = (movieId: number, userEmail: string, showtime: string) => {
        setReservations(prev => {
            const updated = prev.filter(r =>
                !(r.movieId === movieId && r.user.email === userEmail && r.showtime === showtime)
            );
            localStorage.setItem('reservations', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AppContext.Provider value={{
            user, login, logout, reservations,
            addReservation, updateProfile, updateReservation, deleteReservation
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useAppContext must be used within AppProvider');
    return ctx;
};