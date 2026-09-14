import React, { useState, useEffect } from 'react'
import { getWeatherForecast } from '../../api/weatherApi'
import { WeatherCard } from '../../components/WeatherCard'

export const WeatherPage = () => {
  // Coordinates state (Default: Kolkata 22.5726, 88.3639)
  const [lat, setLat] = useState('22.5726')
  const [lon, setLon] = useState('88.3639')
  const [selectedCity, setSelectedCity] = useState('Kolkata')

  // UI & Data States
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Quick Preset Locations
  const presets = [
    { name: 'Kolkata', lat: '22.5726', lon: '88.3639' },
    { name: 'New Delhi', lat: '28.6139', lon: '77.2090' },
    { name: 'Mumbai', lat: '19.0760', lon: '72.8777' },
    { name: 'Bengaluru', lat: '12.9716', lon: '77.5946' },
    { name: 'Chennai', lat: '13.0827', lon: '80.2707' }
  ]

  const fetchWeather = async (targetLat, targetLon) => {
    setLoading(true)
    setError('')
    try {
      const response = await getWeatherForecast(targetLat, targetLon)
      if (response && response.success) {
        setWeatherData(response.data)
      } else {
        setError('Failed to fetch weather forecast data.')
      }
    } catch (err) {
      console.error('Fetch Weather Error:', err)
      const serverMsg = err.response?.data?.message || err.message || 'Unable to connect to FarmOS backend.'
      setError(`Unable to retrieve weather data: ${serverMsg}`)
    } finally {
      setLoading(false)
    }
  }

  // Load default weather on mount
  useEffect(() => {
    fetchWeather(lat, lon)
  }, [])

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setSelectedCity('Custom Location')
    fetchWeather(lat, lon)
  }

  // Apply Quick Preset
  const handlePresetSelect = (preset) => {
    setLat(preset.lat)
    setLon(preset.lon)
    setSelectedCity(preset.name)
    fetchWeather(preset.lat, preset.lon)
  }

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
      color: 'var(--text-primary)'
    }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-gold-light) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🌤️ FarmOS Weather Intelligence
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Real-time hyper-local agricultural weather forecasts powered by Open-Meteo & FarmOS Backend.
        </p>
      </div>

      {/* Location Input & Preset Bar */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '2.5rem',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Quick Presets Buttons */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.6rem' }}>
            📍 Quick Region Presets:
          </span>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {presets.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handlePresetSelect(p)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '30px',
                  backgroundColor: selectedCity === p.name ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.06)',
                  color: selectedCity === p.name ? '#080a0e' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  border: '1px solid ' + (selectedCity === p.name ? 'var(--accent-gold)' : 'var(--border-color)'),
                  transition: 'all 0.2s'
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Coordinates Form */}
        <form onSubmit={handleSubmit} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Latitude * (-90 to 90)
            </label>
            <input
              type="number"
              step="any"
              min="-90"
              max="90"
              className="form-control"
              placeholder="e.g. 22.5726"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Longitude * (-180 to 180)
            </label>
            <input
              type="number"
              step="any"
              min="-180"
              max="180"
              className="form-control"
              placeholder="e.g. 88.3639"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '0.68rem 1.25rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-muted))',
              color: '#080a0e',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px var(--accent-gold-glow)'
            }}
          >
            🔍 Fetch Weather Forecast
          </button>
        </form>
      </div>

      {/* Error Alert State */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          color: '#f87171',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>Weather Request Failed</strong>
            <span style={{ fontSize: '0.88rem' }}>{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '18px',
          border: '1px solid var(--border-color)',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 1s infinite linear' }}>⏳</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
            Fetching Live Weather Intelligence...
          </h3>
          <p style={{ fontSize: '0.88rem' }}>
            Querying Open-Meteo forecast metrics via FarmOS Backend for coordinates ({lat}, {lon}).
          </p>
        </div>
      ) : !weatherData ? (
        /* Empty State */
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '18px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌤️</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No Weather Data Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Please select a region preset or enter valid latitude and longitude coordinates above.
          </p>
        </div>
      ) : (
        /* Render Weather Card */
        <WeatherCard weatherData={weatherData} />
      )}
    </div>
  )
}
