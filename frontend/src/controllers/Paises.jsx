import React, { useState, useEffect } from 'react';
import ListaPaises from './ListaPaises'; // Asegúrate de que la ruta sea correcta

const Pais = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/countries');
                const data = await response.json();
                setCountries(data);
            } catch (error) {
                console.error('Error al obtener los países:', error);
            }
        };

        fetchCountries();
    }, []);

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        console.log('País seleccionado:', country);
    };

    return (
        <div>
            <h1>Selecciona un país</h1>
            <ListaPaises 
                options={countries.map(country => country.nombre)} 
                onSelect={handleCountrySelect} 
            />
        </div>
    );
};

export default Pais;
