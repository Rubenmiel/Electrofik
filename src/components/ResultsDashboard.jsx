import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import {
  formatCurrency, formatCurrencyDecimal, formatNumber,
  VEHICLE_LABELS, FUEL_LABELS,
} from '../utils/calculations';

const COLORS = {
  combustion: '#ef4444',
  electric: '#10b981',
  savings: '#3b82f6',
  co2: '#f59e0b',
};

export default function ResultsDashboard({ results, onSaveForComparison, isSaved }) {
  const r = results;

  const costComparisonData = [
    {
      name: 'Monthly (per vehicle)',
      Combustion: Math.round(r.monthlyCostCombustion),
      Electric: Math.round(r.monthlyCostElectric),
    },
    {
      name: 'Annual (per vehicle)',
      Combustion: Math.round(r.annualCostCombustion),
      Electric: Math.round(r.annualCostElectric),
    },
    {
      name: 'Annual (fleet total)',
      Combustion: Math.round(r.totalFleetAnnualCombustion),
      Electric: Math.round(r.totalFleetAnnualElectric),
    },
  ];

  const co2Data = [
    { name: 'Combustion', value: Math.round(r.annualCO2Combustion * 10) / 10, fill: COLORS.combustion },
    { name: 'Electric', value: Math.round(r.annualCO2Electric * 10) / 10, fill: COLORS.electric },
  ];

  const feasibilityColor = {
    'highly-feasible': '#10b981',
    'feasible': '#f59e0b',
    'challenging': '#ef4444',
  };

  const feasibilityLabel = {
    'highly-feasible': 'Highly Feasible',
    'feasible': 'Feasible with Considerations',
    'challenging': 'Challenging',
  };

  return (
    <div className="dashboard">
      {/* Summary Cards */}
      <div className="summary-header">
        <h3 className="summary-company">{r.companyName}</h3>
        <p className="summary-info">
          {r.fleetSize} {VEHICLE_LABELS[r.vehicleType]}(s) • {FUEL_LABELS[r.fuelType]} • {r.dailyKm} km/day
        </p>
        {!isSaved && r.companyName && (
          <button className="btn btn-secondary btn-sm" onClick={onSaveForComparison}>
            📊 Save for Comparison
          </button>
        )}
        {isSaved && (
          <span className="badge badge-success">✓ Saved for comparison</span>
        )}
      </div>

      {/* Feasibility */}
      <div
        className="card feasibility-card"
        style={{ borderLeftColor: feasibilityColor[r.feasibility.level] }}
      >
        <div className="feasibility-header">
          <h4>Electrification Feasibility</h4>
          <span
            className="feasibility-badge"
            style={{ backgroundColor: feasibilityColor[r.feasibility.level] }}
          >
            {feasibilityLabel[r.feasibility.level]}
          </span>
        </div>
        <div className="feasibility-bar-container">
          <div
            className="feasibility-bar"
            style={{
              width: `${r.feasibility.score}%`,
              backgroundColor: feasibilityColor[r.feasibility.level],
            }}
          />
          <span className="feasibility-score">{r.feasibility.score}/100</span>
        </div>
        {r.feasibility.issues.length > 0 && (
          <ul className="feasibility-issues">
            {r.feasibility.issues.map((issue, i) => (
              <li key={i}>⚠️ {issue}</li>
            ))}
          </ul>
        )}
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-savings">
          <span className="kpi-icon">💰</span>
          <span className="kpi-value">{formatCurrency(r.annualSavings)}</span>
          <span className="kpi-label">Annual Savings</span>
          <span className="kpi-detail">{r.savingsPercentage.toFixed(1)}% reduction</span>
        </div>
        <div className="kpi-card kpi-co2">
          <span className="kpi-icon">🌱</span>
          <span className="kpi-value">{formatNumber(r.co2Reduction, 1)}t</span>
          <span className="kpi-label">CO₂ Saved/Year</span>
          <span className="kpi-detail">{r.co2ReductionPercentage.toFixed(0)}% less emissions</span>
        </div>
        <div className="kpi-card kpi-cost">
          <span className="kpi-icon">📉</span>
          <span className="kpi-value">{formatCurrencyDecimal(r.costPerKmSavings)}</span>
          <span className="kpi-label">Saved per km</span>
          <span className="kpi-detail">vs. {FUEL_LABELS[r.fuelType]}</span>
        </div>
        <div className="kpi-card kpi-trees">
          <span className="kpi-icon">🌳</span>
          <span className="kpi-value">{formatNumber(r.treesEquivalent)}</span>
          <span className="kpi-label">Trees Equivalent</span>
          <span className="kpi-detail">CO₂ absorption/year</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Cost Comparison Chart */}
        <div className="card chart-card">
          <h4 className="card-title">Cost Comparison (€)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costComparisonData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="Combustion" fill={COLORS.combustion} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Electric" fill={COLORS.electric} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CO2 Emissions Pie */}
        <div className="card chart-card">
          <h4 className="card-title">Annual CO₂ Emissions (tonnes)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={co2Data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}t`}
              >
                {co2Data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="tables-grid">
        {/* Cost Breakdown */}
        <div className="card">
          <h4 className="card-title">Cost Breakdown</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>{FUEL_LABELS[r.fuelType]}</th>
                <th>Electric</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cost per km (fuel/energy + maintenance)</td>
                <td>{formatCurrencyDecimal(r.totalCostPerKmCombustion)}</td>
                <td className="highlight-green">{formatCurrencyDecimal(r.totalCostPerKmElectric)}</td>
              </tr>
              <tr>
                <td>Monthly cost per vehicle</td>
                <td>{formatCurrency(r.monthlyCostCombustion)}</td>
                <td className="highlight-green">{formatCurrency(r.monthlyCostElectric)}</td>
              </tr>
              <tr>
                <td>Annual cost per vehicle</td>
                <td>{formatCurrency(r.annualCostCombustion)}</td>
                <td className="highlight-green">{formatCurrency(r.annualCostElectric)}</td>
              </tr>
              <tr>
                <td>Annual insurance per vehicle</td>
                <td>{formatCurrency(r.insuranceCombustion)}</td>
                <td className="highlight-green">{formatCurrency(r.insuranceElectric)}</td>
              </tr>
              <tr className="table-total">
                <td>Total fleet annual cost</td>
                <td>{formatCurrency(r.totalFleetAnnualCombustion)}</td>
                <td className="highlight-green">{formatCurrency(r.totalFleetAnnualElectric)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Energy & Environment */}
        <div className="card">
          <h4 className="card-title">Energy & Environment</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>{FUEL_LABELS[r.fuelType]}</th>
                <th>Electric</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monthly energy (fleet)</td>
                <td>{formatNumber(r.monthlyFuelLiters)} L</td>
                <td>{formatNumber(r.monthlyElectricityKwh)} kWh</td>
              </tr>
              <tr>
                <td>Annual energy (fleet)</td>
                <td>{formatNumber(r.annualFuelLiters)} L</td>
                <td>{formatNumber(r.annualElectricityKwh)} kWh</td>
              </tr>
              <tr>
                <td>Annual CO₂ emissions</td>
                <td>{formatNumber(r.annualCO2Combustion, 1)} tonnes</td>
                <td className="highlight-green">{formatNumber(r.annualCO2Electric, 1)} tonnes</td>
              </tr>
              <tr className="table-total">
                <td>CO₂ reduction</td>
                <td colSpan="2" className="highlight-green">
                  {formatNumber(r.co2Reduction, 1)} tonnes ({r.co2ReductionPercentage.toFixed(0)}%)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Fleet Utilization */}
      <div className="card">
        <h4 className="card-title">Fleet Utilization</h4>
        <div className="utilization-container">
          <div className="utilization-info">
            <div className="utilization-stat">
              <span className="utilization-label">Daily Distance</span>
              <span className="utilization-value">{r.dailyKm} km</span>
            </div>
            <div className="utilization-stat">
              <span className="utilization-label">Max EV Range</span>
              <span className="utilization-value">{r.maxDailyRange} km</span>
            </div>
            <div className="utilization-stat">
              <span className="utilization-label">Utilization Rate</span>
              <span className="utilization-value">{r.utilizationRate.toFixed(1)}%</span>
            </div>
            <div className="utilization-stat">
              <span className="utilization-label">Total Fleet Annual Km</span>
              <span className="utilization-value">{formatNumber(r.totalAnnualKm)} km</span>
            </div>
          </div>
          <div className="utilization-bar-wrapper">
            <div className="utilization-bar-bg">
              <div
                className="utilization-bar-fill"
                style={{
                  width: `${r.utilizationRate}%`,
                  backgroundColor: r.utilizationRate > 85 ? '#f59e0b' : '#10b981',
                }}
              />
            </div>
            <span className="utilization-percentage">{r.utilizationRate.toFixed(1)}% of EV range used daily</span>
          </div>
        </div>
      </div>
    </div>
  );
}
