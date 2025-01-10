import { useEffect, useState } from "react";
import { convertToFlag, getWeatherIcon } from "./services/helpers";
import { LuSearch } from "react-icons/lu";

function Weather() {
  const [weather, setWeather] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [Country, setCountry] = useState();

  // useEffect(
  //   function () {
  //     async function fetchWeather() {
  //       if (location.length < 3) return setWeather(() => []);
  //       setisLoading(true);
  //       try {
  //         const geoRes = await fetch(
  //           `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
  //         );
  //         const geoData = await geoRes.json();

  //         if (!geoData.results) throw new Error("Location not found");

  //         const { latitude, longitude, timezone, name, country_code } =
  //           geoData.results.at(0);

  //         const weatherRes = await fetch(
  //           `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
  //         );
  //         const weatherData = await weatherRes.json();
  //         setCountry(() => `${name} ${convertToFlag(country_code)}`);
  //         setWeather(weatherData.daily);
  //       } catch (err) {
  //         console.error(err);
  //       } finally {
  //         setisLoading(false);
  //       }
  //     }

  //     fetchWeather();
  //   },
  //   [location]
  // );

  function HandleSubmit(e) {
    e.preventDefault();

    async function fetchWeather() {
      if (location.length < 3) return setWeather(() => []);
      setisLoading(true);
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
        );
        const geoData = await geoRes.json();

        if (!geoData.results) throw new Error("Location not found");

        const { latitude, longitude, timezone, name, country_code } =
          geoData.results.at(0);

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
        );
        const weatherData = await weatherRes.json();
        setCountry(() => `${name} ${convertToFlag(country_code)}`);
        setWeather(weatherData.daily);
      } catch (err) {
        console.error(err);
      } finally {
        setisLoading(false);
      }
    }

    fetchWeather();
  }
  return (
    <div className="flex flex-col items-center  gap-4 ">
      <header className="z-50 bg-[url('/hero.jpeg')]  bg-no-repeat bg-cover bg-center w-full h-56 rounded-md flex flex-col items-center">
        <form onSubmit={HandleSubmit} className="flex px-4 items-center gap-1">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            type="text"
            placeholder="city ..."
            className="text-indigo-500 bg-transparent backdrop-blur-xl rounded-lg border-none  focus:outline-none focus:ring-2 focus:ring-indigo-600 px-4  transition-all placeholder:text-indigo-500 duration-300 py-2 my-4"
          />
          <button className="bg-indigo-500 border-none focus:border-none focus:outline-none hover:bg-indigo-600 transition-all duration-300 focus:ring focus:ring-indigo-600  text-indigo-50 font-medium block px-4 py-2 rounded-lg">
            search
          </button>
        </form>
        {Country && (
          <h1 className="text-slate-100 font-medium text-2xl">{Country}</h1>
        )}

        {isLoading ? (
          <SmallSpinner />
        ) : (
          weather?.weathercode?.map((el, ndx) => (
            <div className="flex flex-col" key={ndx}>
              <span className="text-4xl mb-5">
                {ndx === 0 && getWeatherIcon(el)}
              </span>
              <div className="flex items-center gap-2">
                {ndx === 0 && (
                  <span className="text-white font-medium text-lg">
                    {Math.trunc(weather.temperature_2m_min[0])}° _
                  </span>
                )}
                {ndx === 0 && (
                  <span className="text-white font-medium text-lg">
                    {Math.trunc(weather.temperature_2m_max[0])}°
                  </span>
                )}
              </div>
              {ndx === 0 && (
                <span className="text-center text-white font-medium text-lg">
                  Today
                </span>
              )}
            </div>
          ))
        )}
      </header>
      {weather.length === 0 && (
        <h1 className="text-indigo-500 text-center px-4 font-medium mt-10 text-2xl">
          Discover the weather in every city you go 😀
        </h1>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <main className="w-full overflow-scroll ">
          <div className="grid grid-cols-3 gap-2">
            {weather?.time?.map((time, ndx) => (
              <div
                key={ndx}
                className=" backdrop-blur-[5px] border bg-indigo-100 p-4 rounded-lg  transition-all duration-100 cursor-pointer flex flex-col items-center"
              >
                <p className="text-3xl mb-5">
                  {getWeatherIcon(weather.weathercode[ndx])}
                </p>
                <p className="text-slate-800">
                  {ndx === 0 && "today"}
                  {ndx === 1 && "tomorrow"}
                  {ndx > 1 && new Date(time).toDateString().slice(0, 3)}
                </p>
                <div className="flex items-center justify-center gap-2 w-full">
                  <p className="text-xs font-medium text-slate-700">
                    {Math.trunc(weather.temperature_2m_min[ndx])}° _
                  </p>
                  <p className="text-xs font-medium text-slate-700">
                    {Math.trunc(weather.temperature_2m_max[ndx])} °
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="mt-44 flex flex-row gap-2">
      <div className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce [animation-delay:.7s]"></div>
      <div className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce [animation-delay:.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce [animation-delay:.7s]"></div>
    </div>
  );
}

function SmallSpinner() {
  return (
    <div className="mt-10 flex flex-row gap-2">
      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:.7s]"></div>
      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:.3s]"></div>
      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:.7s]"></div>
    </div>
  );
}
export default Weather;
