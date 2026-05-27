export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  image: string;
}

export const articlesData: Article[] = [
  {
    id: "pm-surya-ghar-subsidy-guide",
    title: "Step-by-Step Guide: How to Track Your PM Surya Ghar Application Status",
    description: "Learn how to navigate the national solar portal, interpret internal DISCOM engineering review logs, and avoid regional net-metering processing bottlenecks.",
    date: "2026-05-27",
    image: "https://images.unsplash.com/photo-1620027131499-1658db4f7017?q=80&w=1200&auto=format&fit=crop",
    content: `The introduction of the PM Surya Ghar Muft Bijli Yojana has transformed residential energy architectures across India. However, navigating the bureaucratic and engineering checkpoints from original system registration down to final Direct Benefit Transfer (DBT) subsidy disbursement requires strict tracking. 

If your installation timeline has hit a processing bottleneck, here is the technical breakdown of how to check your tracking coordinates and isolate exactly where your application node is sitting.

### Phase 1: Accessing the National Telemetry Interface
To check the live state parameters of your submission, you must query the centralized government registry:
1. Direct your browser layout to the official node: pmsuryaghar.gov.in
2. Execute a "Consumer Login" handshake using your registered primary phone identification or specialized utility consumer string.
3. Authenticate using the one-time network token (OTP).
4. Navigate straight to your primary workflow dashboard telemetry layout.

### Phase 2: Decoding the Processing Pipeline States
Your tracker panel will display one of six specific tracking states. Understanding what each variable means allows you to optimize your follow-up approach:

1. "Application Submitted" // State: Active Verification
Your initial layout, identity parameters, and attached regional electricity logs have cleared the centralized validation queue and are being packed for edge routing.

2. "DISCOM Feasibility Check" // State: Technical Audit
Your local power distribution provider (DISCOM) is reviewing your transformer capacity and infrastructure load lines. They evaluate if your neighborhood power matrix can safely handle your photovoltaic backfeeding injection without overloading localized lines.

3. "Vendor Selection Pending" // State: Action Required
Your structural parameters passed the audit! You now have a window to log into the portal list and explicitly bind your project parameters to an empaneled, registered solar engineering firm. Subsidies are automatically voided if you source hardware from non-registered alternative markets.

4. "Net Metering Paperwork and Inspection" // State: Physical Verification
Once your selected engineering crew finishes mounting the panels, your vendor submits hardware compliance sheets. DISCOM field agents will arrive to run quality safety diagnostics on your inverter grounding and install a bi-directional net meter.

5. "Commissioning Certificate Issued" // State: System Authorized
The legal milestone. The DISCOM signs off on your grid injection configuration and changes your account configuration to track feed-in clean energy tariffs.

### Phase 3: The Subsidy Acceleration Plan
Once your commissioning certificate registers as active in your telemetry line, click "Apply for Subsidy" on your dashboard. Upload a high-resolution, clear digital scan of a cancelled cheque or bank passbook. 

Ensure the name printed exactly matches your utility electrical account file profile. Under current 2026 MNRE processing standards, clear direct deposits land in linked accounts within 30 to 45 business days. Keep tabs on your regional DISCOM desk every 10 days to ensure a smooth configuration lifecycle!`
  },
  {
    id: "commercial-solar-payback-period",
    title: "Is a 3kW Solar Rooftop System Enough for a 4-Bedroom House?",
    description: "An engineering breakdown of monthly unit consumption versus solar generation metrics for residential setups.",
    date: "2026-05-25",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
    content: "Full analytical contents for article two will go here..."
  }
];
