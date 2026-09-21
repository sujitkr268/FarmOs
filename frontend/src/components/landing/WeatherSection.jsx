import React, { useState, useEffect } from 'react'
import { getWeatherForecast } from '../../api/weatherApi'
import { useLanguage } from '../../context/LanguageContext'

export const WeatherSection = () => {
  const { t } = useLanguage()
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await getWeatherForecast('22.5726', '88.3639') // Kolkata default
        if (res && res.success && res.data) {
          setWeatherData(res.data)
        }
      } catch (err) {
        console.error('Landing weather fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [])

  const current = weatherData?.current || {
    temperature: '28°C',
    weather_condition: 'Partly Cloudy',
    humidity: '72%',
    wind_speed: '12 km/h',
    rain_probability: '10%'
  }

  return (
    <section style={{
      backgroundColor: '#ffffff',
      padding: 'clamp(3.5rem, 8vw, 6rem) clamp(1rem, 4vw, 1.5rem)',
      color: '#0f172a'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
          <span style={{
            color: '#10b981',
            fontSize: '0.85rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            {t('landing.weatherBadge', 'Localized Forecasts')}
          </span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 800,
            color: '#022c22',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            {t('landing.weatherTitle', 'Weather Intelligence')}
          </h2>
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', color: '#475569', maxWidth: '650px', margin: '0.75rem auto 0' }}>
            {t('landing.weatherSub', 'Plan crop harvest and logistics around hyper-local temperature, humidity, and rainfall predictions.')}
          </p>
        </div>

        {/* Weather Card Display */}
        <div style={{
          backgroundColor: '#064e3b',
          color: '#ffffff',
          borderRadius: '24px',
          padding: 'clamp(1.25rem, 4vw, 2.5rem)',
          maxWidth: '900px',
          margin: '0 auto',
          boxShadow: '0 12px 40px rgba(6, 78, 59, 0.25)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>📍</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>
                {t('landing.weatherHub', 'West Bengal Hub (Kolkata Region)')}
              </span>
            </div>
            <h3 style={{ fontSize: 'clamp(2.2rem, 6vw, 3rem)', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              {current.temperature || '28°C'}
            </h3>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#cbd5e1' }}>
              🌤️ {current.weather_condition || 'Partly Cloudy'}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            backgroundColor: 'rgba(2, 44, 34, 0.6)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '1.25rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>
                {t('landing.lblHumidity', 'Humidity')}
              </span>
              <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>{current.humidity || '72%'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>
                {t('landing.lblWindSpeed', 'Wind Speed')}
              </span>
              <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>{current.wind_speed || '12 km/h'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>
                {t('landing.lblRainRisk', 'Rain Risk')}
              </span>
              <strong style={{ fontSize: '1.1rem', color: '#34d399' }}>{current.rain_probability || '10%'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>
                {t('landing.lblForecast7Day', '7-Day Forecast')}
              </span>
              <strong style={{ fontSize: '1.1rem', color: '#10b981' }}>
                {t('landing.valFavorable', 'Favorable')}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
