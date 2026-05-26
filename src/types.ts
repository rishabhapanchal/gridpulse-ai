/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CalculatorState {
  monthlyBill: number;
  sunHours: number;      // average sun hours per day (defaults to 4.5)
  utilityRate: number;   // electricity cost per kWh (defaults to 0.18)
  roofOrientation: RoofOrientation; // south, west, east, north
  panelCapacity: number;  // panel wattage in watts (defaults to 400)
}

export type RoofOrientation = 'south' | 'west' | 'east' | 'north';

export interface CalculatorResults {
  yearlySavings: number;
  monthlyBill: number;
  panelsNeeded: number;
  systemSizeKw: number;
  equivalentTrees: number;
  carbonReducedTons: number;
  paybackPeriodYears: number;
  estimatedCost: number;
  federalIncentive: number;
  netCost: number;
  lifetimeSavings25Years: number;
}
