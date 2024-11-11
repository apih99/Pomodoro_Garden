import React from 'react';
import './Garden.css';

function Garden({ garden }) {
  return (
    <div className="garden-page">
      <h1>My Productivity Garden</h1>
      
      <div className="garden-stats">
        <div className="stat-card">
          <h3>Garden Level</h3>
          <p className="stat-value">{garden.level}</p>
          <p className="stat-subtitle">Next level in {5 - (garden.totalGrowth % 5)} plants</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Plants</h3>
          <p className="stat-value">{garden.plants.length}</p>
          <p className="stat-subtitle">Plants grown</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Minutes</h3>
          <p className="stat-value">
            {garden.plants.reduce((total, plant) => total + plant.duration, 0)}
          </p>
          <p className="stat-subtitle">Minutes focused</p>
        </div>
      </div>

      <div className="garden-container">
        <h2>Your Garden</h2>
        <div className="garden-grid">
          {garden.plants.map(plant => (
            <div 
              key={plant.id} 
              className="plant-container"
              title={`${plant.duration} min session on ${new Date(plant.completedAt).toLocaleDateString()}`}
            >
              <span className="plant">{plant.type}</span>
              <div className="plant-info">
                <p>{plant.duration} min</p>
                <p>{new Date(plant.completedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="achievements-section">
        <h2>Achievements</h2>
        <div className="achievements-grid">
          <div className={`achievement ${garden.plants.length >= 5 ? 'unlocked' : ''}`}>
            <span>🌱</span>
            <p>Novice Gardener</p>
            <small>Grow 5 plants</small>
          </div>
          <div className={`achievement ${garden.plants.length >= 10 ? 'unlocked' : ''}`}>
            <span>🌿</span>
            <p>Growing Expert</p>
            <small>Grow 10 plants</small>
          </div>
          <div className={`achievement ${garden.plants.length >= 20 ? 'unlocked' : ''}`}>
            <span>🌳</span>
            <p>Master Gardener</p>
            <small>Grow 20 plants</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Garden; 