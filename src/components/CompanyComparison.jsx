import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer,
} from 'recharts';
import {
  formatCurrency, formatNumber, VEHICLE_LABELS,
} from '../utils/calculations';

const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

export default function CompanyComparison({ companies, onRemove }) {
  // Prepare cost comparison data
  const costData = companies.map((c, i) => ({
    name: c.companyName,
    'Combustion Annual': Math.round(c.totalFleetAnnualCombustion),
    'Electric Annual': Math.round(c.totalFleetAnnualElectric),
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  // Prepare savings comparison
  const savingsData = companies.map((c, i) => ({
    name: c.companyName,
    'Annual Savings': Math.round(c.annualSavings),
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  // Normalize data for radar chart (0-100 scale)
  const maxSavings = Math.max(...companies.map(c => c.annualSavings));
  const maxCO2 = Math.max(...companies.map(c => c.co2Reduction));
  const maxUtil = Math.max(...companies.map(c => c.utilizationRate));
  const maxSavPct = Math.max(...companies.map(c => c.savingsPercentage));
  const maxFeas = Math.max(...companies.map(c => c.feasibility.score));

  const radarData = [
    {
      metric: 'Cost Savings',
      ...Object.fromEntries(companies.map(c => [
        c.companyName,
        maxSavings > 0 ? Math.round((c.annualSavings / maxSavings) * 100) : 0,
      ])),
    },
    {
      metric: 'CO₂ Reduction',
      ...Object.fromEntries(companies.map(c => [
        c.companyName,
        maxCO2 > 0 ? Math.round((c.co2Reduction / maxCO2) * 100) : 0,
      ])),
    },
    {
      metric: 'Utilization',
      ...Object.fromEntries(companies.map(c => [
        c.companyName,
        maxUtil > 0 ? Math.round((c.utilizationRate / maxUtil) * 100) : 0,
      ])),
    },
    {
      metric: 'Savings %',
      ...Object.fromEntries(companies.map(c => [
        c.companyName,
        maxSavPct > 0 ? Math.round((c.savingsPercentage / maxSavPct) * 100) : 0,
      ])),
    },
    {
      metric: 'Feasibility',
      ...Object.fromEntries(companies.map(c => [
        c.companyName,
        maxFeas > 0 ? Math.round((c.feasibility.score / maxFeas) * 100) : 0,
      ])),
    },
  ];

  return (
    <div className="comparison">
      {/* Company Tags */}
      <div className="comparison-tags">
        {companies.map((c, i) => (
          <div
            key={c.companyName}
            className="comparison-tag"
            style={{ borderColor: CHART_COLORS[i % CHART_COLORS.length] }}
          >
            <span
              className="comparison-dot"
              style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span>{c.companyName}</span>
            <span className="comparison-tag-info">
              {c.fleetSize} {VEHICLE_LABELS[c.vehicleType]}(s)
            </span>
            <button
              className="comparison-remove"
              onClick={() => onRemove(c.companyName)}
              title="Remove from comparison"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Annual Cost Comparison */}
        <div className="card chart-card">
          <h4 className="card-title">Annual Fleet Cost (€)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="Combustion Annual" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Electric Annual" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Comparison */}
        <div className="card chart-card">
          <h4 className="card-title">Multi-Factor Comparison</h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              {companies.map((c, i) => (
                <Radar
                  key={c.companyName}
                  name={c.companyName}
                  dataKey={c.companyName}
                  stroke={CHART_COLORS[i % CHART_COLORS.length]}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                  fillOpacity={0.15}
                />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Savings Comparison */}
      <div className="card chart-card">
        <h4 className="card-title">Annual Savings by Company (€)</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={savingsData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Bar dataKey="Annual Savings" radius={[4, 4, 0, 0]}>
              {savingsData.map((entry, i) => (
                <rect key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison Table */}
      <div className="card">
        <h4 className="card-title">Detailed Comparison</h4>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Metric</th>
                {companies.map(c => (
                  <th key={c.companyName}>{c.companyName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fleet Size</td>
                {companies.map(c => <td key={c.companyName}>{c.fleetSize} {VEHICLE_LABELS[c.vehicleType]}(s)</td>)}
              </tr>
              <tr>
                <td>Daily Distance</td>
                {companies.map(c => <td key={c.companyName}>{c.dailyKm} km</td>)}
              </tr>
              <tr>
                <td>Annual Fleet Cost (Combustion)</td>
                {companies.map(c => <td key={c.companyName}>{formatCurrency(c.totalFleetAnnualCombustion)}</td>)}
              </tr>
              <tr>
                <td>Annual Fleet Cost (Electric)</td>
                {companies.map(c => <td key={c.companyName} className="highlight-green">{formatCurrency(c.totalFleetAnnualElectric)}</td>)}
              </tr>
              <tr>
                <td>Annual Savings</td>
                {companies.map(c => <td key={c.companyName} className="highlight-green">{formatCurrency(c.annualSavings)}</td>)}
              </tr>
              <tr>
                <td>Savings %</td>
                {companies.map(c => <td key={c.companyName}>{c.savingsPercentage.toFixed(1)}%</td>)}
              </tr>
              <tr>
                <td>CO₂ Reduction</td>
                {companies.map(c => <td key={c.companyName}>{formatNumber(c.co2Reduction, 1)} tonnes</td>)}
              </tr>
              <tr>
                <td>Utilization Rate</td>
                {companies.map(c => <td key={c.companyName}>{c.utilizationRate.toFixed(1)}%</td>)}
              </tr>
              <tr>
                <td>Feasibility</td>
                {companies.map(c => (
                  <td key={c.companyName}>
                    <span className={`badge badge-${c.feasibility.level}`}>
                      {c.feasibility.score}/100
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
