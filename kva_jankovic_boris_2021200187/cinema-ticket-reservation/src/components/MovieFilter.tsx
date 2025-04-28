import React, { useState } from 'react';
import '../styles/components/MovieFilter.css';

export interface MovieFilterValues {
    title: string;
    genre: string;
    sortBy: string;
}

interface MovieFilterProps {
    genres: string[];
    onFilter: (values: MovieFilterValues) => void;
}

const MovieFilter: React.FC<MovieFilterProps> = ({ genres, onFilter }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [values, setValues] = useState<MovieFilterValues>({
        title: '',
        genre: '',
        sortBy: 'showtime'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilter(values);
    };

    return (
        <div>
            <button className="filter-toggle-btn" type="button" onClick={() => setShowFilters(f => !f)}>
                {showFilters ? 'Zatvori filtere' : 'Prikaži filtere'}
            </button>
            {showFilters && (
                <form className="movie-filter" onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Pretraga po nazivu"
                        value={values.title}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                    <select name="genre" value={values.genre} onChange={handleChange}>
                        <option value="">Svi žanrovi</option>
                        {genres.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                    <select name="sortBy" value={values.sortBy} onChange={handleChange}>
                        <option value="showtime">Najbliži termin</option>
                        <option value="title">Naziv (A-Z)</option>
                    </select>
                    <button type="submit">Primeni</button>
                </form>
            )}
        </div>
    );
};

export default MovieFilter;