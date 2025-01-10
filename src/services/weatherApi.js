async function fetchWeather(){
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
          console.log(geoData);
  
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
          );
          const weatherData = await weatherRes.json();
          setDisplayLocation(() => `${name} ${convertToFlag(country_code)}`);
          setWeather([weatherData.daily]);
        } catch (err) {
          console.error(err);
        } finally {
          setisLoading(false);
        }
      }
  
      fetchWeather();
    },
}
export {fetchWeather} ;