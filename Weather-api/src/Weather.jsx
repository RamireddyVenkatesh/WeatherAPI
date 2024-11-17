// Weather.jsx
import { Search, Waves, Wind } from 'lucide-react';
import React, { useState, useEffect } from 'react';

/**
 * @typedef {Object} WeatherData
 * @property {number} humidity
 * @property {number} windspeed
 * @property {number} temperature
 * @property {string} location
 * @property {string} icon
 */

const Weather = () => {
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    const search_field = async () => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=a8f3286f42d9563981557004f932d752&units=metric`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod !== 200) { 
                throw new Error(data.message || "Failed to fetch data");
            }

            setError(null);
            setWeatherData({
                humidity: data.main.humidity,
                windspeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            });
        } catch (error) {
            setError("City not found...!");
            setWeatherData(null);
        }
    };

    const fetchWeatherByCoordinates = async (lat, lon) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=a8f3286f42d9563981557004f932d752&units=metric`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod !== 200) {
                throw new Error(data.message || "Failed to fetch data");
            }

            setError(null);
            setWeatherData({
                humidity: data.main.humidity,
                windspeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            });
        } catch (error) {
            setError("Could not fetch weather for current location.");
            setWeatherData(null);
        }
    };

    const handleSearch = (e) => {
        setLocation(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            search_field();
        }
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoordinates(latitude, longitude);
            },
            (error) => {
                console.error("Error getting location: ", error);
                setError("Location access denied.");
            }
        );
    }, []);

    return (
        <>
            <div className="w-full h-max bg-emerald-100 flex justify-center">
                <div className="w-[300px] h-[480px] border border-black bg-blue-800 rounded-[12px] m-[140px]">
                    <div className='flex justify-items-start m-6'>
                        <input
                            type="text" 
                            onChange={handleSearch}
                            onKeyPress={handleKeyPress}
                            className='border border-black w-48 h-8 outline-none rounded-[15px] pl-5' 
                            placeholder='Search' 
                        />
                        <Search 
                            className='bg-white p-[5px] w-16 h-8 ml-4 border border-black rounded-[30px]' 
                            onClick={search_field}
                        />
                    </div>
                    {error &&<center><p className="text-red-400">{error}</p></center>}
                    {weatherData && (
                        <div className='grid grid-cols-1 justify-self-center text-white'>
                            <img src={weatherData.icon} alt="Weather Icon" className="w-44 h-44 mx-auto" />
                            <p className="text-5xl">{weatherData.temperature}°C</p>
                            <p className="text-2xl font-bold">{weatherData.location}</p><br />
                            <div className='grid grid-cols-2 gap-2'>
                                <div className='flex justify-start gap-2'>
                                    <Waves />
                                    <div>
                                        <p>{weatherData.humidity}%</p>
                                        <span>Humidity</span>
                                    </div>
                                </div>
                                <div className='flex justify-start gap-2'>
                                    <Wind />
                                    <div>
                                        <p>{weatherData.windspeed} m/s</p>
                                        <p>Wind Speed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Weather;
