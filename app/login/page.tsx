'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('https://learn.reboot01.com/api/auth/signin', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('jwt', data)
        console.log(data)
        router.push('/profile')
      } else {
        setError('Invalid credentials')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }
  }
  
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Username or Email
          </label>
          <input
            className="form-input"
            id="username"
            type="text"
            placeholder="Username or Email"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            className="form-input"
            id="password"
            type="password"
            placeholder="******************"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
        </div>
        <div className="form-actions">
          <button className="submit-button" type="submit">
            Sign In
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  )
}

