import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SimulatorForm from './components/SimulatorForm';
import ResultsDashboard from './components/ResultsDashboard';
import CompanyComparison from './components/CompanyComparison';
import Footer from './components/Footer';
import { calculateFleetMetrics } from './utils/calculations';
import './App.css';

function App() {
  const [results, setResults] = useState(null);
  const [savedResults, setSavedResults] = useState([]);
  const [activeSection, setActiveSection] = useState('home');

  const handleSimulate = (formData) => {
    const metrics = calculateFleetMetrics(formData);
    setResults(metrics);
    setActiveSection('results');
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSaveForComparison = () => {
    if (results && results.companyName) {
      const exists = savedResults.some(r => r.companyName === results.companyName);
      if (!exists) {
        setSavedResults(prev => [...prev, results]);
      }
    }
  };

  const handleRemoveCompany = (companyName) => {
    setSavedResults(prev => prev.filter(r => r.companyName !== companyName));
  };

  const scrollToSimulator = () => {
    setActiveSection('simulator');
    setTimeout(() => {
      document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="app">
      <Header
        activeSection={activeSection}
        onNavigate={setActiveSection}
        scrollToSimulator={scrollToSimulator}
      />
      <main>
        <Hero onStart={scrollToSimulator} />

        <section id="simulator" className="section">
          <div className="container">
            <h2 className="section-title">Fleet Electrification Simulator</h2>
            <p className="section-subtitle">
              Enter your fleet data to get a personalized analysis of the transition to electric vehicles
            </p>
            <SimulatorForm onSubmit={handleSimulate} />
          </div>
        </section>

        {results && (
          <section id="results" className="section section-alt">
            <div className="container">
              <h2 className="section-title">Your Results</h2>
              <ResultsDashboard
                results={results}
                onSaveForComparison={handleSaveForComparison}
                isSaved={savedResults.some(r => r.companyName === results.companyName)}
              />
            </div>
          </section>
        )}

        {savedResults.length >= 2 && (
          <section id="comparison" className="section">
            <div className="container">
              <h2 className="section-title">Company Comparison</h2>
              <p className="section-subtitle">
                Compare your results with other companies to understand your competitive positioning
              </p>
              <CompanyComparison
                companies={savedResults}
                onRemove={handleRemoveCompany}
              />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
