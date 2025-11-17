import { useState } from 'react'
import './App.css'
import PollingTracker from './components/PollingTracker'
import Tracker from './components/Tracker'

function App() {
  const [polling, setPolling] = useState(true)

  return (
    <>
      {
        polling ? <PollingTracker /> : <Tracker />
      }
      <button onClick={() => setPolling(p => !p)}>
        Switch to {polling ? "Live Watch" : "Polling"}
      </button>
    </>
  )
}

export default App
