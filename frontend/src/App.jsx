import React from 'react'

function App() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#0f172a',
            color: '#fff',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <h1 style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                AI README Generator
            </h1>
            <p style={{
                fontSize: '1.25rem',
                color: '#94a3b8',
                marginBottom: '2rem'
            }}>
                Welcome to your MERN Stack Application
            </p>
            <div style={{
                display: 'flex',
                gap: '1rem'
            }}>
                <div style={{
                    padding: '1rem 1.5rem',
                    backgroundColor: '#1e293b',
                    borderRadius: '0.5rem',
                    border: '1px solid #334155'
                }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Frontend</p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>React + Vite</p>
                </div>
                <div style={{
                    padding: '1rem 1.5rem',
                    backgroundColor: '#1e293b',
                    borderRadius: '0.5rem',
                    border: '1px solid #334155'
                }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Backend</p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>Express + MongoDB</p>
                </div>
            </div>
            <p style={{
                marginTop: '2rem',
                color: '#64748b',
                fontSize: '0.875rem'
            }}>
                ✅ Setup Complete - Ready to build!
            </p>
        </div>
    )
}

export default App
