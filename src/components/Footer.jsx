export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">ELECTROFIK</span>
          <p className="footer-tagline">Strategic fleet electrification decisions, simplified.</p>
        </div>
        <div className="footer-info">
          <p>© {new Date().getFullYear()} ELECTROFIK. All rights reserved.</p>
          <p className="footer-disclaimer">
            Results are estimates based on average values. Actual costs and savings may vary
            depending on local energy prices, vehicle models, and operational conditions.
          </p>
        </div>
      </div>
    </footer>
  );
}
