import { useState, useCallback } from 'react'
import LoadingExperience from './components/LoadingExperience'
import CompletionScreen from './components/CompletionScreen'

export default function App() {
  const [phase, setPhase] = useState('loading') // 'loading' | 'complete'
  const [stats, setStats] = useState({ hits: 0, bestCombo: 0, easterEgg: false })

  const handleComplete = useCallback((finalStats) => {
    setStats(finalStats)
    setPhase('complete')
  }, [])

  const handleRestart = useCallback(() => {
    setPhase('loading')
    setStats({ hits: 0, bestCombo: 0, easterEgg: false })
  }, [])

  return (
    <>
      {phase === 'loading' && <LoadingExperience onComplete={handleComplete} />}
      {phase === 'complete' && <CompletionScreen stats={stats} onRestart={handleRestart} />}
    </>
  )
}
