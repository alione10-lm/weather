import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function Weather() {
  const [location, setLocation] = useState("");
  // const [displayLocation, setDisplayLocation] = useState();
  // setDisplayLocation(() => `${name} ${convertToFlag(country_code)}`);

  const { isPending, error, data } = useQuery({
    queryKey: ["repoData", location],
    queryFn: async () => {
      if (location.length <= 2) {
        return;
      }
      const res1 = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
      );
      const geoData = await res1.json();

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      return await weatherRes.json();
    },
  });
  console.log(data);

  // if (error) return "An error has occurred: " + error.message;
  // if (error) return <p>location not found</p>;

  return (
    <div>
      <header>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          type="text"
          className="bg-indigo-50 rounded-lg border-none  focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 transition-all duration-300 py-2 focus:ring-offset-2"
        />
      </header>

      {!location.length && <p>start searching for your city 😀</p>}

      {isPending ? (
        <p>Loading ...</p>
      ) : (
        <div>
          {data?.daily?.temperature_2m_max?.map((el, ndx) => (
            <div className="flex items-center gap-5" key={ndx}>
              <p>
                {Math.trunc(el)}
                <span className="text-xs ">
                  {data.daily_units.temperature_2m_min}
                </span>
              </p>
              <p>
                {Math.trunc(data?.daily?.temperature_2m_min[ndx])}
                <span className="text-xs ">
                  {data.daily_units.temperature_2m_min}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Weather;
