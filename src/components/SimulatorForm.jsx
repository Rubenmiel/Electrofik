import { useState } from 'react';
import { VEHICLE_LABELS, FUEL_LABELS } from '../utils/calculations';

const initialFormState = {
  companyName: '',
  fleetSize: 10,
  vehicleType: 'car',
  fuelType: 'diesel',
  dailyKm: 100,
  workingDaysPerMonth: 22,
  fuelPrice: '',
  electricityPrice: '',
};

export default function SimulatorForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.fleetSize || formData.fleetSize < 1) newErrors.fleetSize = 'Fleet size must be at least 1';
    if (!formData.dailyKm || formData.dailyKm < 1) newErrors.dailyKm = 'Daily km must be at least 1';
    if (formData.workingDaysPerMonth < 1 || formData.workingDaysPerMonth > 31) {
      newErrors.workingDaysPerMonth = 'Working days must be between 1 and 31';
    }
    if (formData.fuelPrice && formData.fuelPrice < 0) newErrors.fuelPrice = 'Price cannot be negative';
    if (formData.electricityPrice && formData.electricityPrice < 0) newErrors.electricityPrice = 'Price cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  return (
    <form className="simulator-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        {/* Company Info */}
        <div className="form-group form-group-wide">
          <label htmlFor="companyName" className="form-label">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            className={`form-input ${errors.companyName ? 'form-input-error' : ''}`}
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter your company name"
          />
          {errors.companyName && <span className="form-error">{errors.companyName}</span>}
        </div>

        {/* Fleet Size */}
        <div className="form-group">
          <label htmlFor="fleetSize" className="form-label">Fleet Size (vehicles)</label>
          <input
            type="number"
            id="fleetSize"
            name="fleetSize"
            className={`form-input ${errors.fleetSize ? 'form-input-error' : ''}`}
            value={formData.fleetSize}
            onChange={handleNumberChange}
            min="1"
            max="10000"
          />
          {errors.fleetSize && <span className="form-error">{errors.fleetSize}</span>}
        </div>

        {/* Vehicle Type */}
        <div className="form-group">
          <label htmlFor="vehicleType" className="form-label">Vehicle Type</label>
          <select
            id="vehicleType"
            name="vehicleType"
            className="form-input"
            value={formData.vehicleType}
            onChange={handleChange}
          >
            {Object.entries(VEHICLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Fuel Type */}
        <div className="form-group">
          <label htmlFor="fuelType" className="form-label">Current Fuel Type</label>
          <select
            id="fuelType"
            name="fuelType"
            className="form-input"
            value={formData.fuelType}
            onChange={handleChange}
          >
            {Object.entries(FUEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Daily Km */}
        <div className="form-group">
          <label htmlFor="dailyKm" className="form-label">Daily Distance per Vehicle (km)</label>
          <input
            type="number"
            id="dailyKm"
            name="dailyKm"
            className={`form-input ${errors.dailyKm ? 'form-input-error' : ''}`}
            value={formData.dailyKm}
            onChange={handleNumberChange}
            min="1"
            max="1000"
          />
          {errors.dailyKm && <span className="form-error">{errors.dailyKm}</span>}
        </div>

        {/* Working Days */}
        <div className="form-group">
          <label htmlFor="workingDaysPerMonth" className="form-label">Working Days per Month</label>
          <input
            type="number"
            id="workingDaysPerMonth"
            name="workingDaysPerMonth"
            className={`form-input ${errors.workingDaysPerMonth ? 'form-input-error' : ''}`}
            value={formData.workingDaysPerMonth}
            onChange={handleNumberChange}
            min="1"
            max="31"
          />
          {errors.workingDaysPerMonth && <span className="form-error">{errors.workingDaysPerMonth}</span>}
        </div>

        {/* Fuel Price */}
        <div className="form-group">
          <label htmlFor="fuelPrice" className="form-label">
            Fuel Price (€/L) <span className="form-hint">Optional</span>
          </label>
          <input
            type="number"
            id="fuelPrice"
            name="fuelPrice"
            className={`form-input ${errors.fuelPrice ? 'form-input-error' : ''}`}
            value={formData.fuelPrice}
            onChange={handleNumberChange}
            step="0.01"
            min="0"
            placeholder="Default: 1.55 (diesel) / 1.65 (gasoline)"
          />
          {errors.fuelPrice && <span className="form-error">{errors.fuelPrice}</span>}
        </div>

        {/* Electricity Price */}
        <div className="form-group">
          <label htmlFor="electricityPrice" className="form-label">
            Electricity Price (€/kWh) <span className="form-hint">Optional</span>
          </label>
          <input
            type="number"
            id="electricityPrice"
            name="electricityPrice"
            className={`form-input ${errors.electricityPrice ? 'form-input-error' : ''}`}
            value={formData.electricityPrice}
            onChange={handleNumberChange}
            step="0.01"
            min="0"
            placeholder="Default: 0.22"
          />
          {errors.electricityPrice && <span className="form-error">{errors.electricityPrice}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
        <button type="submit" className="btn btn-primary">
          ⚡ Calculate Results
        </button>
      </div>
    </form>
  );
}
