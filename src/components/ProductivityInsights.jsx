import React from 'react';
import './ProductivityInsights.css';

function ProductivityInsights({ stats }) {
  const getBestTimeOfDay = () => {
    const timeSlots = stats.completedSessions.reduce((acc, session) => {
      const hour = new Date(session.completedAt).getHours();
      const timeSlot = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
      acc[timeSlot] = (acc[timeSlot] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(timeSlots).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Not enough data';
  };

  const getOptimalDuration = () => {
    const durations = stats.completedSessions.reduce((acc, session) => {
      acc[session.duration] = (acc[session.duration] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(durations).sort((a, b) => b[1] - a[1])[0]?.[0] || '25';
  };

  const getSuccessRate = () => {
    if (!stats.totalSessions) return 0;
    return Math.round((stats.completedSessions.length / stats.totalSessions) * 100);
  };

  const getRecommendations = () => {
    const recommendations = [];
    const successRate = getSuccessRate();

    if (successRate < 70) {
      recommendations.push("Try shorter sessions to build momentum");
    }
    if (successRate > 90) {
      recommendations.push("Consider increasing session duration for more challenge");
    }
    if (stats.consecutiveDays > 0) {
      recommendations.push(`Great ${stats.consecutiveDays}-day streak! Keep it up!`);
    }
    
    return recommendations;
  };

  return (
    <div className="insights-container">
      <h2>🤖 AI Productivity Insights</h2>
      
      <div className="insights-grid">
        <div className="insight-card">
          <h3>Best Time to Focus</h3>
          <div className="insight-value">{getBestTimeOfDay()}</div>
          <p>Based on your successful sessions</p>
        </div>

        <div className="insight-card">
          <h3>Optimal Session Length</h3>
          <div className="insight-value">{getOptimalDuration()} min</div>
          <p>Your most productive duration</p>
        </div>

        <div className="insight-card">
          <h3>Success Rate</h3>
          <div className="insight-value">{getSuccessRate()}%</div>
          <p>Completed vs. started sessions</p>
        </div>
      </div>

      <div className="recommendations-section">
        <h3>📊 Personalized Recommendations</h3>
        <div className="recommendations-list">
          {getRecommendations().map((rec, index) => (
            <div key={index} className="recommendation-item">
              {rec}
            </div>
          ))}
        </div>
      </div>

      <div className="productivity-chart">
        <h3>Weekly Progress</h3>
        {/* Add a chart visualization here if desired */}
      </div>
    </div>
  );
}

export default ProductivityInsights; 