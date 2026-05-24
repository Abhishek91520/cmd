export const MASTER_ANALYSIS_PROMPT = {
  system: `You are an elite legal and document intelligence agent. Analyze documents with extreme precision and return ONLY valid JSON — no markdown, no explanation, no preamble.
Your analysis must be thorough, specific, and highly customized to the document category. Translate allPlain English maps, summaries, and risk alerts into the requested Regional Indian Language if specified. Extract real information — never fabricate. If info is not present, use null.`,

  user: (documentText, documentName, category, language) => `Analyze this document and return structured intelligence as JSON.

Document Name: ${documentName}
Document Category: ${category || "General"}
Target Output Language: ${language || "English"}
Document Text:
---
${documentText}
---

Return ONLY this JSON structure with values translated to ${language || "English"} if specified:

{
  "document_summary": {
    "title": "string — title or type",
    "type": "string — category type",
    "parties": ["list of key names/parties/vendors/patients/taxpayers"],
    "effective_date": "string or null",
    "jurisdiction": "string or null",
    "summary": "2-3 sentence summary in ${language || "English"}"
  },
  "risk_score": {
    "score": "number 1-10 (10 = most critical/dangerous)",
    "level": "high | medium | low",
    "summary": "one sentence verdict in ${language || "English"}"
  },
  "financial_obligations": [
    {
      "type": "string — e.g. 'Monthly Payment', 'Tax Liability', 'Hospital Fee', 'Deductible'",
      "amount": "string — dollar/rupee amount",
      "frequency": "string — frequency",
      "due_date": "string or null",
      "notes": "string — conditions",
      "total_exposure": "string — estimated total"
    }
  ],
  "deadlines": [
    {
      "date": "string — exact or relative date",
      "description": "string — what must happen",
      "type": "payment | renewal | notice | compliance | medical-followup | tax-deadline",
      "urgency": "high | medium | low",
      "consequence": "string — consequence of missing it"
    }
  ],
  "clauses": [
    {
      "id": "string — unique id",
      "title": "string — clause/term title",
      "original_text": "string — exact text from document",
      "plain_english": "string — simple explanation in ${language || "English"}",
      "risk_level": "high | medium | low | safe",
      "risk_reason": "string — risk verdict in ${language || "English"}, or null if safe",
      "section": "string — section name"
    }
  ],
  "hidden_risks": [
    {
      "type": "string — e.g. 'Unlimited Liability', 'Hidden Penalty', 'Dosage Danger', 'Tax Audit Trigger'",
      "severity": "critical | high | medium | low",
      "clause_excerpt": "string — quote from document",
      "why_it_matters": "string — explanation in ${language || "English"}",
      "potential_impact": "string — worst case in ${language || "English"}",
      "safer_alternative": "string — safer alternative in ${language || "English"}"
    }
  ],
  "negotiation_suggestions": [
    {
      "clause": "string — clause",
      "current_text": "string — current text",
      "suggested_change": "string — replacement",
      "rationale": "string — rationale in ${language || "English"}",
      "priority": "must-have | nice-to-have"
    }
  ],
  "plain_english_map": {
    "what_you_are_agreeing_to": "string — 2-3 sentence core commitment in ${language || "English"}",
    "what_you_cannot_do": "string — key restrictions in ${language || "English"}",
    "what_happens_if_things_go_wrong": "string — termination or dispute summary in ${language || "English"}",
    "what_are_the_biggest_traps": "string — top risks in ${language || "English"}"
  },
  "action_items": [
    {
      "priority": "urgent | high | medium",
      "action": "string — specific action to take in ${language || "English"}",
      "deadline": "string or null",
      "reason": "string — reason in ${language || "English"}"
    }
  ]
}`,
};

export const ASK_QUESTION_PROMPT = {
  system: `You are an expert document specialist. Answer queries about the uploaded document accurately and concisely based strictly on the text provided. If the user specified a regional language, write the answer in that language.`,

  user: (documentText, question, language) => `Document Text:
---
${documentText}
---

Question: ${question}
Output Language: ${language || "English"}

Please provide a highly accurate and professional answer to the question based on the document text. Write the final answer in ${language || "English"}.`,
};

export const COMPARE_DOCUMENTS_PROMPT = {
  system: `You are a legal and contract auditing consultant. Compare these two documents and identify all critical differences, changes in risk, and delta metrics. Return ONLY valid JSON.`,

  user: (doc1Text, doc2Text, language) => `Compare these two document drafts:

Document 1 (Original):
---
${doc1Text}
---

Document 2 (Revised/Alternative):
---
${doc2Text}
---

Output Language: ${language || "English"}

Identify changes, risk level changes, and delta improvements. Return ONLY this JSON structure:

{
  "comparison_summary": "string — 2-3 sentence overview of changes",
  "risk_delta": {
    "original_score": "number 1-10",
    "revised_score": "number 1-10",
    "verdict": "string — risk change verdict in ${language || "English"}"
  },
  "added_terms": [
    {
      "title": "string — term title",
      "text": "string — excerpt",
      "impact": "string — impact in ${language || "English"}"
    }
  ],
  "deleted_terms": [
    {
      "title": "string — term title",
      "text": "string — excerpt",
      "impact": "string — impact in ${language || "English"}"
    }
  ],
  "modified_terms": [
    {
      "title": "string — title",
      "original_text": "string — old text",
      "revised_text": "string — new text",
      "improvement": "string — improvement explanation in ${language || "English"}"
    }
  ],
  "negotiation_verdict": "string — whether the revised draft is safe to sign or needs more editing in ${language || "English"}"
}`,
};

export const CLAUSE_REWRITE_PROMPT = {
  system: `You are an expert contract attorney specializing in protecting clients from unfair terms. Rewrite clauses to be fairer and safer. Return ONLY valid JSON.`,

  user: (clauseText, tone, context) => `Rewrite this contract clause with a ${tone} negotiation tone.

Context: This is from a ${context || "business contract"}.
Current clause: "${clauseText}"

Tone guidelines:
- aggressive: Maximum protection for the signing party, push back hard on all one-sided terms
- balanced: Fair and mutual terms that both parties can reasonably accept
- friendly: Collaborative language that preserves the relationship while adding protection

Return ONLY this JSON:
{
  "original": "string — the original clause text",
  "rewritten": "string — your improved version",
  "justification": "string — why this change protects the signing party",
  "key_changes": ["list of specific changes made"]
}`,
};

export const COUNTER_PROPOSAL_PROMPT = {
  system: `You are a professional negotiation consultant drafting business correspondence. Write clear, professional emails. Return the email text only — no JSON needed.`,

  user: (risks, documentSummary, tone) => `Draft a professional counter-proposal email for this contract situation.

Document: ${documentSummary?.title || "Contract"}
Top risks identified: ${risks?.map((r) => r.type).join(", ") || "multiple concerns"}
Negotiation tone: ${tone}

Write a professional email from the reviewing party to the offering party. Include:
1. Professional opening acknowledging the agreement
2. 3-4 specific clauses that need amendment (reference the risks above)
3. Clear proposed alternative language for each
4. Professional closing

Keep it concise, firm, and professional. Format as a real email with subject line.`,
};
