import React from 'react';
import '../styles/components/SeatSelection.css';

interface SeatSelectionProps {
    selectedSeats: string[];
    setSelectedSeats: (seats: string[]) => void;
}

// Helper to generate seat labels (A1, A2, ..., J12)
const generateSeats = (rows = 10, cols = 12) => {
    const seats: string[] = [];
    for (let r = 0; r < rows; r++) {
        const rowLetter = String.fromCharCode(65 + r); // A, B, C...
        for (let c = 1; c <= cols; c++) {
            seats.push(`${rowLetter}${c}`);
        }
    }
    return seats;
};

const SeatSelection: React.FC<SeatSelectionProps> = ({ selectedSeats, setSelectedSeats }) => {
    const rows = 10;
    const cols = 12;
    const seats = generateSeats(rows, cols);

    const handleSeatClick = (seat: string) => {
        setSelectedSeats(
            selectedSeats.includes(seat)
                ? selectedSeats.filter(s => s !== seat)
                : [...selectedSeats, seat]
        );
    };

    // Render seats as a grid with row labels
    return (
        <div className="seat-selection">
            <h2>Izaberite svoja sedišta</h2>
            <div className="screen-label">Platno</div>
            <div className="seats-grid">
                {Array.from({ length: rows }).map((_, rowIdx) => (
                    <div className="seat-row" key={rowIdx}>
                        <span className="row-label">{String.fromCharCode(65 + rowIdx)}</span>
                        {Array.from({ length: cols }).map((_, colIdx) => {
                            const seatLabel = `${String.fromCharCode(65 + rowIdx)}${colIdx + 1}`;
                            return (
                                <div
                                    key={seatLabel}
                                    className={`seat ${selectedSeats.includes(seatLabel) ? 'selected' : ''}`}
                                    onClick={() => handleSeatClick(seatLabel)}
                                >
                                    {colIdx + 1}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="selected-seats">
                <h3>Izabrana sedišta: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Nijedno'}</h3>
            </div>
        </div>
    );
};

export default SeatSelection;