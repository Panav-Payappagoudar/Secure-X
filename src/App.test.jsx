import React from 'react'

const AppTest = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#0f172a',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ color: '#00ff88', marginBottom: '20px' }}>SecureX Test</h1>
      <p style={{ marginBottom: '30px', lineHeight: '1.6' }}>
        If you can see this, the React app is working!
      </p>
    </div>
  )
}

export default AppTest