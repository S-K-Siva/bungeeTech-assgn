import { useState } from 'react';
import { Country, State, City } from 'country-state-city';
import { FaTemperatureHigh } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { LuAlarmClockCheck } from "react-icons/lu";
import { FaMapLocation } from "react-icons/fa6";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@coreui/coreui/dist/css/coreui.min.css';

function App() {
  const [countries, setCountries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedWeather, setSelectedWeather] = useState({});
  const [selectedWeatherInfo,setWeatherInfo] = useState({});
  const [searchTrigger, setSearchTrigger] = useState(false);

  const countryHandler = (country) => {
    if (country) {
      setSelectedCountry(country.isoCode);
      setStates(State.getStatesOfCountry(country.isoCode));
      setSelectedState(null); // Reset state
      setCities([]); // Reset cities
    }
  };

  const stateHandler = (state) => {
    if (state) {
      setSelectedState(state.isoCode);
      setCities(City.getCitiesOfState(selectedCountry, state.isoCode));
      setSelectedCity(null); // Reset city
    }
  };

  const getWeather = () => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity},${selectedState},${selectedCountry}&appid=${import.meta.env.VITE_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if(data){
          setSelectedWeather(data['weather'][0]);
          setWeatherInfo(data['main']);
        }
      }

    );
    setSearchTrigger(true);
  };

  const refreshAll = () => {
    setSearchTrigger(false);
    setSelectedCountry(null);
    setSelectedCity(null);
    setSelectedState(null);
    setSelectedWeather(null);
    setWeatherInfo(null);
    setCities([]);
    setStates([]);
  }

  return (
    <div className="main-container">
    {!searchTrigger && (<div className="Mycontainer text-center mt-5">
      <FaMapLocation style={{'width':'7rem','height':'7rem','margin':'2rem'}}/>
      <h1 className="mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>Gio Weather</h1>
      <div className="col justify-content-center">
        <div className="row-md-4 mb-3">
          <select
            className="form-select"
            onChange={(e) =>
              countryHandler(countries.find((current) => current.isoCode === e.target.value))
            }
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option value={country.isoCode} key={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCountry && (
          <div className="row-md-4 mb-3">
            <select
              className="form-select"
              onChange={(e) =>
                stateHandler(states.find((current) => current.isoCode === e.target.value))
              }
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option value={state.isoCode} key={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedState && (
          <div className="row-md-4 mb-3">
            <select
              className="form-select"
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option value={city.name} key={city.isoCode}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <button className="btn btn-primary mt-3" onClick={getWeather}>
        Search
      </button>
      </div>
    )
    }
      {searchTrigger&& (
        <div className="Mycontainer1 mt-5">
          <FaMapLocation style={{'width':'7rem','height':'7rem','margin':'2rem'}}/>
          <div className='space-line'></div>
          <p className='location'>{selectedCity},{selectedState},{selectedCountry}</p>
          <h2 style={{ fontFamily: 'Arial, sans-serif' }}>
            {selectedWeather.main}
          </h2>
          <p className="lead text-muted" id="weather-desc">{selectedWeather.description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${selectedWeather.icon}@4x.png`}
            alt="Weather Icon"
            className="img-fluid"
            style={{ maxWidth: '200px', height: 'auto' }}
          />
          {
            console.log(selectedWeatherInfo)
          }
          
            <div className="container">
              <div className='space-line'></div>
              <FaTemperatureHigh style={{'width':'4rem','height':'4rem','margin':'2rem'}}/>
              <h3>Temperature </h3>
              <p>{(selectedWeatherInfo.temp - 273.15).toFixed(2)} &deg; C</p>
              <div className='space-line'></div>
              <WiHumidity style={{'width':'4rem','height':'4rem','margin':'2rem'}}/>
              <h3>Humidity </h3>
              <p>{selectedWeatherInfo.humidity} %</p>
              <div className='space-line'></div>
              <LuAlarmClockCheck style={{'width':'4rem','height':'4rem','margin':'2rem'}}/>
              <h3>Pressure</h3>
              <p>{selectedWeatherInfo.pressure} hPa</p>
            
            </div>
          <button className='btn btn-secondary mt-5'
          onClick={() => refreshAll()}
          >Search Again</button>
        </div>
      )
      }
    
    </div>
  );
}

export default App