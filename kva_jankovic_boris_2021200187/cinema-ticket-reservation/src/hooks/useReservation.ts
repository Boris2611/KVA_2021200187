import { useState } from 'react';
import { Reservation, User } from '../types';

const useReservation = () => {
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

    const updateReservation = (newReservation: Reservation) => {
        setReservation(newReservation);
    };

    const updateUser = (newUser: User) => {
        setUser(newUser);
    };

    const selectSeats = (seats: number[]) => {
        setSelectedSeats(seats);
    };

    const clearReservation = () => {
        setReservation(null);
        setUser(null);
        setSelectedSeats([]);
    };

    return {
        reservation,
        user,
        selectedSeats,
        updateReservation,
        updateUser,
        selectSeats,
        clearReservation,
    };
};

export default useReservation;