import axios from 'axios';
import { Reservation } from '../types';

const API_BASE_URL = 'https://api.example.com'; // Zameni sa pravim URL-om

export const fetchMovies = async () => {
    const response = await axios.get(`${API_BASE_URL}/movies`);
    return response.data;
};

export const fetchMovieDetails = async (movieId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies/${movieId}`);
        return response.data;
    } catch (err) {
        throw err;
    }
};

export const reserveSeats = async (reservationData: Reservation) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/reservations`, reservationData);
        return response.data;
    } catch (err) {
        throw err;
    }
};