import React, { useState } from 'react';

const ListaPaises = ({ options, onSelect }) => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
        onSelect(event.target.value);
    };

    return (
        <select value={selectedOption} onChange={handleChange}>
            <option value="" disabled>Selecciona un país</option>
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

export default ListaPaises;
