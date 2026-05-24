export const DEMO_RESPONSES = {
  freelance: {
    document_summary: {
      title: "Freelance Development Contract",
      type: "Contract / Agreement",
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
      }
    ],
    deadlines: [
      {
        date: "October 1, 2025 (90 days before end of term)",
        description: "Written termination notice sent via certified mail only to prevent auto-renewal",
        type: "renewal",
        urgency: "high",
        consequence: "Automatically renews contract for another 12-month period with no exit option"
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
      }
    ],
    negotiation_suggestions: [
      {
        clause: "Auto-Renewal (Section 8)",
        current_text: "automatically renews for 12-month periods unless terminated with 90 days written notice sent via certified mail only.",
        suggested_change: "This Agreement shall not automatically renew. The parties may agree to extend the term in writing signed by both parties at least 30 days prior to expiration.",
        rationale: "Eliminates the auto-renewal entirely, requiring active mutual consent for any contract extension.",
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
      }
    ]
  },

  lease: {
    document_summary: {
      title: "Commercial Property Lease",
      type: "Property Document",
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
      type: "Contract / Agreement",
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
  },

  invoice: {
    document_summary: {
      title: "Corporate Purchase Invoice",
      type: "Invoice / Receipt",
      parties: ["Apex Solutions (Vendor)", "TechCorp Retail (Buyer)"],
      effective_date: "May 10, 2026",
      jurisdiction: "New York, USA",
      summary: "Invoice #INV-2026-8809 totaling $45,600.00 for custom database hosting services and server setup, subject to standard billing cycles."
    },
    risk_score: {
      score: 3,
      level: "low",
      summary: "Standard purchase order invoice. Minimal risk found, with standard dispute windows."
    },
    financial_obligations: [
      {
        type: "Total Amount Due",
        amount: "$45,600.00",
        frequency: "one-time",
        due_date: "June 10, 2026",
        notes: "Subject to a 1.5% compounding late fee monthly after 30 days.",
        total_exposure: "$45,600.00 total single billing obligation"
      }
    ],
    deadlines: [
      {
        date: "June 10, 2026",
        description: "Full settlement payment of invoice #INV-2026-8809",
        type: "payment",
        urgency: "medium",
        consequence: "1.5% compounding late fees applied monthly to outstanding balance"
      }
    ],
    clauses: [
      {
        id: "inv_c1",
        title: "Late Payment Penalty Compounding",
        original_text: "Invoices unpaid after thirty (30) days from due date shall accrue a late payment interest fee equal to 1.5% per month, compounding daily.",
        plain_english: "If you pay more than 30 days late, you start paying a 1.5% interest charge that mounts up every single day.",
        risk_level: "medium",
        risk_reason: "Daily compounding structure is highly punitive compared to standard simple monthly late interest fees.",
        section: "Section 4.2 (Interest)"
      }
    ],
    hidden_risks: [
      {
        type: "Punitive Interest Compounding",
        severity: "medium",
        clause_excerpt: "equal to 1.5% per month, compounding daily",
        why_it_matters: "Daily compounding creates rapid interest build-ups that far exceed normal monthly simple interest caps.",
        potential_impact: "Substantial cash outflows over delayed dispute resolution times.",
        safer_alternative: "Specify simple monthly interest not exceeding 1% with a 15-day grace period."
      }
    ],
    negotiation_suggestions: [
      {
        clause: "Late Interest (Section 4.2)",
        current_text: "1.5% per month, compounding daily",
        suggested_change: "1.0% simple monthly interest, with zero compounding",
        rationale: "Prevents aggressive compounding fee escalations.",
        priority: "nice-to-have"
      }
    ],
    plain_english_map: {
      what_you_are_agreeing_to: "You agree to pay $45.6k in full by June 10, 2026, accepting daily compounding penalties if unpaid after 30 days.",
      what_you_cannot_do: "You cannot withhold full invoice values over minor itemized database disputes.",
      what_happens_if_things_go_wrong: "If you pay late, you face rapid late-fee compounding.",
      what_are_the_biggest_traps: "Daily compounding interest loops."
    },
    action_items: [
      {
        priority: "medium",
        action: "Confirm Database Deliverable Verification",
        deadline: "June 5, 2026",
        reason: "Verify database hosting works perfectly prior to releasing the $45,600.00 payment."
      }
    ]
  },

  medical: {
    document_summary: {
      title: "Clinical Discharge Summary",
      type: "Medical Report",
      parties: ["Metro Health Hospital", "Patient (John Doe)"],
      effective_date: "April 24, 2026",
      jurisdiction: "Clinical Standards Board",
      summary: "Patient John Doe discharged after successful laparoscopic appendectomy. Stable vitals, post-op instructions, and medication schedule."
    },
    risk_score: {
      score: 2,
      level: "low",
      summary: "Standard post-surgery discharge briefing. Primary risks are clinical compliance and medication schedule adherence."
    },
    financial_obligations: [
      {
        type: "Post-op Meds Copay",
        amount: "₹1,200 / $15.00",
        frequency: "one-time",
        due_date: "At pharmacy checkout",
        notes: "Subject to health insurance policy coverages.",
        total_exposure: "N/A"
      }
    ],
    deadlines: [
      {
        date: "May 1, 2026",
        description: "Post-op clinical surgical follow-up check",
        type: "medical-followup",
        urgency: "high",
        consequence: "Risk of unnoticed surgical wound infections or internal healing delays"
      }
    ],
    clauses: [
      {
        id: "med_c1",
        title: "Medication Contraindications",
        original_text: "Patient must take Amoxicillin 500mg three times daily for 7 days. Do NOT ingest alcohol during this period due to heavy liver contraindications.",
        plain_english: "Take your antibiotics exactly 3 times a day for a week, and do not drink alcohol at all because it can cause severe liver issues.",
        risk_level: "high",
        risk_reason: "High clinical vulnerability if patient neglects strict chemical contraindications.",
        section: "Discharge Meds"
      }
    ],
    hidden_risks: [
      {
        type: "Medication Liver Warning",
        severity: "high",
        clause_excerpt: "Do NOT ingest alcohol during this period due to heavy liver contraindications",
        why_it_matters: "Antibiotics mixed with alcohol cause severe hepatic stress, nausea, and drop therapeutic effectiveness.",
        potential_impact: "Drug-induced liver injury or surgical recovery complications.",
        safer_alternative: "Complete the full 7-day course while staying hydrated and avoiding alcohol."
      }
    ],
    negotiation_suggestions: [
      {
        clause: "Antibiotics (Section 2)",
        current_text: "Amoxicillin 500mg 3x daily",
        suggested_change: "Amoxicillin 500mg 3x daily, supplemented with standard gut probiotics",
        rationale: "Maintains optimal digestive microbiome balance during recovery.",
        priority: "nice-to-have"
      }
    ],
    plain_english_map: {
      what_you_are_agreeing_to: "You agree to take 7 days of antibiotics, avoid alcohol, and return for stitches checkups on May 1.",
      what_you_cannot_do: "You cannot lift weights over 10 lbs or run marathons for 2 full weeks.",
      what_happens_if_things_go_wrong: "If pain spikes or fever rises above 101F, you must go to Emergency immediately.",
      what_are_the_biggest_traps: "Unnoticed wound infections due to missing surgical follow-up appointments."
    },
    action_items: [
      {
        priority: "urgent",
        action: "Book Surgical Follow-up Clinic Appointment",
        deadline: "April 28, 2026",
        reason: "Secure follow-up slot for surgical incision inspections."
      }
    ]
  },

  id: {
    document_summary: {
      title: "Individual PAN Verification Summary",
      type: "ID Document",
      parties: ["Income Tax Dept (Issuer)", "Individual Card Holder"],
      effective_date: "Active Permanent ID",
      jurisdiction: "Govt of India",
      summary: "PAN Verification audit. Checks validity, name matching indices, registration statuses, and standard compliance."
    },
    risk_score: {
      score: 1,
      level: "low",
      summary: "ID Document is completely valid, active, and matching official registry indices."
    },
    financial_obligations: [
      {
        type: "N/A",
        amount: "₹0",
        frequency: "N/A",
        due_date: "N/A",
        notes: "Standard individual identity document.",
        total_exposure: "N/A"
      }
    ],
    deadlines: [
      {
        date: "Immediate (Compliance Check)",
        description: "Ensure PAN-Aadhaar linking is complete in Govt registries",
        type: "compliance",
        urgency: "high",
        consequence: "PAN becomes 'Inoperative', leading to higher tax deductions at source (TDS)"
      }
    ],
    clauses: [
      {
        id: "id_c1",
        title: "PAN-Aadhaar Mandatory Linking",
        original_text: "Every PAN holder must link their card to their Aadhaar registry. Failure to link renders the card inoperative.",
        plain_english: "Link your PAN card to Aadhaar immediately, or your PAN card gets blocked and taxes will be deducted at higher rates.",
        risk_level: "medium",
        risk_reason: "High regulatory impact if neglected.",
        section: "Registry Section"
      }
    ],
    hidden_risks: [
      {
        type: "PAN Inoperative Risk",
        severity: "high",
        clause_excerpt: "renders the card inoperative",
        why_it_matters: "An inoperative PAN stops you from opening bank accounts, buying mutual funds, or filing tax returns.",
        potential_impact: "Regulatory lockout from standard banking and investments.",
        safer_alternative: "Complete instant e-linking on the Indian Income Tax e-filing portal."
      }
    ],
    negotiation_suggestions: [
      {
        clause: "ID Linking",
        current_text: "Failure to link renders card inoperative",
        suggested_change: "Ensure e-linking is completed on Govt portal with Aadhaar OTP verification",
        rationale: "Retains full active registration status without banking blocks.",
        priority: "must-have"
      }
    ],
    plain_english_map: {
      what_you_are_agreeing_to: "You agree to keep your identity details updated, match official PAN spelling, and complete mandatory Aadhaar integrations.",
      what_you_cannot_do: "You cannot hold multiple PAN cards, which constitutes a legal offense subject to ₹10,000 penalties.",
      what_happens_if_things_go_wrong: "If details don't match, tax returns fail filing checks.",
      what_are_the_biggest_traps: "Failing to link cards causing silent tax status downgrades."
    },
    action_items: [
      {
        priority: "high",
        action: "Verify Aadhaar Link Status",
        deadline: "Prior to next filing cycle",
        reason: "Verify linking on e-portal to prevent higher TDS deductions."
      }
    ]
  },

  tax: {
    document_summary: {
      title: "Individual ITR-1 Filing Acknowledgment",
      type: "Tax Document",
      parties: ["Income Tax Department", "Taxpayer"],
      effective_date: "Assessment Year 2025-26",
      jurisdiction: "Govt of India",
      summary: "ITR-1 Form filing confirmation. Confirms reported gross income, tax deductions, and finalized net tax refund due to the taxpayer."
    },
    risk_score: {
      score: 2,
      level: "low",
      summary: "Tax filing is successful. Risk scores relate to audit selections or matching issues in Form 26AS."
    },
    financial_obligations: [
      {
        type: "Gross Tax Payable",
        amount: "₹1,24,500.00",
        frequency: "annually",
        due_date: "July 31, 2025",
        notes: "Paid in full via advanced taxes and self-assessment tax credits.",
        total_exposure: "N/A"
      },
      {
        type: "Tax Refund Due",
        amount: "₹12,400.00",
        frequency: "one-time",
        due_date: "Processing window",
        notes: "Direct bank credit upon final assessment.",
        total_exposure: "N/A"
      }
    ],
    deadlines: [
      {
        date: "July 31, 2025",
        description: "Submit and e-verify ITR-1 return",
        type: "tax-deadline",
        urgency: "high",
        consequence: "Late filing fees up to ₹5,000 and compounding interest on outstanding tax dues"
      }
    ],
    clauses: [
      {
        id: "tax_c1",
        title: "Section 80C Deductions Limit",
        original_text: "Taxpayer claimed deductions under Section 80C totaling ₹1,50,000. Claims must be supported by valid savings and insurance certificates.",
        plain_english: "You claimed ₹1.5L in tax savings under 80C. Keep your insurance and ELSS receipts safe in case the tax department asks for proof.",
        risk_level: "low",
        risk_reason: "Standard claim validation requirements.",
        section: "Chapter VI-A Deductions"
      }
    ],
    hidden_risks: [
      {
        type: "AIS-26AS Discrepancies",
        severity: "medium",
        clause_excerpt: "Claims must be supported by valid savings",
        why_it_matters: "Mismatch between claimed deductions/income and data reported by banks in the Annual Information Statement (AIS) triggers automated tax notices.",
        potential_impact: "Automated scrutiny audit notices and tax recalculation demands.",
        safer_alternative: "Pre-verify all interest income and TDS records with AIS and Form 26AS sheets prior to submission."
      }
    ],
    negotiation_suggestions: [
      {
        clause: "Tax Scrutiny (Section 143)",
        current_text: "Subject to verification",
        suggested_change: "Reconcile reported income with AIS and Form 26AS matching records",
        rationale: "Minimizes scrutiny audit trigger probability.",
        priority: "nice-to-have"
      }
    ],
    plain_english_map: {
      what_you_are_agreeing_to: "You agree that all declared incomes, salaries, and interest figures are true and match your PAN bank summaries.",
      what_you_cannot_do: "You cannot claim standard 80C/80D deductions without actual investment assets or health premium invoices.",
      what_happens_if_things_go_wrong: "If details don't match, you receive an automated Section 139 defect notice.",
      what_are_the_biggest_traps: "Failing to declare minor bank interest incomes, causing automated notices."
    },
    action_items: [
      {
        priority: "high",
        action: "E-Verify the Return",
        deadline: "Within 30 days of filing",
        reason: "ITR remains invalid and unprocessed until e-verification is completed via Aadhaar OTP."
      }
    ]
  }
};
