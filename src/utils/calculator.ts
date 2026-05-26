/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CalculatorState, CalculatorResults, RoofOrientation } from '../types';

export const ORIENTATION_FACTORS: Record<RoofOrientation, number> = {
  south: 1.0,
  west: 0.85,
  east: 0.85,
  north: 0.55,
};

export const ORIENTATION_LABELS: Record<RoofOrientation, string> = {
  south: 'South Facing (Optimal)',
  west: 'West Facing (Good Afternoon Solar)',
  east: 'East Facing (Good Morning Solar)',
  north: 'North Facing (Low Efficiency)',
};

/**
 * Perform all solar savings calculations.
 * Est. Yearly Savings is strictly: (Monthly Bill * 12 * 0.95)
 */
export function calculateSolarSavings(
  state: CalculatorState,
  typicalSolarCostPerWatt: number = 2.80,
  incentiveRate: number = 0.30
): CalculatorResults {
  const { monthlyBill, sunHours, utilityRate, roofOrientation, panelCapacity } = state;

  // 1. Est. Yearly Savings is strictly as specified: (Monthly Bill * 12 * 0.95)
  const yearlySavings = monthlyBill * 12 * 0.95;

  // Let's compute a realistic, scaling calculation for supporting values:
  const orientationFactor = ORIENTATION_FACTORS[roofOrientation];

  // Est. Monthly energy consumption: bill / rate (e.g. $150 / $0.18 = 833.3 kWh)
  const monthlyConsumptionKwh = monthlyBill / utilityRate;
  const annualConsumptionKwh = monthlyConsumptionKwh * 12;

  // We want to offset about 95% of energy bills with solar production
  // Target annual solar production (kWh) = annualConsumptionKwh * 0.95
  const targetProductionKwh = annualConsumptionKwh * 0.95;

  // How much kWh does a single kW of solar panels generate annually in this area?
  // 1 kW * peak_hours_per_day * 365 days * efficiency_factor (~80%) * orientation
  const annualGenerationPerKw = 1.0 * sunHours * 365 * 0.80 * orientationFactor;

  // System size in kW = targetProduction / annualGenerationPerKw
  let systemSizeKw = targetProductionKwh / annualGenerationPerKw;
  // Bound system size reasonably
  if (isNaN(systemSizeKw) || !isFinite(systemSizeKw) || systemSizeKw < 1) {
    systemSizeKw = 1.2;
  }

  // Calculate panels needed (e.g., systemSizeKw * 1000 / panelCapacity)
  let panelsNeeded = Math.ceil((systemSizeKw * 1000) / panelCapacity);
  
  // Make sure we have a reasonable minimum of 4 panels, scaling up
  if (panelsNeeded < 4) {
    const typicalMonthlyPanelOutputKwh = (panelCapacity * sunHours * 30 * 0.8 * orientationFactor) / 1000;
    panelsNeeded = Math.max(3, Math.ceil(monthlyConsumptionKwh / typicalMonthlyPanelOutputKwh));
  }
  // Recalculate system size based on panels
  systemSizeKw = (panelsNeeded * panelCapacity) / 1000;

  // System Cost Model (approx. typicalSolarCostPerWatt per Watt installed before incentives, scaling down with size)
  const costPerWatt = Math.max(typicalSolarCostPerWatt * 0.75, (typicalSolarCostPerWatt * 1.15) - (systemSizeKw * 0.015 * typicalSolarCostPerWatt));
  const estimatedCost = systemSizeKw * 1000 * costPerWatt;
  const federalIncentive = estimatedCost * incentiveRate; // National clean energy credits
  const netCost = estimatedCost - federalIncentive;

  // Payback period in years
  let paybackPeriodYears = netCost / yearlySavings;
  if (paybackPeriodYears < 3) paybackPeriodYears = 3.2;
  if (paybackPeriodYears > 12) paybackPeriodYears = 11.5;

  // Environmental Impact Calculations
  // Standard CO2 avoided: ~0.4 kg (0.88 lbs) of CO2 per solar kWh generated
  const annualSolarGenerationKwh = systemSizeKw * sunHours * 365 * 0.80 * orientationFactor;
  const carbonReducedTons = (annualSolarGenerationKwh * 0.88) / 2204.62; // converting lbs to metric tons
  const equivalentTrees = Math.round(carbonReducedTons * 45); // ~45 trees offset 1 metric ton of CO2/year

  // Lifetime 25-Year Savings (assuming electricity rates inflate by 2.5% a year)
  // Formula: Sum_t=1..25 of (yearlySavings) * (1.025)^t
  let lifetimeSavings25Years = 0;
  for (let year = 1; year <= 25; year++) {
    lifetimeSavings25Years += yearlySavings * Math.pow(1.025, year - 1);
  }

  return {
    yearlySavings,
    monthlyBill,
    panelsNeeded,
    systemSizeKw,
    equivalentTrees,
    carbonReducedTons: Number(carbonReducedTons.toFixed(2)),
    paybackPeriodYears: Number(paybackPeriodYears.toFixed(1)),
    estimatedCost: Math.round(estimatedCost),
    federalIncentive: Math.round(federalIncentive),
    netCost: Math.round(netCost),
    lifetimeSavings25Years: Math.round(lifetimeSavings25Years),
  };
}

/**
 * Generate year-by-year cumulative savings data for charting
 */
export interface CumulativeSavingsPoint {
  year: number;
  solarSavings: number;
  traditionalCost: number;
  netGain: number;
}

export function generateSavingsProjection(
  results: CalculatorResults,
  monthlyBill: number
): CumulativeSavingsPoint[] {
  const points: CumulativeSavingsPoint[] = [];
  let cumulativeSolarSavings = 0;
  let cumulativeTraditionalCost = 0;
  
  const annualUtilityCost = monthlyBill * 12;

  for (let year = 1; year <= 25; year++) {
    // Utility rates compound at approx 3% annually (historic standard)
    const inflationMultiplier = Math.pow(1.03, year - 1);
    
    // Solar saves 95% of the bill, remaining 5% goes to grid connection fee which inflates too
    const savingsThisYear = results.yearlySavings * inflationMultiplier;
    const traditionalCostThisYear = annualUtilityCost * inflationMultiplier;

    cumulativeSolarSavings += savingsThisYear;
    cumulativeTraditionalCost += traditionalCostThisYear;

    // Net gain is cumulative solar savings minus the net initial investment cost
    const netGain = cumulativeSolarSavings - results.netCost;

    points.push({
      year,
      solarSavings: Math.round(cumulativeSolarSavings),
      traditionalCost: Math.round(cumulativeTraditionalCost),
      netGain: Math.round(netGain),
    });
  }

  return points;
}
