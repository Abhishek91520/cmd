export const DEMO_RESPONSES = {
  freelance: {
    document_summary: {
      title: "Freelance Development Contract",
      type: "Freelance Contract",
      parties: ["TechCorp Inc.", "Developer (Contractor)"],
      effective_date: "January 1, 2025",
      jurisdiction: "Delaware, USA",
      summary: "A freelance agreement for custom e-commerce development featuring highly one-sided terms in favor of the client, including automatic 12-month renewals, client ownership of unrelated IP, and limited client liability."
    },
    risk_score: {
      score: 8,
      level: "high",
      summary: "Critical vulnerabilities found: Auto-renewal trap, client-favored IP transfer, arbitrary payment terms, and unlimited developer liability."
    },
    financial_obligations: [
      {
        type: "Monthly Payment",
        amount: "$5,000",
        frequency: "monthly",
        due_date: "Within 60 days of invoice",
        notes: "No late payment penalty. Client can withhold pay if unsatisfied at their sole discretion.",
        total_exposure: "$30,000 total base contract exposure"
      },
      {
        type: "Late Payment Penalty",
        amount: "$0",
        frequency: "one-time",
        due_date: "N/A",
        notes: "No penalties apply for late payments by client.",
        total_exposure: "N/A"
      }
    ],
    deadlines: [
      {
        date: "October 1, 2025 (90 days before end of term)",
        description: "Written termination notice sent via certified mail only to prevent auto-renewal",
        type: "renewal",
        urgency: "high",
        consequence: "Automatically renews contract for another 12-month period with no exit option"
      },
      {
        date: "Monthly (Invoice Date)",
        description: "Invoice submission deadline",
        type: "payment",
        urgency: "medium",
        consequence: "60-day payment delay window starts counting only after invoice acceptance"
      }
    ],
    clauses: [
      {
        id: "clause_1",
        title: "Requirements & Scope Changes",
        original_text: "Contractor agrees to develop a custom e-commerce platform. Client may change project requirements at any time without additional compensation to Contractor.",
        plain_english: "The client can change the project's scope whenever they want without paying you a single cent more.",
        risk_level: "high",
        risk_reason: "Unlimited scope creep without any compensation protection.",
        section: "Section 1 (Services)"
      },
      {
        id: "clause_2",
        title: "Payment Discretion & Net-60 Terms",
        original_text: "Client will pay $5,000/month. Payment is due within 60 days of invoice. Late payments incur no penalty. Client reserves the right to withhold payment if 'not satisfied' with deliverables, at Client's sole discretion.",
        plain_english: "Payment arrives two months late, late fees are banned, and the client can withhold your money indefinitely if they say they don't like the work.",
        risk_level: "high",
        risk_reason: "Completely subjective standard of satisfaction coupled with extremely long 60-day payment window.",
        section: "Section 2 (Payment Terms)"
      },
      {
        id: "clause_3",
        title: "Intellectual Property Grab",
        original_text: "All work product, inventions, and code created by Contractor during this engagement, including work created outside of business hours and unrelated to the project, shall become sole property of Client.",
        plain_english: "TechCorp owns absolutely everything you write during the contract period—even side projects you build on weekends completely unrelated to their e-commerce platform.",
        risk_level: "high",
        risk_reason: "Unreasonably broad IP transfer encompassing off-hours, unrelated personal side projects.",
        section: "Section 3 (Intellectual Property)"
      },
      {
        id: "clause_4",
        title: "Immediate At-Will Termination",
        original_text: "Client may terminate this agreement at any time without notice and without any severance or compensation to Contractor for work in progress.",
        plain_english: "The client can fire you instantly, mid-day, without warning, and avoid paying you for any work-in-progress.",
        risk_level: "high",
        risk_reason: "No transition buffer, no notice period, and forfeiture of payment for completed partial milestones.",
        section: "Section 4 (Termination)"
      },
      {
        id: "clause_5",
        title: "Non-Compete Lockdown",
        original_text: "Contractor agrees not to work with any Client competitors for 3 years after termination. 'Competitors' is defined at Client's sole discretion.",
        plain_english: "You cannot work for any company TechCorp considers a 'competitor' for 3 full years after you leave, and they get to decide who counts as a competitor.",
        risk_level: "high",
        risk_reason: "3-year post-termination duration is highly excessive for a freelance developer and defines 'competitors' far too loosely.",
        section: "Section 6 (Non-Compete)"
      },
      {
        id: "clause_6",
        title: "Asymmetrical Liability Limits",
        original_text: "In the event of any dispute, Client's liability shall not exceed $500 regardless of damages incurred by Contractor. Contractor accepts unlimited liability for any defects in deliverables.",
        plain_english: "If TechCorp ruins your business, the most you can sue them for is $500. If there is a small bug in your code, you accept infinite liability.",
        risk_level: "high",
        risk_reason: "Extreme financial exposure for the developer with no mutual liability cap.",
        section: "Section 7 (Liability)"
      },
      {
        id: "clause_7",
        title: "Auto-Renewal Trap",
        original_text: "This agreement automatically renews for 12-month periods unless terminated with 90 days written notice sent via certified mail only.",
        plain_english: "If you don't mail a physical certified letter exactly 90 days before the contract ends, you are locked into working for them for another entire year.",
        risk_level: "high",
        risk_reason: "90-day automatic lock-in with heavy courier-based delivery restrictions.",
        section: "Section 8 (Auto-Renewal)"
      }
    ],
    hidden_risks: [
      {
        type: "Auto-Renewal Trap",
        severity: "critical",
        clause_excerpt: "automatically renews for 12-month periods unless terminated with 90 days written notice",
        why_it_matters: "A 90-day physical mail notification requirement is highly susceptible to being missed, causing a forced 1-year contract extension.",
        potential_impact: "Locked into 12 months of additional work under unfavorable terms with no alternative exit option.",
        safer_alternative: "Provide a standard 30-day electronic mail notice option to cancel or non-renew."
      },
      {
        type: "Unlimited Side-Project IP Grab",
        severity: "critical",
        clause_excerpt: "inventions, and code... created outside of business hours and unrelated to the project",
        why_it_matters: "This violates normal IP boundaries by laying claim to work built entirely outside the client's scope and contract hours.",
        potential_impact: "Loss of ownership over proprietary side-hustles, personal apps, and pre-existing code frameworks.",
        safer_alternative: "Restrict IP transfers strictly to work product created directly for the custom platform during designated work hours."
      },
      {
        type: "Asymmetrical Liability Exposure",
        severity: "high",
        clause_excerpt: "Client's liability shall not exceed $500... Contractor accepts unlimited liability",
        why_it_matters: "You are blocked from pursuing major damages if client breaches, but the client can sue you for unlimited amounts over bugs.",
        potential_impact: "Severe legal and financial vulnerability that could bankrupt your freelance business over standard code defects.",
        safer_alternative: "Implement a mutual cap on liability equal to the total fees paid under the contract (e.g., $30,000)."
      },
      {
        type: "Subjective Payment Withholding",
        severity: "high",
        clause_excerpt: "withhold payment if 'not satisfied' with deliverables, at Client's sole discretion",
        why_it_matters: "Gives the client a unilateral excuse to avoid paying for completed services based on a subjective standard.",
        potential_impact: "Substantial cash flow deficits and unpaid labor for completed platform deliverables.",
        safer_alternative: "Specify objective acceptance criteria with a structured review and cure period (e.g., 5 days to request modifications)."
      }
    ],
    negotiation_suggestions: [
      {
        clause: "Auto-Renewal (Section 8)",
        current_text: "automatically renews for 12-month periods unless terminated with 90 days written notice sent via certified mail only.",
        suggested_change: "This Agreement shall not automatically renew. The parties may agree to extend the term in writing signed by both parties at least 30 days prior to expiration.",
        rationale: "Eliminates the auto-renewal entirely, requiring active mutual consent for any contract extension.",
        priority: "must-have"
      },
      {
        clause: "Liability Cap (Section 7)",
        current_text: "In the event of any dispute, Client's liability shall not exceed $500... Contractor accepts unlimited liability.",
        suggested_change: "Except for breaches of confidentiality, each party's aggregate liability under this Agreement shall be limited to the total fees paid to Contractor during the preceding six months.",
        rationale: "Balances the risk mutually, preventing devastating unlimited lawsuits.",
        priority: "must-have"
      }
    ],
    plain_english_map: {
      what_you_are_agreeing_to: "You are agreeing to develop an e-commerce platform for $5k/month, receiving payment 60 days late, while relinquishing all intellectual property you build during this duration.",
      what_you_cannot_do: "You cannot build side projects without losing their ownership, work for any perceived competitor for 3 years post-termination, or cancel the contract without a 90-day certified physical letter.",
      what_happens_if_things_go_wrong: "If a dispute arises, the client's liability is capped at $500, whereas you face unlimited personal liability for defects or software failures.",
      what_are_the_biggest_traps: "The automatic 12-month renewal clause and the sweeping weekend/off-hours intellectual property grab."
    },
    action_items: [
      {
        priority: "urgent",
        action: "Amend IP Clause (Section 3)",
        deadline: "Prior to signing",
        reason: "Remove the 'created outside of business hours and unrelated' wording to protect personal projects."
      },
      {
        priority: "high",
        action: "Establish Mutual Liability Cap (Section 7)",
        deadline: "Prior to signing",
        reason: "Limit your total financial exposure to standard contract values."
      },
      {
        priority: "high",
        action: "Revise Payment Satisfaction Standard (Section 2)",
        deadline: "Prior to signing",
        reason: "Incorporate objective testing and acceptance standards instead of a subjective satisfaction clause."
      }
    ]
  },

  lease: {
    document_summary: {
      title: "Commercial Property Lease",
      type: "Commercial Lease",
      parties: ["Commercial Property Landlord", "Tenant"],
      effective_date: "January 1, 2025",
      jurisdiction: "State of Property Location",
      summary: "A 5-year lease for commercial office premises with a rent escalator index and landlord discretionary provisions regarding operating expenses and security deposit deductions."
    },
    risk_score: {
      score: 5,
      level: "medium",
      summary: "Moderate risks identified in CPI rent compounding, unilateral security deposit allocation, and operating expense escalations."
    },
    financial_obligations: [
      {
        type: "Base Monthly Rent",
        amount: "$8,500",
        frequency: "monthly",
        due_date: "1st of each month",
        notes: "Subject to annual increases of CPI + 3% (minimum 5% per year).",
        total_exposure: "$510,000 base value over 5 years"
      },
      {
        type: "Security Deposit",
        amount: "$25,500",
        frequency: "one-time",
        due_date: "Upon execution",
        notes: "Unilateral landlord usage for damages. Non-interest-bearing.",
        total_exposure: "$25,500 locked asset"
      }
    ],
    deadlines: [
      {
        date: "December 31, 2028 (12 months before expiration)",
        description: "Exercise renewal option for a 3-year extension",
        type: "renewal",
        urgency: "medium",
        consequence: "Forfeiture of the option to renew, allowing landlord to lease to other tenants"
      }
    ],
    clauses: [
      {
        id: "lease_c1",
        title: "Compounding Rent Escalations",
        original_text: "Base rent: $8,500/month. Annual increases of CPI + 3%, minimum 5% per year.",
        plain_english: "Rent climbs by at least 5% every year (or more if inflation spiked), regardless of market rates.",
        risk_level: "medium",
        risk_reason: "High minimum escalator compound which may exceed actual market rate shifts over 5 years.",
        section: "Section 1 (Rent)"
      },
      {
        id: "lease_c2",
        title: "Discretionary Security Deposit Deductions",
        original_text: "Tenant shall deposit $25,500 (3 months rent). Landlord may use deposit for any 'damages' at landlord's sole discretion. Deposit is non-interest-bearing.",
        plain_english: "Landlord can take deposit money for repairs whenever they feel like it, and your money earns no interest.",
        risk_level: "medium",
        risk_reason: "Subjective deductions without receipt requirements or joint walkthrough standards.",
        section: "Section 2 (Security Deposit)"
      }
    ],
    hidden_risks: [
      {
        type: "Capital Improvement Pass-Through",
        severity: "medium",
        clause_excerpt: "operating expenses including... any capital improvements landlord deems necessary",
        why_it_matters: "You could be forced to pay for structural building upgrades (like a new roof or elevator system) that only benefit the landlord's long-term asset value.",
        potential_impact: "Sudden, unplanned assessments costing tens of thousands of dollars.",
        safer_alternative: "Exclude capital improvements from operating expenses, or limit them to amortized energy-saving enhancements."
      }
    ],
    negotiation_suggestions: [
      {
        clause: "Rent Increase (Section 1)",
        current_text: "Annual increases of CPI + 3%, minimum 5% per year.",
        suggested_change: "Annual increases capped at a flat 3% per year.",
        rationale: "Creates predictable financial projection and limits inflationary spikes.",
        priority: "nice-to-have"
      }
    ],
    plain_english_map: {
      what_you_are_agreeing_to: "You agree to pay $8.5k/month for 5 years with cumulative 5% annual bumps, support landlord structural repairs, and leave a non-interest security deposit.",
      what_you_cannot_do: "You cannot lease the office space to anyone else or change its basic usage without landlord approval.",
      what_happens_if_things_go_wrong: "If you pay late, you owe a massive 10% monthly fee, and the landlord can immediately access your entire security deposit.",
      what_are_the_biggest_traps: "Uncapped building structural upgrade fees pass-throughs."
    },
    action_items: [
      {
        priority: "high",
        action: "Cap Operating Expenses (Section 3)",
        deadline: "Prior to signing",
        reason: "Exclude structural capital expenses and cap controllable expenses at 3-5% annual variance."
      }
    ]
  },

  employment: {
    document_summary: {
      title: "Employment Agreement",
      type: "Employment Agreement",
      parties: ["Employer Corp", "Employee (Senior Software Engineer)"],
      effective_date: "February 1, 2025",
      jurisdiction: "State of Headquarters",
      summary: "An employment offer letter setting base salary, specifying at-will termination without buffer, and introducing substantial post-employment covenants."
    },
    risk_score: {
      score: 6,
      level: "medium",
      summary: "Contains problematic at-will conditions without severance and aggressive non-compete/non-solicit periods."
    },
    financial_obligations: [
      {
        type: "Annual Salary",
        amount: "$95,000",
        frequency: "annually",
        due_date: "Standard payroll cycles",
        notes: "Discretionary bonus up to 20% subject to active employment on payment date.",
        total_exposure: "N/A (Revenue generation)"
      }
    ],
    deadlines: [
      {
        date: "Start Date (Feb 1, 2025)",
        description: "Commence active duties",
        type: "compliance",
        urgency: "low",
        consequence: "Offer rescission if start date is missed"
      }
    ],
    clauses: [
      {
        id: "emp_c1",
        title: "At-Will & Zero Severance",
        original_text: "This employment is at-will. Either party may terminate at any time, for any reason. Company provides no severance upon termination.",
        plain_english: "You can be let go on any Tuesday afternoon with no warning, and they don't have to pay you any severance.",
        risk_level: "medium",
        risk_reason: "Total lack of employment buffer or transition severance protection.",
        section: "Section 1 (At-Will)"
      },
      {
        id: "emp_c2",
        title: "Aggressive Non-Compete Radius",
        original_text: "Employee agrees not to work for any company in the software industry within 50 miles of Company headquarters for 18 months after termination.",
        plain_english: "If you leave or are fired, you cannot take any coding job in the entire software field within a 50-mile circle for a year and a half.",
        risk_level: "high",
        risk_reason: "Extremely broad industry ban (software industry) combined with a long 18-month restraint timeline.",
        section: "Section 4 (Non-Compete)"
      }
    ],
    hidden_risks: [
      {
        type: "Universal Invention Assignment",
        severity: "high",
        clause_excerpt: "assigns all inventions, whether or not related to employment, created during the employment period",
        why_it_matters: "Lays claim to personal inventions built on your own time with your own laptop, which has nothing to do with employer business.",
        potential_impact: "Complete loss of personal creative IP ownership.",
        safer_alternative: "Exclude inventions created purely on employee personal time using private equipment, unrelated to corporate operations."
      }
    ],
    negotiation_suggestions: [
      {
        clause: "Non-Compete Restraint (Section 4)",
        current_text: "software industry within 50 miles for 18 months",
        suggested_change: "Non-compete limited to direct competitors of Employer Corp, for a duration of 6 months post-employment.",
        rationale: "Protects employer's direct interest while allowing developer to earn a living in the general tech sector.",
        priority: "must-have"
      }
    ],
    plain_english_map: {
      what_you_are_agreeing_to: "You agree to serve as a Senior Engineer at-will, forfeit all personal weekend code inventions, and accept a 1.5 year post-employment industry ban.",
      what_you_cannot_do: "You cannot solicit staff or customers for 2 years, or work in local tech roles for 18 months.",
      what_happens_if_things_go_wrong: "If fired, you receive zero severance, and the company can cancel health benefits on day one.",
      what_are_the_biggest_traps: "Unrestricted software-industry non-compete and total personal IP assignment."
    },
    action_items: [
      {
        priority: "high",
        action: "Narrow Non-Compete Scope (Section 4)",
        deadline: "Prior to signing",
        reason: "Negotiate down the 18-month term to 6 months, and restrict 'industry' strictly to direct business competitors."
      }
    ]
  }
};
