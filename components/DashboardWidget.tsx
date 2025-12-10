import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Loader2, CloudFog } from 'lucide-react';

interface WeatherData {
  temperature: number;
  weatherCode: number;
}

const QUOTES = [
  "Focus on being productive instead of busy.",
  "Starve your distractions, feed your focus.",
  "The successful warrior is the average man, with laser-like focus.",
  "Your focus determines your reality.",
  "Concentrate all your thoughts upon the work at hand.",
  "Energy flows where attention goes.",
  "One reason so few of us achieve what we truly want is that we never direct our focus; we never concentrate our power.",
  "Success is not the key to happiness. Happiness is the key to success.",
  "Don't watch the clock; do what it does. Keep going.",
  "Simplicity is the ultimate sophistication.",
  "It always seems impossible until it's done.",
  "Action is the foundational key to all success."
];

const DashboardWidget: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [quote, setQuote] = useState("");

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Quote
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  // Weather Fetch
  useEffect(() => {
    if (!navigator.geolocation) {
        setError(true);
        return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`
          );
          const data = await response.json();
          if (data.current) {
            setWeather({
              temperature: data.current.temperature_2m,
              weatherCode: data.current.weather_code,
            });
          }
        } catch (err) {
          console.error('Failed to fetch weather', err);
          setError(true);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied or failed', err);
        setError(true);
        setLoading(false);
      }
    );
  }, []);

  // Map WMO codes to Icons
  const getWeatherIcon = (code: number) => {
    // 0: Clear sky
    if (code === 0 || code === 1) return <Sun className="w-8 h-8 text-yellow-300 drop-shadow-sm" />;
    // 2-3: Cloudy
    if (code === 2 || code === 3) return <Cloud className="w-8 h-8 text-white/80 drop-shadow-sm" />;
    // 45, 48: Fog
    if (code === 45 || code === 48) return <CloudFog className="w-8 h-8 text-white/60" />;
    // 51-67: Drizzle/Rain
    if (code >= 51 && code <= 67) return <CloudRain className="w-8 h-8 text-blue-200 drop-shadow-sm" />;
    // 71-77: Snow
    if (code >= 71 && code <= 77) return <CloudSnow className="w-8 h-8 text-white drop-shadow-sm" />;
    // 80-82: Showers
    if (code >= 80 && code <= 82) return <CloudRain className="w-8 h-8 text-blue-200" />;
    // 95-99: Thunderstorm
    if (code >= 95) return <CloudLightning className="w-8 h-8 text-yellow-200" />;
    
    return <Sun className="w-8 h-8 text-yellow-300" />;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
  };

  const formatTime = (date: Date) => {
     return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
  };

  return (
    <div className="w-full max-w-md mb-8 flex flex-col gap-5 animate-fade-in px-2">
        <div className="flex items-end justify-between text-white/95">
            <div>
                <div className="text-5xl font-bold tracking-tight drop-shadow-md leading-none mb-1">{formatTime(currentTime)}</div>
                <div className="text-sm font-medium opacity-90 uppercase tracking-widest drop-shadow-sm">{formatDate(currentTime)}</div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-3 bg-black/10 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg min-h-[56px]">
                    {!weather && !loading && !error && <span className="text-xs font-medium">Updating...</span>}
                    {loading && <Loader2 className="w-5 h-5 animate-spin opacity-70" />}
                    {error && <span className="text-xs font-medium opacity-80">No Weather</span>}
                    
                    {weather && (
                        <>
                            {getWeatherIcon(weather.weatherCode)}
                            <div className="text-2xl font-bold drop-shadow-md">{Math.round(weather.temperature)}°</div>
                        </>
                    )}
                </div>
            </div>
        </div>
        
        <div className="text-center relative py-1">
             <p className="text-sm font-medium text-white/90 italic drop-shadow-md max-w-[90%] mx-auto leading-relaxed">
               "{quote}"
            </p>
        </div>
    </div>
  );
};

export default DashboardWidget;