import React, { useState, useEffect } from 'react';
import Garden from './components/Garden';
import ProductivityInsights from './components/ProductivityInsights';
import './App.css';

function App() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [highScore, setHighScore] = useState(0);
  const [customDuration, setCustomDuration] = useState('');
  const [garden, setGarden] = useState({
    plants: [],
    level: 1,
    totalGrowth: 0
  });
  const [currentPage, setCurrentPage] = useState('timer');
  const [productivityStats, setProductivityStats] = useState({
    completedSessions: [],
    totalSessions: 0,
    consecutiveDays: 0,
    lastSessionDate: null
  });

  const durations = [5, 20, 25, 30, 60];

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            setCompletedPomodoros(prev => prev + 1);
            setShowReward(true);
            setMinutes(selectedDuration);
            setSeconds(0);
            if (selectedDuration > highScore) {
              setHighScore(selectedDuration);
            }
            setGarden(prev => ({
              plants: [...prev.plants, {
                id: Date.now(),
                type: getRandomPlant(),
                completedAt: new Date(),
                duration: selectedDuration
              }],
              totalGrowth: prev.totalGrowth + 1,
              level: Math.floor((prev.totalGrowth + 1) / 5) + 1
            }));
            handleSessionComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, selectedDuration, highScore]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(selectedDuration);
    setSeconds(0);
  };

  const handleDurationChange = (duration) => {
    if (!isActive) {
      setSelectedDuration(duration);
      setMinutes(duration);
      setSeconds(0);
    }
  };

  const handleCustomDuration = () => {
    const duration = parseInt(customDuration, 10);
    if (!isNaN(duration) && duration > 0) {
      handleDurationChange(duration);
      setCustomDuration('');
    }
  };

  const getRandomPlant = () => {
    const plants = ['🌱', '🌿', '🌸', '🌺', '🌻', '🌹', '🌷', '🍀'];
    return plants[Math.floor(Math.random() * plants.length)];
  };

  const handleSessionComplete = () => {
    const newSession = {
      duration: selectedDuration,
      completedAt: new Date(),
      successful: true
    };

    setProductivityStats(prev => {
      const today = new Date().toDateString();
      const lastSession = prev.lastSessionDate ? new Date(prev.lastSessionDate).toDateString() : null;
      const isConsecutive = lastSession === new Date(Date.now() - 86400000).toDateString();

      return {
        completedSessions: [...prev.completedSessions, newSession],
        totalSessions: prev.totalSessions + 1,
        consecutiveDays: isConsecutive ? prev.consecutiveDays + 1 : 1,
        lastSessionDate: new Date()
      };
    });
  };

  return (
    <div className="app">
      {currentPage === 'timer' ? (
        <div>
          <h1>Pomodoro Timer</h1>
          
          <div className="duration-selector">
            <div className="duration-buttons-container">
              {durations.map(duration => (
                <button
                  key={duration}
                  onClick={() => handleDurationChange(duration)}
                  className={`duration-btn ${selectedDuration === duration ? 'active' : ''}`}
                  disabled={isActive}
                >
                  {duration} min
                </button>
              ))}
            </div>
            <div className="custom-duration-container">
              <input
                type="number"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                placeholder="Custom min"
                disabled={isActive}
              />
              <button 
                onClick={handleCustomDuration} 
                disabled={isActive || !customDuration}
              >
                Set
              </button>
            </div>
          </div>

          <div className="timer">
            <span>{String(minutes).padStart(2, '0')}:</span>
            <span>{String(seconds).padStart(2, '0')}</span>
          </div>

          <div className="controls">
            <button onClick={toggleTimer}>
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button onClick={resetTimer}>Reset</button>
          </div>

          <div className="stats">
            <p>Completed Pomodoros: {completedPomodoros}</p>
            <p>High Score: {highScore} min</p>
          </div>

          {showReward && (
            <div className="reward">
              <h2>🎉 Congratulations! 🎉</h2>
              <p>You've completed a {selectedDuration}-minute Pomodoro session!</p>
              <button onClick={() => setShowReward(false)}>Close</button>
            </div>
          )}
        </div>
      ) : currentPage === 'garden' ? (
        <Garden garden={garden} />
      ) : (
        <ProductivityInsights stats={productivityStats} />
      )}

      <nav className="bottom-navigation">
        <button 
          className={`nav-btn ${currentPage === 'garden' ? 'active' : ''}`}
          onClick={() => setCurrentPage('garden')}
        >
          🌱 Garden
        </button>
        <button 
          className={`nav-btn ${currentPage === 'timer' ? 'active' : ''}`}
          onClick={() => setCurrentPage('timer')}
        >
          🏠 Timer
        </button>
        <button 
          className={`nav-btn ${currentPage === 'insights' ? 'active' : ''}`}
          onClick={() => setCurrentPage('insights')}
        >
          📊 Insights
        </button>
      </nav>
    </div>
  );
}

export default App;