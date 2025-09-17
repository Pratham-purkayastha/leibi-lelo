function ModeSelection() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#2563eb',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      gap: '50px',
      margin: 0,
      padding: 0
    }}>
      <h1 style={{ fontSize: '60px', margin: 0 }}>🎮 Select Game Mode</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <button style={{
          padding: '25px 60px',
          fontSize: '28px',
          backgroundColor: '#16a34a',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          cursor: 'pointer',
          minWidth: '300px'
        }}>
          🤖 vs Computer
        </button>
        
        <button style={{
          padding: '25px 60px',
          fontSize: '28px',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          cursor: 'pointer',
          minWidth: '300px'
        }}>
          👥 vs Friend
        </button>
      </div>
    </div>
  )
}

export default ModeSelection