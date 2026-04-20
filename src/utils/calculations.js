/**
 * ELECTROFIK Calculation Engine
 * Computes costs, savings, energy consumption, fleet utilization, and environmental impact
 * for comparing combustion-engine vs electric vehicle fleets.
 */

// Constants
const AVERAGE_CO2_PER_LITER_DIESEL = 2.68; // kg CO2 per liter of diesel
const AVERAGE_CO2_PER_LITER_GASOLINE = 2.31; // kg CO2 per liter of gasoline
const AVERAGE_CO2_PER_KWH_GRID = 0.233; // kg CO2 per kWh (EU average grid mix)
const TREES_CO2_ABSORPTION_PER_YEAR = 22; // kg CO2 absorbed per tree per year
const WORKING_DAYS_PER_MONTH = 22;
const MONTHS_PER_YEAR = 12;

// Default fuel/energy prices (€)
const DEFAULT_DIESEL_PRICE = 1.55; // €/liter
const DEFAULT_GASOLINE_PRICE = 1.65; // €/liter
const DEFAULT_ELECTRICITY_PRICE = 0.22; // €/kWh

// Average consumption rates
const CONSUMPTION_RATES = {
  car: { diesel: 6.5, gasoline: 7.5, electric: 16 }, // L/100km or kWh/100km
  van: { diesel: 9.0, gasoline: 10.5, electric: 24 },
  truck: { diesel: 28, gasoline: 32, electric: 80 },
  bus: { diesel: 35, gasoline: 40, electric: 120 },
};

// Maintenance cost per km (€)
const MAINTENANCE_COST_PER_KM = {
  car: { combustion: 0.06, electric: 0.03 },
  van: { combustion: 0.08, electric: 0.04 },
  truck: { combustion: 0.12, electric: 0.06 },
  bus: { combustion: 0.15, electric: 0.08 },
};

// Insurance annual cost per vehicle (€)
const INSURANCE_ANNUAL = {
  car: { combustion: 800, electric: 700 },
  van: { combustion: 1200, electric: 1000 },
  truck: { combustion: 2500, electric: 2200 },
  bus: { combustion: 3000, electric: 2700 },
};

/**
 * Calculate all fleet metrics based on input parameters
 */
export function calculateFleetMetrics(input) {
  const {
    fleetSize,
    vehicleType,
    fuelType = 'diesel',
    dailyKm,
    workingDaysPerMonth = WORKING_DAYS_PER_MONTH,
    fuelPrice,
    electricityPrice,
    companyName = '',
  } = input;

  const actualFuelPrice = fuelPrice || (fuelType === 'diesel' ? DEFAULT_DIESEL_PRICE : DEFAULT_GASOLINE_PRICE);
  const actualElectricityPrice = electricityPrice || DEFAULT_ELECTRICITY_PRICE;

  const monthlyKm = dailyKm * workingDaysPerMonth;
  const annualKm = monthlyKm * MONTHS_PER_YEAR;
  const totalMonthlyKm = monthlyKm * fleetSize;
  const totalAnnualKm = annualKm * fleetSize;

  // Fuel consumption
  const fuelConsumptionPer100km = CONSUMPTION_RATES[vehicleType]?.[fuelType] || 7;
  const electricConsumptionPer100km = CONSUMPTION_RATES[vehicleType]?.electric || 16;

  // Fuel/energy cost per km
  const fuelCostPerKm = (fuelConsumptionPer100km / 100) * actualFuelPrice;
  const electricCostPerKm = (electricConsumptionPer100km / 100) * actualElectricityPrice;

  // Maintenance cost per km
  const maintenanceCombustion = MAINTENANCE_COST_PER_KM[vehicleType]?.combustion || 0.06;
  const maintenanceElectric = MAINTENANCE_COST_PER_KM[vehicleType]?.electric || 0.03;

  // Total cost per km (fuel/energy + maintenance)
  const totalCostPerKmCombustion = fuelCostPerKm + maintenanceCombustion;
  const totalCostPerKmElectric = electricCostPerKm + maintenanceElectric;

  // Monthly costs per vehicle
  const monthlyCostCombustion = totalCostPerKmCombustion * monthlyKm;
  const monthlyCostElectric = totalCostPerKmElectric * monthlyKm;

  // Annual costs per vehicle
  const annualCostCombustion = monthlyCostCombustion * MONTHS_PER_YEAR;
  const annualCostElectric = monthlyCostElectric * MONTHS_PER_YEAR;

  // Insurance
  const insuranceCombustion = INSURANCE_ANNUAL[vehicleType]?.combustion || 800;
  const insuranceElectric = INSURANCE_ANNUAL[vehicleType]?.electric || 700;

  // Total fleet costs (annual)
  const totalFleetAnnualCombustion = (annualCostCombustion + insuranceCombustion) * fleetSize;
  const totalFleetAnnualElectric = (annualCostElectric + insuranceElectric) * fleetSize;

  // Total fleet costs (monthly)
  const totalFleetMonthlyCombustion = (monthlyCostCombustion + insuranceCombustion / MONTHS_PER_YEAR) * fleetSize;
  const totalFleetMonthlyElectric = (monthlyCostElectric + insuranceElectric / MONTHS_PER_YEAR) * fleetSize;

  // Savings
  const monthlySavings = totalFleetMonthlyCombustion - totalFleetMonthlyElectric;
  const annualSavings = totalFleetAnnualCombustion - totalFleetAnnualElectric;
  const savingsPercentage = totalFleetAnnualCombustion > 0
    ? ((annualSavings / totalFleetAnnualCombustion) * 100)
    : 0;

  // Energy consumption
  const monthlyFuelLiters = (fuelConsumptionPer100km / 100) * totalMonthlyKm;
  const monthlyElectricityKwh = (electricConsumptionPer100km / 100) * totalMonthlyKm;
  const annualFuelLiters = monthlyFuelLiters * MONTHS_PER_YEAR;
  const annualElectricityKwh = monthlyElectricityKwh * MONTHS_PER_YEAR;

  // CO2 emissions
  const co2PerLiter = fuelType === 'diesel' ? AVERAGE_CO2_PER_LITER_DIESEL : AVERAGE_CO2_PER_LITER_GASOLINE;
  const annualCO2Combustion = (annualFuelLiters * co2PerLiter) / 1000; // tonnes
  const annualCO2Electric = (annualElectricityKwh * AVERAGE_CO2_PER_KWH_GRID) / 1000; // tonnes
  const co2Reduction = annualCO2Combustion - annualCO2Electric; // tonnes saved
  const co2ReductionPercentage = annualCO2Combustion > 0
    ? ((co2Reduction / annualCO2Combustion) * 100)
    : 0;
  const treesEquivalent = Math.round((co2Reduction * 1000) / TREES_CO2_ABSORPTION_PER_YEAR);

  // Fleet utilization rate (based on daily km vs typical max range)
  const maxDailyRange = vehicleType === 'truck' || vehicleType === 'bus' ? 300 : 400;
  const utilizationRate = Math.min((dailyKm / maxDailyRange) * 100, 100);

  // Feasibility assessment
  const feasibility = assessFeasibility(dailyKm, vehicleType, utilizationRate);

  return {
    companyName,
    fleetSize,
    vehicleType,
    fuelType,
    dailyKm,

    // Distances
    monthlyKm,
    annualKm,
    totalMonthlyKm,
    totalAnnualKm,

    // Cost per km
    fuelCostPerKm,
    electricCostPerKm,
    totalCostPerKmCombustion,
    totalCostPerKmElectric,
    costPerKmSavings: totalCostPerKmCombustion - totalCostPerKmElectric,

    // Monthly costs
    monthlyCostCombustion,
    monthlyCostElectric,
    totalFleetMonthlyCombustion,
    totalFleetMonthlyElectric,

    // Annual costs
    annualCostCombustion,
    annualCostElectric,
    totalFleetAnnualCombustion,
    totalFleetAnnualElectric,

    // Insurance
    insuranceCombustion,
    insuranceElectric,

    // Savings
    monthlySavings,
    annualSavings,
    savingsPercentage,

    // Energy
    monthlyFuelLiters,
    annualFuelLiters,
    monthlyElectricityKwh,
    annualElectricityKwh,

    // Environment
    annualCO2Combustion,
    annualCO2Electric,
    co2Reduction,
    co2ReductionPercentage,
    treesEquivalent,

    // Utilization
    utilizationRate,
    maxDailyRange,

    // Feasibility
    feasibility,
  };
}

function assessFeasibility(dailyKm, vehicleType, utilizationRate) {
  const issues = [];
  let score = 100;

  // Range feasibility
  if (vehicleType === 'truck' && dailyKm > 250) {
    issues.push('Daily distance may exceed typical electric truck range');
    score -= 30;
  } else if (vehicleType === 'bus' && dailyKm > 280) {
    issues.push('Daily distance may exceed typical electric bus range');
    score -= 25;
  } else if ((vehicleType === 'car' || vehicleType === 'van') && dailyKm > 350) {
    issues.push('Daily distance may require intermediate charging');
    score -= 20;
  }

  // Utilization
  if (utilizationRate > 90) {
    issues.push('Very high utilization—ensure charging infrastructure is sufficient');
    score -= 10;
  }

  let level;
  if (score >= 80) level = 'highly-feasible';
  else if (score >= 50) level = 'feasible';
  else level = 'challenging';

  return { score, level, issues };
}

/**
 * Format currency values
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyDecimal(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(value);
}

export function formatNumber(value, decimals = 0) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export const VEHICLE_LABELS = {
  car: 'Car',
  van: 'Van',
  truck: 'Truck',
  bus: 'Bus',
};

export const FUEL_LABELS = {
  diesel: 'Diesel',
  gasoline: 'Gasoline',
};
