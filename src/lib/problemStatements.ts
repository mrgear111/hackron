export const problemStatements = [
    {
        id: 1,
        title: "Advanced Decision-Making in Road Logistics",
        description: "Road logistics is still planned as isolated trips rather than as a continuous operation. Teams must design an agentic system that continuously observes, decides, and acts on logistics operations as an adaptive process. The system should reason about future outcomes, balance profitability and time, and support decision-making for both drivers and operators. Focus on decision intelligence and adaptability.",
        domain: "Logistics & AI",
        fullDescription: `Problem:
Road logistics is still planned as isolated trips rather than as a continuous operation across a vehicle’s day or an operator’s fleet. Load matching, routing, and pricing are decided upfront, with little ability to adapt once a truck is already on the road. As conditions change—traffic, fuel costs, delivery delays, or new load availability—trucks often run underutilized or return empty.

User Reality:
Truck drivers face idle time, uncertain income, and empty return journeys. Fleet operators managing multiple trucks struggle to coordinate vehicles that are in different locations, at different stages of a trip, and under different constraints.

Expectation:
Design an agentic system that continuously observes, decides, and acts on logistics operations as an adaptive process. The system should:
- Reason about future outcomes while vehicles are already in motion
- Balance profitability, time, capacity utilization, and operational constraints
- Support decision-making for both individual drivers and multi-truck operators`,
    },
    {
        id: 2,
        title: "Continuous Decision-Making for Risk-Aware Trading",
        description: "Stock trading is often treated as a sequence of isolated decisions. Design an agentic system that actively manages open positions as market conditions and risk profiles evolve. The system should continuously assess risk, recommend actions like holding or exiting, and manage multiple positions together. Focus on reasoning and adaptability, not simple buy/sell bots.",
        domain: "FinTech & AI",
        fullDescription: `Problem:
Stock trading is often treated as a sequence of isolated buy and sell decisions. Once a position is opened, many systems stop reasoning until a fixed exit condition is reached. In reality, market prices move continuously, risk levels change, and new opportunities appear.

Trader Reality:
For traders, the challenge is managing positions over time. A profitable trade can turns risky due to volatility. Capital tied up prevents participation in better opportunities.

Expectation:
Design an agentic system that actively manages open positions as market conditions and risk profiles evolve. The system should:
- Continuously assess risk, capital, and potential returns
- Recommend actions (hold, reduce, exit, reallocate)
- Manage multiple positions together to balance risk
(Disclaimer: Do not try with real assets)`,
    },
    {
        id: 3,
        title: "Decision-Centric AI for MSME Operations",
        description: "MSMEs struggle with manual, disjointed operations. Design an agentic system that autonomously drives operational decisions as business conditions change. The system should track requests and inventory, decide next actions, and automatically assign tasks. Focus on continuous operational decision-making and ownership.",
        domain: "Operations & AI",
        fullDescription: `Problem Statement:
MSMEs find it hard to run daily operations because customer requests, inventory, staff availability, and supplier timelines keep changing. These decisions are handled manually and separately, without a system that looks at everything together.

Background:
Most MSMEs use WhatsApp, spreadsheets, and verbal instructions. Owners are forced to manually coordinate everything.

Expectation:
Design an agentic system that autonomously drives operational decisions. The system should:
- Autonomously keep track of customer requests, inventory, and ongoing work
- Decide what should happen next and coordinate tasks
- Automatic assignment and tracking of tasks for staff`,
    },
    {
        id: 4,
        title: "AI-Driven Decision Support Across the Crop Lifecycle",
        description: "Farmers lack continuous, local guidance. Design an agentic system that continuously guides farming actions as crop stages and field conditions evolve. The system should understand farmer inputs and local conditions, decide on next guidance steps, and support across sowing, growth, and harvest. Focus on adaptive, stage-aware farming decisions.",
        domain: "AgriTech & AI",
        fullDescription: `Problem Statement:
Farmers find it difficult to make the right crop decisions because soil conditions, weather, crop stages, and local practices keep changing. Most decisions are made using delayed or generic advice.

Background:
Farming decisions depend on changing factors like soil quality and rainfall. Small farmers often rely on one-time recommendations.

Expectation:
Design an agentic system that continuously guides farming actions as crop stages evolve. The system should:
- Understand farmer inputs, local conditions, and crop stages
- Decide what guidance to give next and update advice as weather changes
- Continuously support across sowing, growth, and harvest`,
    },
    {
        id: 5,
        title: "Balancing Risk and Capacity in Hospital Care",
        description: "Hospitals struggle with dynamic patient flow and care escalation. Design an agentic system that supports adaptive patient escalation and flow decisions. The system should reason about patient risk and resource constraints, balance safety and urgency, and support dynamic decisions like observation or escalation.",
        domain: "Healthcare & AI",
        fullDescription: `Problem Statement:
Hospitals struggle to manage patient flow and care escalation because patient conditions, bed availability, and staff workload keep changing. Decisions are often made using fixed rules or manual coordination.

Background:
Modern hospitals operate under constant pressure. Static triage scores and fixed protocols do not adapt well when conditions change mid-shift.

Expectation:
Design an agentic system that supports adaptive patient escalation and flow decisions. The system should:
- Reason about patient risk and resource constraints while care is in progress
- Balance safety, urgency, bed availability, and staff workload
- Support dynamic decisions such as observation, escalation, delay, or reprioritization`,
    },
];
