import { useEffect, useState } from 'preact/hooks';
import { lang } from '../i18n';
import { IconCloud, IconRain, IconSun } from './icons';

interface Wx { temp: number; code: number }
// Lisboa por omissão; a localização configurável entra nas Definições (fase 4)
const LAT = 38.72, LON = -9.14;

function useWeather() {
  const [wx, setWx] = useState<Wx | null>(null);
  useEffect(() => {
    let dead = false;
    const load = async () => {
      try {
        const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code`);
        const j = await r.json();
        if (!dead) setWx({ temp: Math.round(j.current.temperature_2m), code: j.current.weather_code });
      } catch { /* sem rede: esconde o widget */ }
    };
    load();
    const id = setInterval(load, 15 * 60_000);
    return () => { dead = true; clearInterval(id); };
  }, []);
  return wx;
}

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const WxIcon = ({ code }: { code: number }) =>
  code === 0 || code === 1 ? <IconSun size={30} /> : code >= 51 ? <IconRain size={30} /> : <IconCloud size={30} />;

export function Clock() {
  const now = useNow();
  const l = lang.use();
  return <span>{now.toLocaleTimeString(l, { hour: '2-digit', minute: '2-digit', hour12: false })}</span>;
}

export function Weather() {
  const wx = useWeather();
  if (!wx) return null;
  return <span class="wx"><WxIcon code={wx.code} /> {wx.temp}°</span>;
}

export function ClockWeather() {
  const now = useNow();
  const wx = useWeather();
  const l = lang.use();
  return (
    <div class="clockwx">
      <div class="clockwx__wx">{wx && <><WxIcon code={wx.code} /> <span>{wx.temp}°</span></>}</div>
      <div class="clockwx__time">{now.toLocaleTimeString(l, { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
      <div class="clockwx__date">{now.toLocaleDateString(l, { weekday: 'long', day: 'numeric', month: 'short' })}</div>
    </div>
  );
}
