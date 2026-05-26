/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CountryConfig {
  code: string;           // e.g. 'US'
  name: string;           // e.g. 'United States'
  currency: string;       // e.g. 'USD'
  symbol: string;         // e.g. '$'
  flag: string;           // Emoji flag
  conversionRateFromUSD: number; // For smooth scaling if changing back & forth

  // Localized solar parameters
  defaultSunHours: number;
  defaultUtilityRate: number;      // Per kWh in local currency
  defaultMonthlyBill: number;      // Local currency amount
  typicalSolarCostPerWatt: number; // Multiplier of typical installation costs in local currency

  // Dynamic bounds for range sliders
  minBill: number;
  maxBill: number;
  stepBill: number;
  minRate: number;
  maxRate: number;
  stepRate: number;

  // Faster selection buttons
  presets: number[];

  // National Solar Incentives
  incentiveName: string;
  incentiveRate: number;  // Fraction (e.g. 0.30 for 30%)
  incentiveDesc: string;
  rateLabel: string;
  disclosureText: string;
}

export const COUNTRIES: CountryConfig[] = [
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    symbol: '$',
    flag: '🇺🇸',
    conversionRateFromUSD: 1.0,
    defaultSunHours: 4.5,
    defaultUtilityRate: 0.18,
    defaultMonthlyBill: 150,
    typicalSolarCostPerWatt: 2.80,
    minBill: 50,
    maxBill: 800,
    stepBill: 10,
    minRate: 0.10,
    maxRate: 0.45,
    stepRate: 0.01,
    presets: [100, 150, 250, 400, 600],
    incentiveName: '30% Federal credit (ITC)',
    incentiveRate: 0.30,
    incentiveDesc: 'Residential Clean Energy offset',
    rateLabel: '30% Investment Tax Credit',
    disclosureText: 'Solar energy residential investment parameters are offset by 30% under the current United States Federal Clean Energy Tax Credit provisions (Section 25D of Internal Revenue Code).'
  },
  {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    symbol: '₹',
    flag: '🇮🇳',
    conversionRateFromUSD: 80.0,
    defaultSunHours: 5.5,
    defaultUtilityRate: 7.50,
    defaultMonthlyBill: 8000,
    typicalSolarCostPerWatt: 55.00,
    minBill: 1500,
    maxBill: 60000,
    stepBill: 500,
    minRate: 4.0,
    maxRate: 15.0,
    stepRate: 0.2,
    presets: [4000, 8000, 15000, 25000, 45000],
    incentiveName: 'PM-Surya Ghar Subsidy',
    incentiveRate: 0.40,
    incentiveDesc: 'National Rooftop Solar Subsidy Scheme',
    rateLabel: 'Direct Capital Central Subsidy',
    disclosureText: 'Rooftop solar installations are offset in accordance with the Indian PM-Surya Ghar: Muft Bijli Yojana, which guarantees up to 40% direct central government subsidy on typical residential rooftop installations (up to 3kW).'
  },
  {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    symbol: '€',
    flag: '🇩🇪',
    conversionRateFromUSD: 0.92,
    defaultSunHours: 3.2,
    defaultUtilityRate: 0.35,
    defaultMonthlyBill: 120,
    typicalSolarCostPerWatt: 1.80,
    minBill: 30,
    maxBill: 600,
    stepBill: 10,
    minRate: 0.20,
    maxRate: 0.55,
    stepRate: 0.01,
    presets: [80, 120, 200, 350, 500],
    incentiveName: '0% Mehrwertsteuer (USt)',
    incentiveRate: 0.19,  // Saves 19% standard VAT
    incentiveDesc: 'Special zero-rate VAT exemption',
    rateLabel: '19% tax removal discount',
    disclosureText: 'Hardware rates leverage Germany’s modern zero-rate VAT (Nullsteuer) on typical residential PV installations under Section 12 paragraph 3 of the German Annual Tax Act, lowering gross setup expenses by 19%.'
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    flag: '🇬🇧',
    conversionRateFromUSD: 0.79,
    defaultSunHours: 2.8,
    defaultUtilityRate: 0.28,
    defaultMonthlyBill: 110,
    typicalSolarCostPerWatt: 1.65,
    minBill: 30,
    maxBill: 500,
    stepBill: 10,
    minRate: 0.15,
    maxRate: 0.45,
    stepRate: 0.01,
    presets: [70, 110, 180, 300, 450],
    incentiveName: '0% Clean Energy VAT',
    incentiveRate: 0.20,  // Saves standard 20% VAT
    incentiveDesc: 'Government zero-VAT energy scheme',
    rateLabel: '20% Energy Saving Relieving',
    disclosureText: 'Hardware pricing leverages the UK government zero-rate VAT relief for energy-saving materials (ESMs), removing the standard 20% VAT on heat pumps and rooftop PV equipment installation.'
  },
  {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    symbol: 'A$',
    flag: '🇦🇺',
    conversionRateFromUSD: 1.51,
    defaultSunHours: 5.8,
    defaultUtilityRate: 0.32,
    defaultMonthlyBill: 160,
    typicalSolarCostPerWatt: 1.45,
    minBill: 50,
    maxBill: 1000,
    stepBill: 10,
    minRate: 0.15,
    maxRate: 0.55,
    stepRate: 0.01,
    presets: [100, 160, 250, 450, 750],
    incentiveName: 'Small-scale STC Discount',
    incentiveRate: 0.35,
    incentiveDesc: 'UPFRONT technology certificates discount',
    rateLabel: 'STCs solar incentive value',
    disclosureText: 'Rooftop hardware estimates are offset up to an average of 35% through upfront Small-scale Technology Certificates (STCs) under Australia’s federal Renewable Energy Target schemes.'
  },
  {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    symbol: 'C$',
    flag: '🇨🇦',
    conversionRateFromUSD: 1.36,
    defaultSunHours: 3.5,
    defaultUtilityRate: 0.16,
    defaultMonthlyBill: 140,
    typicalSolarCostPerWatt: 2.30,
    minBill: 40,
    maxBill: 800,
    stepBill: 10,
    minRate: 0.08,
    maxRate: 0.35,
    stepRate: 0.01,
    presets: [80, 140, 220, 380, 550],
    incentiveName: 'Provincial Clean Energy Grants',
    incentiveRate: 0.25,
    incentiveDesc: 'Interest-free green retrofit loans',
    rateLabel: 'Canada Clean Energy incentive',
    disclosureText: 'Estimates leverage standard local provincial clean energy grants alongside Canada Greener Homes low-interest solar hardware installation support.'
  },
  {
    code: 'JP',
    name: 'Japan',
    currency: 'JPY',
    symbol: '¥',
    flag: '🇯🇵',
    conversionRateFromUSD: 156.0,
    defaultSunHours: 3.8,
    defaultUtilityRate: 31.0,
    defaultMonthlyBill: 14000,
    typicalSolarCostPerWatt: 240.0,
    minBill: 4000,
    maxBill: 80000,
    stepBill: 500,
    minRate: 15.0,
    maxRate: 50.0,
    stepRate: 1.0,
    presets: [8000, 14000, 25000, 45005, 65000],
    incentiveName: 'Metropolitan PV Subsidies',
    incentiveRate: 0.20,
    incentiveDesc: 'Prefecture environmental asset subsidy',
    rateLabel: 'Clean Energy Met Subsidy',
    disclosureText: 'Hardware installation calculations incorporate an average 20% prefectural/metropolitan clean energy subsidy scheme targeted to residential rooftops.'
  },
  {
    code: 'ZA',
    name: 'South Africa',
    currency: 'ZAR',
    symbol: 'R',
    flag: '🇿🇦',
    conversionRateFromUSD: 18.4,
    defaultSunHours: 6.0,
    defaultUtilityRate: 2.80,
    defaultMonthlyBill: 2200,
    typicalSolarCostPerWatt: 14.50,
    minBill: 500,
    maxBill: 12000,
    stepBill: 100,
    minRate: 1.50,
    maxRate: 5.50,
    stepRate: 0.05,
    presets: [1000, 2200, 4500, 7500, 10000],
    incentiveName: 'SARS Sec 12B Solar Benefit',
    incentiveRate: 0.25,
    incentiveDesc: 'SARS Clean Energy Tax Rebate allowance',
    rateLabel: '25% Personal Tax Deduction',
    disclosureText: 'Rooftop hardware estimates are offset in accordance with the South African Revenue Services (SARS) clean generation asset tax deduction provisions (Section 12B allowance).'
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    symbol: 'د.إ',
    flag: '🇦🇪',
    conversionRateFromUSD: 3.67,
    defaultSunHours: 6.2,
    defaultUtilityRate: 0.28,
    defaultMonthlyBill: 600,
    typicalSolarCostPerWatt: 4.80,
    minBill: 150,
    maxBill: 3000,
    stepBill: 50,
    minRate: 0.15,
    maxRate: 0.45,
    stepRate: 0.01,
    presets: [300, 600, 1000, 1500, 2500],
    incentiveName: 'Shams Dubai Net Metering',
    incentiveRate: 0.15,
    incentiveDesc: 'DEWA smart grid interconnection savings',
    rateLabel: 'Shams Net Metering Offsets',
    disclosureText: 'Calculations leverage DEWA Shams Dubai solar net metering regulations, enabling seamless carbon offset credits when exporting surplus generation to the utility grid.'
  }
];
