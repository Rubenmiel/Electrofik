export default function Header({ activeSection, onNavigate, scrollToSimulator }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="logo" onClick={() => onNavigate('home')}>
          <span className="logo-icon">⚡</span>
          <span className="logo-text">ELECTROFIK</span>
        </div>
        <nav className="nav">
          <a
            href="#simulator"
            className={`nav-link ${activeSection === 'simulator' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSimulator(); }}
          >
            Simulator
          </a>
          <a
            href="#results"
            className={`nav-link ${activeSection === 'results' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Results
          </a>
          <a
            href="#comparison"
            className={`nav-link ${activeSection === 'comparison' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Compare
          </a>
        </nav>
      </div>
    </header>
  );
}
