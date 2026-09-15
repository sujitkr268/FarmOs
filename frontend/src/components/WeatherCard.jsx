import React from 'react'
import { useLanguage } from '../context/LanguageContext'

export const WeatherCard = ({ weatherData }) => {
  const { t } = useLanguage()
  if (!weatherData || !weatherData.current) return null

  const { current, daily_forecast, latitude, longitude, timezone, elevation } = weatherData

  return (
    <div style={{ width: '100%' }}>
      {/* Current Weather Card Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(16, 19, 26, 0.95) 100%)',
        border: '1px solid var(--border-gold)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
        position: 'relative'
      }}>
        {/* Top Header: Condition Badge & Location Meta */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '1.8rem' }}>☁️</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {t('weather.title')}
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              📍 {t('common.location')}: <strong>{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E</strong> ({timezone} • Elev: {elevation}m)
            </p>
          </div>

          <span style={{
            backgroundColor: 'rgba(212, 175, 55, 0.18)',
            border: '1px solid var(--accent-gold)',
            color: 'var(--accent-gold-light)',
            fontSize: '0.85rem',
            fontWeight: 700,
            padding: '0.4rem 0.9rem',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            {current.weather_description}
          </span>
        </div>

        {/* Current Weather Grid Metrics */}
        <div className="weather-metrics-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem',
          marginTop: '1.5rem'
        }}>
          {/* Temperature */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
              {t('weather.temperature')}
            </span>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              {current.temperature}°C
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
              Feels like {current.apparent_temperature}°C
            </span>
          </div>

          {/* Humidity */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
              {t('weather.humidity')}
            </span>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              💧 {current.humidity}%
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
              Relative humidity
            </span>
          </div>

          {/* Precipitation / Rain */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
              {t('weather.precipitation')}
            </span>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              🌧️ {current.precipitation} mm
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
              Rain: {current.rain} mm
            </span>
          </div>

          {/* Wind Speed */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
              {t('weather.windSpeed')}
            </span>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              💨 {current.wind_speed} <span style={{ fontSize: '1.1rem' }}>km/h</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
              10m altitude wind
            </span>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Section */}
      {daily_forecast && daily_forecast.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            📅 7-Day Agricultural Forecast
          </h3>

          <div className="weather-forecast-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '1.25rem'
          }}>
            {daily_forecast.map((day, idx) => (
              <div key={idx} style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1.25rem 1rem',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '0.4rem' }}>
                  {day.date}
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {day.weather_description}
                </div>

                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                  {day.max_temp}° <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {day.min_temp}°C</span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  🌧️ Rain: {day.precipitation_sum} mm
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 550px) {
          .weather-metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .weather-forecast-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 380px) {
          .weather-metrics-grid, .weather-forecast-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
