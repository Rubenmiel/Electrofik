export default function Hero({ onStart }) {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-content">
          <h1 className="hero-title">
            Is Your Fleet Ready to
            <span className="hero-highlight"> Go Electric?</span>
          </h1>
          <p className="hero-description">
            ELECTROFIK helps companies make strategic decisions about fleet electrification.
            Transform complex data into clear insights—assess feasibility, calculate savings,
            and measure environmental impact in minutes.
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <span className="hero-feature-icon">💰</span>
              <span>Cost Analysis</span>
            </div>
            <div className="hero-feature">
              <span className="hero-feature-icon">⚡</span>
              <span>Energy Consumption</span>
            </div>
            <div className="hero-feature">
              <span className="hero-feature-icon">🌱</span>
              <span>Environmental Impact</span>
            </div>
            <div className="hero-feature">
              <span className="hero-feature-icon">📊</span>
              <span>Company Comparison</span>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={onStart}>
            Start Simulation →
          </button>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-stat">
              <span className="hero-stat-value">35%</span>
              <span className="hero-stat-label">Average Cost Savings</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">72%</span>
              <span className="hero-stat-label">CO₂ Reduction</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">50%</span>
              <span className="hero-stat-label">Lower Maintenance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
