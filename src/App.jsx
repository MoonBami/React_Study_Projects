import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_KEY = "YOUR_API_KEY"
function App() {
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityname] = useState('your location');

  const handleSubmit = (e) => {
    e.preventDefault();

    searchRegion(inputValue)
    setInputValue('')

  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude // 위도
      const lon = position.coords.longitude // 경도
      getWeather(lat, lon)
    }
    )
  }, [])
  const getWeather = async (lat, lon) => {
    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`)

      setWeatherData(res.data);

      setLoading(false);
      

    } catch (error) {
      console.log(error)
      setApiError(error.message);
    }
  }

  const searchRegion = async (region) => {
    if (!region) return

    setLoading(true);
    setApiError(null);

    try {
      const res = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${region}&limit=1&appid=${API_KEY}`)
      if(res.status =="200" && res.data.length > 0)
      {
        setCityname(region)
        const lat = res.data[0].lat
        const lon = res.data[0].lon
        getWeather(lat, lon)
      }
      else{
        throw new Error("지역을 찾을 수 없습니다.")
      }
    } catch (error) {
      console.log("API 호출 실패",error)
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="container">
      <div className='title'>
        <h3>날씨 측정 페이지 </h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="searchRegion">
          <div className='search'>
            <h3>원하는 지역을 검색해 주세요 : </h3>
            <input type="text" value={inputValue}
              onChange={(e) => setInputValue(e.target.value)} />
            <button type="submit">검색</button>
          </div>
        </div>
      </form>
      {loading ?(
        <div className="loading">로딩중...</div>
      ) : apiError ? (
        <div className="error">에러: {apiError}</div>
      ) : (
        weatherData &&(
        <div className="weatherInfo">
          <h2>{weatherData.sys.country}</h2>
          <h3>{cityName} 날씨</h3>
          <p>날씨 : {weatherData.weather[0].description}</p>
          <p>현재 온도 : {weatherData.main.temp}°C</p>
          <p>체감 온도 : {weatherData.main.feels_like}°C</p>
          <p>최저 온도 : {weatherData.main.temp_min}°C</p>
          <p>최고 온도 : {weatherData.main.temp_max}°C</p>
          <p>습도: {weatherData.main.humidity}%</p>
        </div>
        )
      )}
    </div>
  )
}


export default App
