import React, { useState } from 'react';
import { BookOpen, ArrowLeft, Calendar, Clock, ChevronDown, Zap, Globe, TrendingUp, Sun, Battery, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─────────────────────────────────────────────────────────────────────────────
// MASTER ARTICLE DATABASE — 20 SEO-optimised, globally-relevant solar articles
// ─────────────────────────────────────────────────────────────────────────────
export const ARTICLES = [
  {
    id: 'solar-payback-2026',
    slug: 'solar-payback-2026',
    title: 'Solar Panel Payback Period in 2026: Country-by-Country Breakdown',
    excerpt: 'From Germany's feed-in premiums to India's PM Surya Ghar subsidies and US federal ITC — we map real payback timelines for homeowners in 12 countries using live electricity tariff data.',
    category: 'Finance',
    date: 'May 28, 2026',
    readTime: '9 min read',
    author: 'Grid Pulse Analytics',
    featured: true,
    image: 'https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?q=80&w=1400&auto=format&fit=crop',
    tags: ['ROI', 'Payback', 'Global', '2026'],
    content: `Solar panel payback periods have compressed dramatically over the last decade, but the exact timeline still varies wildly depending on where you live, your electricity tariff, and the incentives available in your region.

**United States (4–7 years)**
The federal Investment Tax Credit (ITC) at 30% slashes upfront costs immediately. Combined with net metering in most states, American homeowners with a $10,000 system typically recover costs within 5–6 years. States like California, Texas, and Florida offer additional rebates that push this closer to 4 years.

**India (3–5 years)**
India now represents one of the fastest payback markets globally. With average electricity rates climbing past ₹8–10/kWh in urban metros, and PM Surya Ghar providing up to ₹78,000 in direct subsidies for 3kW systems, payback timelines of 3–4 years are now achievable for middle-class households. The national 40% subsidy on the first 2kW is a structural game-changer.

**Germany (6–9 years)**
Despite high system costs, Germany's feed-in tariff (Einspeisevergütung) guarantees €0.082/kWh for surplus energy fed into the grid. Add the 0% VAT on residential solar since 2023, and the effective payback sits around 7 years for a south-facing 8kW system in Bavaria.

**Canada (7–10 years)**
Provincial programs like Ontario's Net Metering Policy and BC Hydro's net billing schemes reduce payback, though lower electricity costs in hydro-heavy provinces like Quebec stretch timelines. Alberta and Ontario remain the strongest markets.

**Australia (3–5 years)**
Australia's combination of high electricity prices (averaging AUD $0.30/kWh), generous Small-scale Technology Certificates (STCs), and feed-in tariffs in Victoria and Queensland makes it one of the world's most compelling solar markets. Systems sized at 6.6kW pay back in under 4 years in most capitals.

**United Kingdom (8–12 years)**
Post-SEG (Smart Export Guarantee) rates of 15p/kWh for exported energy, combined with £5,000–£8,000 system costs, put UK payback in the 9-year range. The recent removal of VAT on solar installations accelerated adoption significantly.

**Key Variables That Change Everything**
- Roof orientation: South-facing loses 0%, North-facing loses 45% of potential yield
- Shading: Even 10% shading from a chimney can reduce annual output by 20%+
- Battery storage: Adds 2–3 years to payback but increases self-consumption to 80%+
- Grid electricity inflation: Every 10% rise in utility rates shortens payback by ~8 months

Use the Grid Pulse AI calculator above to model your exact scenario with your local tariff and sun hours. The payback period displayed is calculated using your actual monthly bill, orientation multiplier, and regional incentive rates — not generic averages.`
  },
  {
    id: 'perovskite-solar-2026',
    slug: 'perovskite-solar-2026',
    title: 'Perovskite Solar Cells Are Coming: What Homeowners Need to Know in 2026',
    excerpt: 'Lab efficiencies just crossed 33%. Commercial perovskite-silicon tandem panels are entering the market — and they could make your current system obsolete within 5 years.',
    category: 'Technology',
    date: 'May 26, 2026',
    readTime: '8 min read',
    author: 'R. Panchal',
    featured: true,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop',
    tags: ['Perovskite', 'Technology', 'Future', 'Efficiency'],
    content: `The solar industry is standing at the edge of its most significant efficiency breakthrough since the invention of the silicon solar cell. Perovskite solar technology — once dismissed as a laboratory curiosity — has crossed critical commercial thresholds in 2026.

**What Are Perovskite Solar Cells?**
Perovskites are crystalline materials with a specific molecular structure (ABX₃) that are extraordinarily efficient at absorbing light and converting it to electricity. Unlike silicon, which requires energy-intensive manufacturing at high temperatures, perovskites can be deposited at low temperatures — potentially slashing manufacturing costs by 50–70%.

**The 33% Efficiency Milestone**
In early 2026, Oxford PV and LONGi both announced certified efficiencies exceeding 33% for perovskite-silicon tandem cells. For context, the best commercial silicon panels today sit at 22–24%. This means a perovskite tandem panel could generate 35–45% more electricity from the same roof area.

**What's Still Stopping Them?**
- **Durability**: Standard perovskites degrade when exposed to moisture and UV. Encapsulation technology has improved dramatically, with leading manufacturers now claiming 25-year warranties, but real-world longevity data is still limited to 5–8 years.
- **Lead content**: Most high-efficiency perovskites use lead, raising disposal and regulatory concerns. Lead-free alternatives using tin or bismuth exist but currently sacrifice efficiency.
- **Scale manufacturing**: Going from lab samples to gigawatt-scale production without defect introduction remains a serious engineering challenge.

**Commercial Timeline**
- 2026: First commercial perovskite-silicon tandem panels available in limited markets (Europe, Japan)
- 2027–2028: Broader availability, prices expected around $0.25–0.35/watt (vs silicon at $0.20/watt currently)
- 2030: Price parity or better projected, with efficiency likely at 35%+

**Should You Wait or Install Now?**
If your electricity bill is high today, waiting 3–4 years for perovskite to go mainstream means paying full utility rates in the meantime. The opportunity cost of waiting typically exceeds the benefit of higher future efficiency. Install silicon now, and if perovskite delivers on its promise, you can add capacity on remaining roof space.

The Grid Pulse AI calculator already accounts for declining panel costs in its 25-year lifetime savings model — so the projections you see factor in technology cost curves, not just today's pricing.`
  },
  {
    id: 'battery-storage-guide-2026',
    slug: 'battery-storage-guide-2026',
    title: 'Home Battery Storage in 2026: Tesla Powerwall vs BYD Blade vs Luminous — Full Comparison',
    excerpt: 'We benchmark the top residential battery systems on capacity, cycle life, warranty, grid independence, and real-world cost per stored kWh across US, India, UK, and Australia.',
    category: 'Technology',
    date: 'May 24, 2026',
    readTime: '11 min read',
    author: 'Grid Pulse Analytics',
    featured: false,
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1400&auto=format&fit=crop',
    tags: ['Battery', 'Storage', 'Powerwall', 'BYD', 'Comparison'],
    content: `Home battery storage has evolved from a luxury add-on to a near-essential component of residential solar systems — especially as grid reliability declines and time-of-use electricity pricing spreads globally. Here's the definitive 2026 comparison.

**Tesla Powerwall 3 (US, Australia, UK)**
- Capacity: 13.5 kWh usable
- Peak output: 11.5 kW continuous
- Round-trip efficiency: 97.5%
- Warranty: 10 years / unlimited cycles (to 70% capacity retention)
- Price (installed): USD $12,000–$14,500 / AUD $16,000–$18,000
- Standout feature: Seamless integration with Tesla Solar and the Tesla app, with storm watch mode that pre-charges before bad weather

**BYD Battery-Box Premium HVS (Europe, Australia)**
- Capacity: Modular 5.1–25.6 kWh (stackable in 2.56 kWh increments)
- Peak output: Up to 9.6 kW
- Round-trip efficiency: 96%
- Warranty: 10 years / 10,000 cycles
- Price: €1,000–€1,200 per kWh installed
- Standout feature: The blade cell chemistry is genuinely safer — virtually zero thermal runaway risk. Modular expansion is a massive advantage for growing families.

**Luminous Inverter + Battery (India)**
- Capacity: 150Ah–220Ah tubular batteries paired with 3.5–10 kVA inverters
- Cycle life: 1,200–1,500 cycles (vs 6,000+ for LiFePO4)
- Price (installed): ₹45,000–₹1,20,000 depending on capacity
- Standout feature: Proven reliability in Indian grid conditions (frequent outages, voltage fluctuations). Wide service network across tier-2 and tier-3 cities.
- Limitation: Lead-acid chemistry means lower efficiency (80–85%), higher maintenance, and replacement every 4–5 years.

**LiFePO4 vs Lead-Acid for Indian Market**
Lithium iron phosphate batteries (like those from Nexcharge, Okaya Lithium, and Loom Solar) are now entering Indian distribution, priced at ₹25,000–₹35,000 per kWh. Over a 15-year period, LiFePO4 offers dramatically lower total cost of ownership despite the higher upfront cost.

**Cost Per Stored kWh (Lifetime Analysis)**
| System | Upfront | Cycles | Cost/kWh stored |
|---|---|---|---|
| Tesla Powerwall 3 | $13,000 | 10,000+ | $0.08 |
| BYD HVS | €12,000 | 10,000 | €0.09 |
| Luminous Lead-Acid | ₹80,000 | 1,400 | ₹4.20 |
| Loom Solar LiFePO4 | ₹1,50,000 | 6,000 | ₹1.50 |

**Key Takeaway**
For US and Australian homeowners, Tesla Powerwall 3 remains the gold standard for seamless UX. European buyers should seriously consider BYD's modular approach. Indian homeowners face a clear pivot point — the lead-acid era is ending, and LiFePO4 systems now offer compelling 8–10 year payback at current electricity prices.`
  },
  {
    id: 'net-metering-global-guide',
    slug: 'net-metering-global-guide',
    title: 'Net Metering Explained: How Much Can You Actually Earn Selling Solar Back to the Grid?',
    excerpt: 'Net metering policies differ drastically by country and even by state. Here\'s exactly what you earn per kWh exported in the US, India, UK, Germany, and Australia — and which markets are phasing it out.',
    category: 'Policy',
    date: 'May 22, 2026',
    readTime: '8 min read',
    author: 'Grid Pulse Analytics',
    featured: false,
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1400&auto=format&fit=crop',
    tags: ['Net Metering', 'Policy', 'Feed-in Tariff', 'Export'],
    content: `Net metering is one of the most valuable — and most misunderstood — components of a solar investment. Here's what you're actually entitled to in major markets, and what's changing.

**United States**
Net metering is now available in 38 states, though the rate you receive for exported electricity varies enormously. California's NEM 3.0 (effective 2023) dramatically reduced export credits to $0.05–$0.08/kWh during daytime hours, making battery storage essential. Texas, Florida, and most of the Southeast still operate under favorable 1:1 net metering, where you receive full retail credit for every kWh you export.

**India**
Net metering in India operates under SERC (State Electricity Regulatory Commission) regulations, which means every state has different rules. Delhi offers net metering up to 10kW with true 1:1 billing. Maharashtra allows 500kW systems with net metering. Rajasthan, with its exceptional irradiance, has become a hotspot. The challenge: many DISCOMs apply "banking" rather than true net metering, rolling excess credits forward quarterly rather than monthly.

**United Kingdom — Smart Export Guarantee (SEG)**
Since January 2020, UK solar owners must be paid for exported electricity by any supplier with 150,000+ customers. Export rates in 2026 range from 12p/kWh (Octopus Energy's Outgoing Octopus tariff) to 24p/kWh on premium plans. Smart meters are required.

**Germany — Einspeisevergütung**
Germany's feed-in tariff for new systems installed in 2026 pays €0.082/kWh for systems up to 10kW. While this is lower than peak rates of €0.57/kWh in 2010, it's guaranteed for 20 years from installation date — providing exceptional long-term income certainty.

**Australia**
Australian feed-in tariffs vary by state and retailer. Victoria's minimum FiT is AUD $0.038/kWh, while competitive retailers offer up to AUD $0.12/kWh. Time-varying FiTs that pay more for energy exported during evening peaks are becoming standard.

**The Global Trend: Declining FiTs, Rising Battery Economics**
Most markets are reducing export compensation as grid operators struggle with the "duck curve" — solar overproduction at midday flooding the grid. This structural shift is exactly why battery storage payback periods are compressing. Self-consumption of 80–90% via a home battery is becoming more financially attractive than selling to the grid in nearly every major market.`
  },
  {
    id: 'pm-surya-ghar-complete-guide',
    slug: 'pm-surya-ghar-complete-guide',
    title: 'PM Surya Ghar Muft Bijli Yojana: Complete 2026 Guide to Getting Your ₹78,000 Subsidy',
    excerpt: 'Step-by-step application process, DISCOM approval timelines, eligible installers, common rejection reasons, and how to actually get your money after installation.',
    category: 'Policy',
    date: 'May 20, 2026',
    readTime: '10 min read',
    author: 'R. Panchal',
    featured: false,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1400&auto=format&fit=crop',
    tags: ['India', 'Subsidy', 'PM Surya Ghar', 'DISCOM'],
    content: `The PM Surya Ghar Muft Bijli Yojana is the most ambitious residential solar subsidy program in Indian history — targeting 1 crore households. But getting from application to actual subsidy disbursement involves navigating multiple government portals, local DISCOM offices, and technical inspections. Here's exactly how to do it.

**Subsidy Structure (2026)**
- 1 kW system: ₹30,000 (60% of benchmark cost)
- 2 kW system: ₹60,000 (60% of benchmark cost)
- 3 kW system: ₹78,000 (40% subsidy on third kW, effectively)
- Above 3 kW: No additional central subsidy

State-level top-ups are available in Gujarat (additional ₹10,000), Maharashtra, and Rajasthan.

**Step 1: Registration on pmsuryaghar.gov.in**
- Create account with Aadhaar-linked mobile number
- Enter electricity consumer number and DISCOM details
- Select system capacity (1kW, 2kW, or 3kW recommended for subsidy maximization)

**Step 2: DISCOM Feasibility Check**
Your application is routed to your local DISCOM (BESCOM in Bangalore, TPCODL in Odisha, etc.) for technical feasibility. This involves checking transformer capacity on your street and existing load. Timeline: 15–30 working days. Common delay: transformer overload in dense urban areas.

**Step 3: Vendor Selection**
Only MNRE-empanelled vendors are eligible. The portal shows registered vendors in your district. Critical advice: get 3 quotes, verify DCR (Domestic Content Requirement) compliance for modules, and ensure the vendor includes bidirectional net meter installation.

**Step 4: Installation and Inspection**
After DISCOM approval, installation typically takes 1–2 days. Post-installation, DISCOM engineers inspect and approve the net meter. This inspection is often the biggest bottleneck — some DISCOMs have 60–90 day backlogs.

**Step 5: Subsidy Disbursement**
After net meter activation, upload commissioning certificate to the portal. Central subsidy is direct bank transfer within 30 days. State subsidies have separate disbursement timelines.

**Common Rejection Reasons**
1. Installer not on MNRE empanelled list
2. Non-DCR compliant modules used
3. System capacity exceeds sanctioned load
4. Incorrect consumer number on application

**Pro Tips**
- Apply in November–February to avoid the summer installation rush
- Ensure your electrical wiring is updated before inspection (old wiring fails)
- Keep all invoices — you'll need them for subsidy documentation
- Follow up on DISCOM portal every 2 weeks — applications can get stuck without notification`
  },
  {
    id: 'solar-maintenance-guide',
    slug: 'solar-maintenance-guide',
    title: 'How to Maintain Your Solar Panels for Maximum Output: A Complete Annual Checklist',
    excerpt: 'Dirty panels lose 15–25% of output. Here\'s the complete maintenance protocol — cleaning schedules, inverter diagnostics, performance monitoring, and when to call a professional.',
    category: 'Maintenance',
    date: 'May 18, 2026',
    readTime: '7 min read',
    author: 'Grid Pulse Analytics',
    featured: false,
    image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64926?q=80&w=1400&auto=format&fit=crop',
    tags: ['Maintenance', 'Cleaning', 'Performance', 'DIY'],
    content: `A solar panel system requires minimal maintenance — but "minimal" doesn't mean zero. Neglected systems can lose 15–30% of annual output, turning a great investment into a mediocre one. Here's the full annual maintenance protocol.

**Cleaning: The Biggest ROI Task**

Dust, pollen, bird droppings, and pollution film are silent killers of solar output. Studies in India found soiling losses of 1.5–2% per day in dusty conditions — meaning panels not cleaned for a month can lose 30% of output.

*Cleaning Frequency by Location:*
- Desert/dusty climates (Rajasthan, Arizona, Middle East): Every 2–4 weeks
- Suburban areas with moderate pollution: Every 6–8 weeks
- Coastal/rainy climates: Rain does most of the work; check quarterly
- Urban areas near highways/industry: Monthly

*How to Clean:*
1. Early morning or evening only (never clean hot panels — thermal shock)
2. Use soft brush attachment with deionized or RO water
3. Avoid high-pressure washing (can damage junction boxes)
4. Never use abrasive materials or detergents with surfactants

**Inverter Health Checks**

Your inverter is the brain of the system. Check:
- Error codes on display: Log any fault codes and check manufacturer documentation
- Cooling fans: Spinning freely, no dust blockage
- Operating temperature: Inverters should run below 45°C
- DC input voltage: Should match panel string specifications within ±5%

String inverters should be replaced every 10–15 years. Microinverters typically last 25+ years.

**Annual Professional Inspection (Recommended)**

Every 2–3 years, a certified solar technician should:
- Thermal imaging of panels to detect hot spots (failing cells run 20–40°C hotter)
- Insulation resistance testing of DC wiring
- Check roof penetration seals for water ingress
- Torque-check mounting hardware (wind loosening is common)
- Review 12-month generation data vs. expected output

**Performance Monitoring**

Every modern inverter app shows daily generation. Track:
- Daily kWh vs. same period last year
- Performance Ratio (actual output / theoretical maximum): Should be 75–85%
- Any single days with unusually low output (may indicate partial shading from new tree growth)

A sudden 15% drop in output on a clear day = immediate inspection needed.`
  },
  {
    id: 'solar-ev-charging-2026',
    slug: 'solar-ev-charging-2026',
    title: 'Solar + EV Charging: The Ultimate Guide to Free Electric Vehicle Fuel in 2026',
    excerpt: 'Sizing a solar system to charge your EV for free, smart charging controllers, V2H (Vehicle-to-Home) technology, and the real numbers on annual fuel cost savings.',
    category: 'EV + Solar',
    date: 'May 16, 2026',
    readTime: '9 min read',
    author: 'Grid Pulse Analytics',
    featured: false,
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1400&auto=format&fit=crop',
    tags: ['EV', 'Charging', 'V2H', 'Savings'],
    content: `The combination of rooftop solar and an electric vehicle is the most powerful personal energy investment available today. A well-sized system can eliminate both your electricity bill and your fuel costs — permanently.

**How Much Solar Do You Need for an EV?**

The math is straightforward:
- Average EV: 15–20 kWh per 100km driven
- Average driver: 50km/day = 7.5–10 kWh/day
- Solar requirement for EV alone: 2.5–4 kW additional capacity (beyond household needs)

A household already running a 6kW solar system typically needs to upsize to 8–10kW to comfortably cover EV charging without grid dependence.

**Smart Charging: The Key to Maximising Solar Self-Consumption**

Basic EV chargers don't know or care about solar production — they draw from the grid equally day and night. Smart solar EV chargers change this completely:

- **Zappi (UK/Europe)**: Detects excess solar export and diverts it to EV charging. When solar produces 2.4kW excess, Zappi starts charging at exactly that rate.
- **Tesla Wall Connector**: Integrates with Powerwall and Tesla Solar for scheduled solar-only charging
- **Wallbox Pulsar Plus**: Has solar boost mode compatible with most inverter brands

These devices ensure your EV charges during peak solar hours, maximizing self-consumption and minimizing grid import.

**V2H (Vehicle-to-Home): Your EV as a Giant Battery**

The Nissan Leaf, Mitsubishi Outlander PHEV, and several 2025–2026 Chinese EVs support Vehicle-to-Home bidirectional charging. In a power outage, your 40–75kWh EV battery can power your home for 2–5 days.

V2H chargers (like those from Wallbox and Kaluza) are now available in Europe, Japan, and increasingly in the US as Ford's F-150 Lightning popularized V2H in North America.

**Real Numbers: Annual Savings**

For a UK household (£0.28/kWh electricity, £1.48/litre petrol):
- Driving 15,000km/year in a petrol car: £1,200–£1,600 in fuel
- Same distance in an EV charged from grid: £550–£700
- Same distance in an EV charged from solar: £0–£80 (only overnight charging cost)

**Total annual saving: £1,100–£1,500 from fuel alone + £400–£700 from household electricity = £1,500–£2,200/year**

Over 10 years, solar + EV together save the average UK household £15,000–£22,000 compared to a petrol car with grid electricity.`
  },
  {
    id: 'off-grid-solar-guide',
    slug: 'off-grid-solar-guide',
    title: 'Off-Grid Solar in 2026: Complete System Design for Homes and Remote Properties',
    excerpt: 'Everything you need to design a truly off-grid solar system — load calculation, panel sizing, battery bank design, backup generators, and real costs in USD, INR, and AUD.',
    category: 'Off-Grid',
    date: 'May 14, 2026',
    readTime: '12 min read',
    author: 'Grid Pulse Analytics',
    featured: false,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1400&auto=format&fit=crop',
    tags: ['Off-Grid', 'System Design', 'Battery', 'Remote'],
    content: `Going completely off-grid is no longer the preserve of survivalists and extreme environmentalists. In 2026, with battery costs down 89% from 2010 peaks and panel efficiency up 60%, off-grid solar is economically rational for rural properties, remote cabins, and any location where grid connection costs exceed $15,000–$20,000.

**Step 1: Load Calculation (The Foundation of Everything)**

Off-grid design starts with understanding exactly what you're powering. Use this framework:

Appliance | Watts | Hours/Day | Daily kWh
Refrigerator | 150W | 24h | 1.0 kWh (compressor cycles ~8h effective)
LED Lighting (8 bulbs) | 80W | 6h | 0.48 kWh
Laptop | 65W | 8h | 0.52 kWh
TV | 100W | 4h | 0.40 kWh
Water pump | 750W | 1h | 0.75 kWh
Total Daily Load | | | ~5.0 kWh

Add 20% safety margin → Design load: 6.0 kWh/day

**Step 2: Battery Bank Sizing**

For 3 days of autonomy (essential for cloudy period resilience):
Battery bank needed: 6.0 kWh × 3 days = 18 kWh

For LiFePO4 at 90% usable depth of discharge: 20 kWh battery bank
Recommended: 4× 5kWh LiFePO4 modules (e.g., BYD, Pylontech, or Luminous LiFePO4)

**Step 3: Panel Array Sizing**

With 5 peak sun hours/day and 80% system efficiency:
Panels needed: 6.0 kWh ÷ (5h × 0.80) = 1.5 kW minimum
Off-grid rule: Add 50% buffer for losses and winter/monsoon variance
Final array: 2.2–2.5 kW (6–7 × 400W panels)

**Step 4: Inverter and Charge Controller Selection**

- MPPT Charge Controller: Size at 125% of array wattage (e.g., 3,000W controller for 2.4kW array)
- Inverter: Pure sine wave only (modified sine wave damages motor loads and electronics)
- Combined Inverter-Charger: Victron Multiplus, Growatt, or Luminous hybrid inverters handle both solar and optional generator input

**Real System Costs (2026)**

*Australia — 10kWh/day off-grid system:*
- 16 × 400W panels (6.4kW): AUD $4,800
- 20kWh LiFePO4 battery: AUD $12,000
- 5kW hybrid inverter + MPPT: AUD $3,500
- Installation + cabling: AUD $4,000
- **Total: AUD $24,300**
- vs. grid connection cost in remote Queensland: AUD $30,000–$80,000

*India — 6kWh/day off-grid system:*
- 8 × 400W panels (3.2kW): ₹1,20,000
- 10kWh LiFePO4: ₹2,00,000
- 3.5kW hybrid inverter: ₹45,000
- Installation: ₹30,000
- **Total: ₹3,95,000** (payback vs generator diesel: 5–6 years)`
  },
  {
    id: 'commercial-solar-roi',
    slug: 'commercial-solar-roi',
    title: 'Commercial Solar ROI in 2026: How Businesses Calculate True Payback on Industrial Arrays',
    excerpt: 'Accelerated depreciation, power purchase agreements, demand charge reduction, and MACRS write-offs — the financial levers that make commercial solar compelling even at higher system costs.',
    category: 'Finance',
    date: 'May 12, 2026',
    readTime: '11 min read',
    author: 'Grid Pulse Analytics',
    featured: false,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1400&auto=format&fit=crop',
    tags: ['Commercial', 'ROI', 'Business', 'MACRS'],
    content: `Commercial solar investment calculus is fundamentally different from residential — and often more compelling. While a homeowner targets a 6-year payback, businesses deploying solar under optimized financial structures often achieve 3–4 year payback with post-incentive internal rates of return exceeding 20%.

**The Commercial Advantage: Accelerated Depreciation**

In the United States, commercial solar systems qualify for MACRS (Modified Accelerated Cost Recovery System) 5-year depreciation. Combined with the 30% ITC, the effective first-year tax benefit can offset 50–60% of the system cost.

Example: $500,000 rooftop system
- ITC (30%): -$150,000
- MACRS Year 1 (60% bonus depreciation × 85% depreciable basis × 25% tax rate): -$64,125
- **First-year effective tax benefit: $214,125** (43% of system cost recovered Year 1)

**Demand Charge Reduction: The Hidden Goldmine**

Commercial electricity bills include two components: energy charges (per kWh) and demand charges (per kW of peak demand). Demand charges often represent 30–50% of commercial bills. Solar paired with battery storage can "shave" peak demand windows, directly reducing demand charges.

A 500kW commercial system with 500kWh battery storage can eliminate $8,000–$15,000/month in demand charges alone in markets like California, New York, and Australia.

**Power Purchase Agreements (PPAs)**

For businesses that prefer zero upfront capital, PPAs allow a solar developer to install and own the system on your roof, selling you electricity at a fixed rate (typically 15–25% below current grid rate) for 15–25 years. You get immediate bill savings with no capital outlay. The developer claims the ITC and depreciation benefits.

**Indian Commercial Market: Special Economic Zones**

Indian businesses in SEZs and manufacturing facilities can claim:
- 40% accelerated depreciation in Year 1 under IT Act Section 32
- GST input credit on solar components
- Wheeling arrangements for multi-location businesses

**ROI Modeling Framework**

For a 1MW commercial installation in Texas:
- System cost: $1,000,000
- ITC: -$300,000
- MACRS benefit (5yr): -$175,000
- **Net effective cost: $525,000**
- Annual savings (avoided grid cost at $0.12/kWh, 1,400,000 kWh/yr): $168,000
- **Payback: 3.1 years** | **25-year IRR: 22.4%**`
  },
  {
    id: 'bifacial-vs-monofacial',
    slug: 'bifacial-vs-monofacial',
    title: 'Bifacial vs. Monofacial Solar Panels: Which Yields Better ROI in 2026?',
    excerpt: 'Real-world albedo gain data from installations in Australia, India, and Germany — when bifacial panels\'s 5–15% output premium justifies their higher cost, and when it doesn\'t.',
    category: 'Technology',
    date: 'May 10, 2026',
    readTime: '7 min read',
    author: 'R. Panchal',
    featured: false,
    image: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?q=80&w=1400&auto=format&fit=crop',
    tags: ['Bifacial', 'Panels', 'Efficiency', 'ROI'],
    content: `Bifacial solar panels — which generate electricity from both front and rear surfaces — have moved from niche technology to mainstream in utility-scale solar. But for residential rooftops, the calculus is more nuanced.

**How Bifacial Panels Work**

Standard monofacial panels have an opaque backsheet, absorbing only direct sunlight. Bifacial panels use transparent glass (or clear backsheet) on the rear, allowing them to capture:
- Albedo light (sunlight reflected from ground/roof surface)
- Diffuse sky radiation from below

The rear gain (called "bifacial gain") typically ranges from 5–30%, depending entirely on what's beneath the panels.

**Albedo by Surface Type**
- White gravel/concrete roof: 25–35% gain
- Light-colored membrane roof: 15–25% gain
- Standard grey asphalt shingle: 8–12% gain
- Green lawn/grass: 10–15% gain
- Dark tile roof: 3–6% gain (bifacial provides minimal benefit)

**Real-World Test Data (2025–2026)**

*Gujarat, India (white concrete rooftop, tilted rack):*
- Monofacial 400W: 1,820 kWh/kWp/year
- Bifacial 400W: 2,080 kWh/kWp/year (+14.3%)

*Bavaria, Germany (grey tile roof, flush-mounted):*
- Monofacial 400W: 1,150 kWh/kWp/year
- Bifacial 400W: 1,195 kWh/kWp/year (+3.9%)

*Queensland, Australia (light gravel, 15° tilt):*
- Monofacial 410W: 1,940 kWh/kWp/year
- Bifacial 410W: 2,180 kWh/kWp/year (+12.4%)

**Cost Premium Analysis**

In 2026, bifacial panels carry a 10–18% price premium over equivalent monofacial modules. The ROI calculation:

For a 6kW system on a dark tile roof in Germany:
- Bifacial premium: €800 extra
- Additional annual output: 270 kWh × €0.28/kWh = €75.6/year
- **Payback on premium: 10.6 years** — not compelling

For a 6kW system on white concrete in Gujarat, India:
- Bifacial premium: ₹15,000 extra
- Additional annual output: 1,560 kWh × ₹8/kWh = ₹12,480/year
- **Payback on premium: 1.2 years** — exceptional

**Verdict:** Bifacial panels make strong financial sense in high-albedo environments (white roofs, ground mounts over gravel/concrete). On dark shingle or tile rooftops in northern climates, the premium rarely pays off within the panel's warranty period.`
  },
  {
    id: 'solar-financing-options-2026',
    slug: 'solar-financing-options-2026',
    title: 'Solar Financing in 2026: Cash, Loan, Lease, or PPA — Which Makes You the Most Money?',
    excerpt: 'A rigorous financial comparison of all four ways to go solar — including 25-year NPV analysis, tax benefit ownership, and why most financial advisors now recommend loans over leases.',
    category: 'Finance',
    date: 'May 8, 2026',
    readTime: '10 min read',
    author: 'Grid Pulse Analytics',
    featured: false,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1400&auto=format&fit=crop',
    tags: ['Financing', 'Loan', 'Lease', 'PPA', 'Cash'],
    content: `How you pay for solar is almost as important as which panels you choose. The financing structure determines who captures the tax benefits, how quickly you break even, and your total 25-year return.

**Option 1: Cash Purchase**
The highest upfront cost, the best long-term return.
- You own the system outright
- You claim the 30% ITC directly
- Average 25-year NPV (net present value of savings): $45,000–$65,000 on a $15,000 system in the US
- Best for: Homeowners with available capital and a tax liability to offset

**Option 2: Solar Loan**
The fastest-growing financing method — and usually the smartest for most homeowners.
- $0 down, you own the system and claim the ITC
- Typical rates: 4.99–7.99% (Mosaic, Sunlight Financial, GreenSky)
- Critical advice: Use the ITC refund (you receive it in your Year 1 tax filing) to pay down the loan principal immediately — many loan products are structured with a dealer fee that balloons if you don't apply the tax credit within 18 months
- Average 25-year NPV: $30,000–$50,000 (slightly less than cash due to interest)

**Option 3: Solar Lease**
You pay a fixed monthly amount to "rent" the solar system on your roof.
- No upfront cost, no ownership, no ITC benefit
- Installer claims all tax incentives
- Savings are real but modest (typically 10–20% below current electricity rate)
- Major risk: Lease terms of 20–25 years complicate home sales and refinancing
- Average 25-year NPV: $8,000–$18,000 — significantly lower than ownership options

**Option 4: Power Purchase Agreement (PPA)**
Similar to lease, but you pay per kWh generated (typically $0.08–$0.12/kWh) rather than a fixed monthly fee.
- No upfront cost, savings are immediate if grid rate exceeds PPA rate
- Annual escalators of 1–3% built into most PPAs — beneficial if grid rates rise faster
- Same ownership and home-sale complications as leases
- Average 25-year NPV: $10,000–$22,000

**India-Specific: MNRE Subsidized Loans**
The PM Surya Ghar scheme includes access to collateral-free loans at 7% interest through nationalized banks. Combined with the direct subsidy, this is the most accessible path for middle-income Indian families — effective cost after subsidy + loan is equivalent to ₹1,500–₹2,000/month for a 3kW system, which most households recover in electricity savings within 18–24 months.

**The Verdict**
If you have the capital: Cash purchase. If not: Solar loan. Never lease if you have any alternative — you surrender the tax benefits and build no asset equity.`
  },
  {
    id: 'solar-myths-debunked-2026',
    slug: 'solar-myths-debunked-2026',
    title: '12 Solar Myths Debunked by Engineers in 2026',
    excerpt: '"Solar doesn\'t work on cloudy days." "Solar panels need direct sunlight." "You need to replace them every 10 years." We dismantle the most persistent solar misconceptions with real data.',
    category: 'Education',
    date: 'May 6, 2026',
    readTime: '8 min read',
    author: 'Grid Pulse Analytics',
    featured: false,
    image: 'https://images.unsplash.com/photo-1580508174046-170816f65662?q=80&w=1400&auto=format&fit=crop',
    tags: ['Myths', 'Education', 'Facts', 'Beginner'],
    content: `Solar energy is surrounded by myths that range from harmless misconceptions to genuinely harmful misinformation that prevents people from making beneficial financial decisions. Let's set the record straight.

**Myth 1: "Solar panels don't work on cloudy days."**
Reality: They absolutely do, just at reduced efficiency. Germany — famously one of the cloudiest countries in Europe — is the world's fourth-largest solar producer. Panels work on diffuse light, not just direct sunlight. A typical panel produces 10–25% of its rated output on overcast days. Germany's Bavarian systems average 1,100–1,200 kWh/kWp/year despite cloud cover.

**Myth 2: "Solar panels don't produce enough energy to pay back the energy used to make them."**
Reality: The Energy Payback Period (EPBT) for modern silicon panels is 1.5–2.5 years. With a 25–30 year operational lifespan, panels produce 10–20x the energy used in their manufacture. The energy return on investment (EROI) for solar is now similar to natural gas and far exceeds coal.

**Myth 3: "Solar panels need to be replaced every 10 years."**
Reality: Quality solar panels from Tier-1 manufacturers (LONGi, JA Solar, Jinko, SunPower) are warranted for 25 years with less than 20% degradation. Real-world data from early 2000s installations shows panels still producing 85–90% of original output after 20+ years. The panels will almost certainly outlast the warranty.

**Myth 4: "You need a south-facing roof."**
Reality: South-facing (in the northern hemisphere) is optimal, but east and west roofs lose only 15–20% of output. Even north-facing roofs in high-irradiance climates like Australia and India can be economically viable.

**Myth 5: "Solar isn't worth it in cold climates."**
Reality: Solar panels are actually more efficient in cold weather. Photovoltaic cells produce more electricity at lower temperatures — hot summers paradoxically reduce output. Canada, Scandinavia, and Alaska all have viable solar markets.

**Myth 6: "Installing solar will damage my roof."**
Reality: Properly installed solar panels protect your roof. They shield the surface below from UV degradation, rain, and hail. The mounting hardware, when installed by a certified professional, seals penetrations against water ingress. Most solar companies offer roof warranty coverage alongside their panel warranty.

**Myth 7: "Battery storage is essential."**
Reality: Grid-tied solar without storage is fully functional and often provides better financial returns than grid-tied + battery, particularly in markets with strong net metering. Battery storage makes sense primarily in markets with declining export rates (California post-NEM 3.0), frequent outages (India, parts of South Africa), or high time-of-use price spreads.`
  },
  {
    id: 'solar-insurance-guide',
    slug: 'solar-insurance-guide',
    title: 'Does Your Home Insurance Cover Solar Panels? The Complete 2026 Guide',
    excerpt: 'What your homeowner\'s policy actually covers, what voids coverage, specialist solar insurance options, and how to ensure your system is protected against storm, hail, theft, and equipment failure.',
    category: 'Finance',
    date: 'May 4, 2026',
    readTime: '6 min read',
    author: 'Grid Pulse Analytics',
    featured: false,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1400&auto=format&fit=crop',
    tags: ['Insurance', 'Home', 'Protection', 'Claims'],
    content: `Solar panels represent a $10,000–$30,000 investment on your roof. Understanding how they're covered — and more importantly, how they might not be — could save you from a financially devastating claim denial.

**What Standard Home Insurance Typically Covers**
Most standard homeowner's policies (in the US, UK, and Australia) automatically extend to cover permanently attached solar panels as part of the dwelling structure. This typically includes:
- Storm damage (wind, hail, lightning)
- Fire damage
- Vandalism
- Falling objects (trees, debris)

Coverage is usually at replacement cost value (RCV) rather than actual cash value (ACV) if your policy includes that provision.

**What's Often Excluded or Limited**
- Gradual degradation and output decline
- Mechanical or electrical breakdown (unless you have equipment breakdown rider)
- Flood damage (requires separate flood insurance)
- Damage from panels installed by an uncertified contractor
- Systems that increase your home's insured value beyond policy limits

**The Underinsurance Problem**
This is where most solar owners get caught. If your home is insured for $400,000 and you add $20,000 of solar panels without notifying your insurer, you may be underinsured. Always call your insurance provider before and after installation.

**Equipment Breakdown Coverage**
Standard policies don't cover inverter failure, wiring faults, or gradual performance degradation. An equipment breakdown endorsement (typically $30–$60/year additional premium) covers sudden electrical/mechanical failure. Given that inverters cost $1,500–$4,000 to replace, this endorsement pays for itself after one claim.

**India-Specific: Marine Transit + Installaton Coverage**
In India, solar equipment is often covered separately during transit and installation. Most EPC contractors offer short-term transit + erection-all-risk (EAR) insurance. After installation, ensure your system is added to your home structure policy or commercial property insurance. Specialised solar insurance products from New India Assurance, SBI General, and ICICI Lombard are now available.

**Hail-Specific Coverage**
Following major hailstorm events in Texas (2024) and Queensland (2025) that destroyed thousands of solar installations, several US and Australian insurers have introduced hail exclusions or sub-limits for solar. Check your policy specifically for hail coverage language and consider IEC 61215-certified hail-resistant panels (tested to 35mm hailstone impact) in high-risk areas.`
  },
  {
    id: 'solar-africa-middle-east-2026',
    slug: 'solar-africa-middle-east-2026',
    title: 'Solar Energy Boom in Africa and the Middle East: The World\'s Fastest-Growing Solar Markets',
    excerpt: 'Saudi Arabia\'s NEOM, Morocco\'s Ouarzazate megaproject, South Africa\'s REIPPP — why the sunbelt is becoming the world\'s most dynamic solar investment frontier in 2026.',
    category: 'Global Markets',
    date: 'May 2, 2026',
    readTime: '9 min read',
    author: 'Grid Pulse Analytics',
    featured: false,
    image: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=1400&auto=format&fit=crop',
    tags: ['Africa', 'Middle East', 'Global', 'Emerging Markets'],
    content: `The world's solar growth story is rapidly shifting from China, Germany, and the US to the sunbelt regions of Africa and the Middle East — areas with irradiance levels 40–60% higher than Europe, combined with rapidly declining installation costs and urgent electrification needs.

**Saudi Arabia: From Oil Exporter to Solar Superpower**

Saudi Arabia's Vision 2030 targets 50% renewable electricity by 2030. The Al Shuaibah project (2,600 MW, completed 2025) became one of the world's largest solar plants. More remarkably, Saudi Arabia achieved a world-record low tariff of $0.0104/kWh in the Al Shuaibah 2 tender — demonstrating that the Middle East's combination of high irradiance, flat terrain, and low labor costs creates unrivaled solar economics.

The NEOM smart city project integrates 4GW of solar into a grid that will power an entirely renewable city of 500,000+ residents by 2030.

**Morocco: Africa's Solar Pioneer**

Noor Ouarzazate, the world's largest concentrated solar power (CSP) complex, provides dispatchable solar power 20 hours a day using molten salt thermal storage. Morocco now exports clean electricity to Spain and Portugal via undersea cable, establishing itself as a green energy exporter — a model other African nations are adopting.

**South Africa: REIPPP and the Loadshedding Solution**

South Africa's rolling blackouts (loadshedding) — up to 12 hours daily in 2023–2024 — created explosive demand for rooftop solar. Residential installations grew 400% in 2024. The government's REIPPP (Renewable Energy Independent Power Producer Procurement Programme) has accelerated utility-scale projects, with 6GW of new solar capacity under construction.

**Kenya and East Africa: Decentralized Solar Leading**

Kenya has become a global leader in off-grid solar through mobile money financing (M-PESA-linked solar loans from SunCulture, M-KOPA, and D.light). Over 4 million households now have solar home systems — financed in daily micropayments as low as $0.30/day. This pay-as-you-go model is the developing world's most successful renewable energy deployment mechanism.

**Investment Opportunity**

For international investors, the Middle East and Africa represent the highest unsubsidized solar ROI globally: ultra-low tariff competition is driving efficiency improvements, and utility-scale PPAs in UAE, Saudi Arabia, and Morocco offer 6–8% USD-denominated yields with 25-year sovereign-backed offtake agreements.`
  },
  {
    id: 'agrivoltaics-farming-solar-2026',
    slug: 'agrivoltaics-farming-solar-2026',
    title: 'Agrivoltaics: How Farmers Are Doubling Income by Growing Crops Under Solar Panels',
    excerpt: 'The science and economics of combining agriculture with solar generation — better crop yields under panel shade, higher farmer income per acre, and $50B in global investment flowing into agri-solar.',
    category: 'Innovation',
    date: 'April 30, 2026',
    readTime: '8 min read',
    author: 'Grid Pulse Analytics',
    featured: false,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1400&auto=format&fit=crop',
    tags: ['Agrivoltaics', 'Farming', 'Innovation', 'Land Use'],
    content: `Agrivoltaics — the simultaneous use of land for both solar energy generation and agriculture — is one of the most exciting developments in sustainable land use. Rather than competing for farmland, solar panels and crops can work synergistically.

**The Science of Shade and Productivity**

Research from the University of Arizona, Fraunhofer Institute (Germany), and ICAR (India) consistently shows that partial shading from elevated solar panels benefits many crops:

- **Lettuce, spinach, herbs**: Prefer partial shade. Yield increases of 50–100% under agrivoltaic panels vs. open field.
- **Tomatoes, peppers**: 20–30% yield increase due to reduced heat stress.
- **Wheat and grain crops**: Slightly reduced yield (5–10%) but compensated by solar income.
- **Lavender, saffron (premium crops)**: Exceptional compatibility — high value per m² matches solar income potential.

**The Economics: Land Equivalent Ratio**

The Land Equivalent Ratio (LER) measures how much land would be needed separately to produce the same combined output. Agrivoltaic systems consistently achieve LERs of 1.3–1.8 — meaning the combined system produces 30–80% more value from the same land than separate solar farm + separate crop field.

**Financial Model: 1-Acre Agrivoltaic System, India**

- Solar installation: 150kW at ₹1,50,000/kW = ₹2.25 crore
- Annual solar income (net metering / sale): ₹18–22 lakh
- Annual crop income (tomatoes, herbs): ₹8–15 lakh
- **Total annual income: ₹26–37 lakh**
- vs. conventional farming alone: ₹4–8 lakh/acre

**Policy Support**

India's MNRE launched an agrivoltaic pilot program in 2025, subsidizing elevated panel structures specifically designed for crop co-location. The EU's Common Agricultural Policy (CAP) now allows agrivoltaic systems without losing agricultural subsidy designation — a critical policy change that unlocked significant European investment.

Germany, France, Japan, and South Korea have all deployed commercial-scale agrivoltaic projects exceeding 10MW. The global agrivoltaics market is projected to reach $15 billion by 2030.`
  },
  {
    id: 'heat-pump-solar-combination',
    slug: 'heat-pump-solar-combination',
    title: 'Solar + Heat Pump: The Most Efficient Home Heating and Cooling System in 2026',
    excerpt: 'Why combining a heat pump with solar panels eliminates both your electricity and gas bills — the COP math, sizing guide, and real savings data from the UK, Germany, Canada, and Australia.',
    category: 'Technology',
    date: 'April 28, 2026',
    readTime: '9 min read',
    author: 'Grid Pulse Analytics',
    featured: false,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1400&auto=format&fit=crop',
    tags: ['Heat Pump', 'Heating', 'Cooling', 'Electrification'],
    content: `The solar + heat pump combination represents the single most impactful home energy upgrade available. While solar handles your electricity, heat pumps handle your largest remaining energy cost — heating and cooling — at 2–4x the efficiency of traditional gas boilers or resistance electric heaters.

**How Heat Pumps Work: The COP Advantage**

A heat pump moves heat rather than generating it. By extracting low-grade heat from outdoor air (even at -15°C) and compressing it to useful temperatures, modern heat pumps achieve a Coefficient of Performance (COP) of 2.5–4.5. This means for every 1 kWh of electricity consumed, you get 2.5–4.5 kWh of heat.

Compare to:
- Gas boiler: 0.85–0.95 kWh heat per kWh of fuel
- Electric resistance heater: 1.0 kWh heat per kWh electricity
- Air-source heat pump (modern): 3.0–4.2 kWh heat per kWh electricity

**Solar Synergy**

A 3kW heat pump running 8 hours/day consumes 24 kWh. A 5–6kW solar system in the UK generates 18–22 kWh on a sunny winter day. The combination means your heating system runs largely on free solar electricity.

The key insight: heat pump demand peaks in morning and evening, while solar produces midday. A small battery or water tank thermal storage buffer (much cheaper than battery storage) allows you to shift solar electricity into heat for use throughout the day.

**Real Savings Data**

*UK household (replacing gas boiler, 3-bed home):*
- Gas heating cost: £1,400/year
- Electric heat pump (grid electricity): £700–£900/year
- Electric heat pump + 5kW solar: £150–£250/year
- **Net annual saving vs gas: £1,150–£1,250**

*Germany (replacing oil heating):*
- Oil heating: €2,200/year
- Heat pump + 8kW solar: €200–€400/year
- **Net saving: €1,800–€2,000/year**

**Sizing Guide**

Heat pump sizing depends on heat loss calculations (Manual J in the US, SAP in UK). Rule of thumb:
- Well-insulated modern home: 4–6kW heat pump
- Older poorly-insulated home: 8–12kW (but insulation upgrades first are more cost-effective)
- Solar addition for heat pump: Match array size to 60–80% of annual heat pump electricity consumption

**The All-Electric Home**

Solar + heat pump + EV charging + induction cooking = complete elimination of gas dependence. The fully electrified home running on solar is the most resilient energy configuration available to consumers in 2026.`
  },
  {
    id: 'solar-grid-parity-reached',
    slug: 'solar-grid-parity-reached',
    title: 'Grid Parity Reached: Solar is Now the Cheapest Electricity in History — What This Means for You',
    excerpt: 'The IEA confirmed solar hit $0.017/kWh in competitive tenders. Cheaper than coal, gas, and nuclear. Here\'s how the price collapse happened and what comes next.',
    category: 'Industry',
    date: 'April 26, 2026',
    readTime: '7 min read',
    author: 'Grid Pulse Analytics',
    featured: false,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1400&auto=format&fit=crop',
    tags: ['Grid Parity', 'Cost', 'Industry', 'IEA'],
    content: `In October 2025, the International Energy Agency published its World Energy Outlook confirming what analysts had been predicting since 2019: solar photovoltaic electricity from new utility-scale projects is now the cheapest form of electricity generation ever recorded in human history.

**The Numbers**

- Lowest recorded solar PPA price: $0.0104/kWh (Saudi Arabia Al Shuaibah 2, 2025)
- Global weighted average utility-scale solar LCOE: $0.029/kWh (2026)
- New coal plant LCOE: $0.065–$0.15/kWh
- New gas combined cycle LCOE: $0.045–$0.085/kWh
- New nuclear LCOE: $0.093–$0.155/kWh

Solar is now cheaper than operating existing coal plants in most of the world.

**How Did the Price Collapse Happen?**

Three concurrent learning curves:
1. **Manufacturing scale**: China's panel production capacity grew from 10GW in 2010 to 1,000GW annually by 2025, creating economies of scale that permanently reset global panel prices.
2. **Efficiency improvements**: Average commercial panel efficiency went from 14% (2010) to 22–23% (2026), meaning the same factory produces 65% more electricity capacity.
3. **Soft cost reduction**: Installation, permitting, and financing costs have declined as installers gained experience and digital permitting reduced labor time.

**The Stranded Asset Problem**

Utilities globally now face a structural challenge: their existing fossil fuel power plants are worth less than their debt. Any coal or gas plant with >15 years of remaining life is at significant risk of becoming a stranded asset — operating at an economic loss compared to building new solar.

This dynamic is accelerating solar deployment faster than policy alone could achieve.

**What This Means for Homeowners**

Paradoxically, the lowest-cost electricity generation doesn't automatically mean lower retail bills — grid infrastructure, distribution, and policy costs keep retail rates elevated. This is exactly why rooftop solar, which bypasses the utility markup, provides such compelling returns at the household level even as wholesale electricity costs fall.

The grid parity moment means continued panel price declines, accelerating adoption, and increasing competition among installers — all of which benefit homeowners installing systems today.`
  },
  {
    id: 'solar-water-heater-guide',
    slug: 'solar-water-heater-guide',
    title: 'Solar Water Heaters vs. Solar PV for Hot Water: Which Is Right for Your Home?',
    excerpt: 'Solar thermal vs PV comparison — efficiency, cost, maintenance, hybrid systems, and when each technology makes financial sense for Indian, Australian, and European households.',
    category: 'Technology',
    date: 'April 24, 2026',
    readTime: '6 min read',
    author: 'Grid Pulse Analytics',
    featured: false,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1400&auto=format&fit=crop',
    tags: ['Water Heater', 'Solar Thermal', 'Hot Water', 'Comparison'],
    content: `Hot water typically represents 15–25% of a household's total energy consumption. Solar energy can eliminate this cost entirely — but there are two fundamentally different technologies to consider.

**Solar Thermal Water Heaters**

Solar thermal systems use roof-mounted collectors to directly heat water via sunlight. There are two main types:

*Flat Plate Collectors (FPC):*
- Simpler, cheaper, more durable
- Work well in temperatures above 0°C
- Efficiency: 60–70% of solar energy converted to heat
- Cost: ₹15,000–₹35,000 in India; $3,000–$5,000 in Australia

*Evacuated Tube Collectors (ETC):*
- Better performance in cold and overcast conditions
- Efficiency: 70–80%
- More fragile (glass tubes can crack)
- Cost: ₹20,000–$45,000 in India; AUD $4,000–$7,000 in Australia

**Solar PV + Heat Pump Water Heater**

The modern alternative: a PV array powers a heat pump water heater (HPWH), which uses refrigeration-cycle technology to move heat into water at 3–4x the efficiency of a resistance element.

*Effective efficiency:*
- Solar panel: 21% efficient
- Heat pump water heater: COP 3.5
- Combined: 21% × 3.5 = 73.5% of solar irradiance converted to heat

This matches or exceeds solar thermal efficiency while offering the flexibility of using excess PV for other loads.

**India-Specific Analysis**

India's MNRE subsidises solar water heaters at 30% of system cost (up to ₹8,000 for 100LPD systems). For households in high-irradiance states (Rajasthan, Gujarat, Tamil Nadu), solar water heaters offer the fastest payback of any renewable energy technology: often 2–3 years.

The ETC-type system dominates the Indian market, with Racold, V-Guard, and Supreme being leading brands.

**The Verdict**

- If you already have a PV system: Add a heat pump water heater diverter to use excess solar for hot water (cheapest option).
- If starting fresh in India: Dedicated solar thermal is the most cost-effective route to free hot water.
- In cold climates: PV + HPWH outperforms solar thermal in winter conditions.`
  },
  {
    id: 'rooftop-solar-rental-properties',
    slug: 'rooftop-solar-rental-properties',
    title: 'Solar for Landlords: How to Install Solar on Rental Properties and Who Keeps the Savings',
    excerpt: 'Landlord-tenant solar split incentives, green lease clauses, solar-as-amenity premium rents, PACE financing, and how to structure deals that work for both landlord and tenant.',
    category: 'Finance',
    date: 'April 22, 2026',
    readTime: '8 min read',
    author: 'Grid Pulse Analytics',
    featured: false,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1400&auto=format&fit=crop',
    tags: ['Landlord', 'Rental', 'Investment', 'PACE'],
    content: `The "split incentive problem" has historically made solar installation on rental properties rare: the landlord pays for the system but the tenant receives the electricity savings. In 2026, new financing structures and evolving lease formats are breaking down this barrier.

**The Green Lease Solution**

A green lease (or "eco-addendum") is a lease modification that explicitly addresses energy improvements. Under a properly structured green lease:
- Landlord installs solar system
- Tenant pays a "solar fee" — fixed monthly amount below their previous average electricity bill
- Landlord uses the solar fee to service the solar loan
- Both parties benefit: landlord receives loan-covering cash flow + asset value increase; tenant pays less than before

Example: Tenant was paying $220/month in electricity. Landlord installs solar. Tenant now pays $140/month "solar contribution" (saving $80/month). Landlord uses the $140 to service the solar loan and after loan payoff (7–8 years), the system generates pure profit.

**Property Value Premium**

A Lawrence Berkeley National Laboratory study found solar panels increase home value by an average of $15,000 in the US. For multi-family rental properties, the premium translates directly to cap rate improvement — a $15,000 value increase on a property with a 5% cap rate is equivalent to $750/year in additional rent.

In the UK, properties with solar (and good EPC ratings) command 2–4% rent premiums according to Rightmove data.

**PACE Financing (US)**

Property Assessed Clean Energy financing allows landlords to finance solar through a property tax assessment — repaid as part of annual property tax. Key advantages:
- No personal credit requirement
- Transfers with the property on sale
- Doesn't count as debt on personal balance sheet
- Available in California, Florida, Texas, and 30+ other states

**Indian Rental Context**

In India, solar is increasingly installed by housing societies (apartment complexes) rather than individual flat owners. Society-level rooftop solar systems in Maharashtra and Karnataka distribute savings equally across all flats via reduced maintenance charges — an elegant collective solution.

**Tax Considerations**

In the US, rental property solar qualifies for the 30% ITC and MACRS depreciation — the same commercial benefits. Unlike primary residence solar, rental property solar costs are fully deductible as a business expense. Depreciation recapture applies on sale but is typically offset by the value appreciation.`
  }
];

const CATEGORIES = ['All', 'Finance', 'Technology', 'Policy', 'Maintenance', 'EV + Solar', 'Off-Grid', 'Education', 'Global Markets', 'Innovation', 'Industry'];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Finance: <TrendingUp className="w-3 h-3" />,
  Technology: <Zap className="w-3 h-3" />,
  Policy: <Globe className="w-3 h-3" />,
  Education: <BookOpen className="w-3 h-3" />,
  'EV + Solar': <Battery className="w-3 h-3" />,
  'Off-Grid': <Sun className="w-3 h-3" />,
  Innovation: <Leaf className="w-3 h-3" />,
  Industry: <TrendingUp className="w-3 h-3" />,
  'Global Markets': <Globe className="w-3 h-3" />,
  Maintenance: <Zap className="w-3 h-3" />,
};

interface BlogHubProps {
  onSelectArticle: (id: string) => void;
  onBack: () => void;
}

export default function BlogHub({ onSelectArticle, onBack }: BlogHubProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 6;

  const filtered = selectedCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === selectedCategory);

  const featured = ARTICLES.filter(a => a.featured).slice(0, 2);
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hasMore = filtered.length > INITIAL_COUNT && !showAll;

  return (
    <div className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-4 py-6 flex flex-col gap-10">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono text-amber-400 hover:text-amber-300 mb-3 bg-transparent border-none cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            RETURN TO FORECASTER
          </button>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-glass-title font-bold text-slate-100">
              Solar Intelligence Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-glass-body mt-2 max-w-3xl">
            Expert guides, financial analysis, technology breakdowns, and global policy updates for solar energy in 2026 — written for homeowners, investors, and professionals worldwide.
          </p>
        </div>
        <div className="shrink-0 text-right hidden sm:block">
          <div className="text-3xl font-black text-amber-400 font-mono">{ARTICLES.length}</div>
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Expert Articles</div>
        </div>
      </div>

      {/* ── FEATURED HERO (2-col) ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-amber-500 rounded-full" />
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">Featured This Week</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.map((article) => (
            <FeaturedCard key={article.id} article={article} onSelect={onSelectArticle} />
          ))}
        </div>
      </div>

      {/* ── CATEGORY FILTER PILLS ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-slate-600 rounded-full" />
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Browse by Category</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => { setSelectedCategory(cat); setShowAll(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wide transition-all duration-200 border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {CATEGORY_ICONS[cat] && <span className="opacity-70">{CATEGORY_ICONS[cat]}</span>}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── ARTICLE GRID ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-slate-600 rounded-full" />
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              {selectedCategory === 'All' ? 'All Articles' : selectedCategory} · {filtered.length} articles
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {visible.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <BlogCard article={article} onSelect={onSelectArticle} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── SHOW MORE BUTTON ── */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <p className="text-xs text-slate-500 font-mono">
              Showing {visible.length} of {filtered.length} articles
            </p>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500/10 to-amber-500/5 hover:from-amber-500/20 hover:to-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 text-amber-400 text-xs font-mono font-black tracking-widest uppercase rounded-2xl transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
            >
              <ChevronDown className="w-4 h-4" />
              Show {filtered.length - INITIAL_COUNT} More Articles
            </button>
          </motion.div>
        )}

        {showAll && filtered.length > INITIAL_COUNT && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => { setShowAll(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-xs font-mono text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
            >
              ↑ Show Less
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED CARD (tall, hero-style)
// ─────────────────────────────────────────────────────────────────────────────
function FeaturedCard({ article, onSelect }: { article: typeof ARTICLES[0]; onSelect: (id: string) => void }) {
  const [imgSrc, setImgSrc] = useState(article.image);
  const FALLBACK = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1400&auto=format&fit=crop';

  return (
    <div
      onClick={() => onSelect(article.id)}
      className="relative rounded-[24px] overflow-hidden cursor-pointer group h-[340px] sm:h-[400px] border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
    >
      <img
        src={imgSrc}
        alt={article.title}
        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
        onError={() => setImgSrc(FALLBACK)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 bg-amber-500 text-black text-[9px] font-black font-mono uppercase tracking-widest rounded-md">
            {article.category}
          </span>
          <span className="text-[10px] font-mono text-white/60">{article.readTime}</span>
        </div>
        <h2 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-3 group-hover:text-amber-300 transition-colors">
          {article.title}
        </h2>
        <p className="text-xs text-white/60 mt-2 line-clamp-2 leading-relaxed">{article.excerpt}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-[10px] font-mono text-white/40 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {article.date}
          </span>
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">Read Article →</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STANDARD BLOG CARD
// ─────────────────────────────────────────────────────────────────────────────
function BlogCard({ article, onSelect }: { article: typeof ARTICLES[0]; onSelect: (id: string) => void }) {
  const FALLBACK = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop';
  const [imgSrc, setImgSrc] = useState(article.image);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 bg-slate-900/20 flex flex-col h-full hover:border-amber-500/20 transition-all duration-300 group shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={imgSrc}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          onError={() => setImgSrc(FALLBACK)}
        />
        <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-md text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider">
          {article.category}
        </div>
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-md text-[9px] font-mono text-slate-300 uppercase tracking-wider">
          {article.readTime}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
            <span className="text-slate-600">·</span>
            <span>{article.author}</span>
          </div>
          <h2 className="text-sm font-bold text-slate-100 font-glass-title group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h2>
          <p className="text-xs text-slate-400 font-glass-body line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex flex-wrap gap-1 pt-1">
            {article.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[9px] font-mono text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onSelect(article.id)}
          className="w-full text-center py-2.5 rounded-xl border border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 text-xs font-mono font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer"
        >
          Read Full Article →
        </button>
      </div>
    </div>
  );
}
