import { NextResponse } from "next/server";
import { callNIM } from "@/lib/nim";
import { CLAUSE_REWRITE_PROMPT } from "@/lib/prompts";

export async function POST(request) {
  try {
    const { clauseText, tone, context, modelId } = await request.json();
    const activeModel = modelId || "meta/llama-3.1-70b-instruct";

    try {
      const response = await callNIM(
        CLAUSE_REWRITE_PROMPT.system,
        CLAUSE_REWRITE_PROMPT.user(clauseText, tone, context),
        { max_tokens: 1024, temperature: 0.3, model: activeModel }
      );

      const cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const result = JSON.parse(cleaned);

      return NextResponse.json({ success: true, data: result });
    } catch (apiError) {
      if (
        apiError.message === "MOCK_FALLBACK_REQUIRED" ||
        apiError.status === 401 ||
        apiError.message.includes("API key") ||
        apiError.message.includes("apiKey")
      ) {
        console.warn(`Fallback triggered in rewriter. Model: ${activeModel}`);
        
        let rewritten = "";
        let justification = "";
        let key_changes = [];

        // Check which clause or fallback
        const lowerClause = (clauseText || "").toLowerCase();

        if (lowerClause.includes("renew") || lowerClause.includes("auto")) {
          if (tone === "aggressive") {
            rewritten = "This Agreement shall not automatically renew. Any extension or renewal of this Agreement shall require the mutual written consent of both Parties, executed at least thirty (30) days prior to the expiration of the then-current term.";
            justification = "Completely deletes the automatic lock-in, forcing active mutual agreement for extensions.";
            key_changes = ["Deleted 12-month auto-lock-in", "Deleted certified physical mail rule", "Added mutual active signature requirement"];
          } else if (tone === "friendly") {
            rewritten = "We hope to keep working together! Let's touch base in writing 30 days before our agreement ends if we both wish to renew for another year.";
            justification = "Keeps the tone warm and collaborative while still removing the strict automatic lock-in trap.";
            key_changes = ["Softened formal legal tone", "Removed physical mail courier obligation", "Added 30-day email alignment window"];
          } else {
            rewritten = "This Agreement shall automatically renew for additional successive terms of three (3) months each, unless either Party provides the other with written notice of non-renewal (which may be sent via standard email) at least thirty (35) days prior to the end of the then-current term.";
            justification = "Establishes a balanced 30-day notice, allows standard email notifications, and shrinks the rollover length from 1 year to 3 months.";
            key_changes = ["Reduced lock-in from 12 to 3 months", "Shortened notice deadline from 90 to 30 days", "Allowed standard email notices"];
          }
        } else if (lowerClause.includes("liability") || lowerClause.includes("dispute")) {
          if (tone === "aggressive") {
            rewritten = "Except for indemnity obligations or breaches of confidentiality, Contractor's total cumulative liability under this agreement shall be capped at $5,000. In no event shall Contractor be liable for any indirect or consequential damages.";
            justification = "Cuts down developer risk to an absolute minimum while rejecting uncapped liabilities for defects.";
            key_changes = ["Capped contractor liability at $5,000", "Removed unlimited liability standard", "Excluded indirect/consequential damages"];
          } else if (tone === "friendly") {
            rewritten = "We want to make this work safely for both sides. Let's agree that if a mistake happens, our liability to each other is limited to a maximum of the total amount paid under this project.";
            justification = "Balances the risk in a friendly, relational manner by aligning liability caps to project values.";
            key_changes = ["Established mutual cooperation", "Capped liability to project earnings", "Softened legalistic phrases"];
          } else {
            rewritten = "Except for breaches of confidentiality, each party's aggregate liability under this Agreement shall be limited to the total fees paid to Contractor during the preceding six months.";
            justification = "Installs a standard mutual liability cap reflecting actual contract volumes.";
            key_changes = ["Made liability limits strictly mutual", "Capped damages based on project revenue", "Maintained confidentiality exclusions"];
          }
        } else {
          // Standard general fallback
          if (tone === "aggressive") {
            rewritten = "This term is subject to mutual agreement and shall not be enforced unilaterally by either party. Any modifications require express written consent.";
            justification = "Ensures total defensive security for the signing party.";
            key_changes = ["Removed unilateral power", "Mandated mutual consent"];
          } else if (tone === "friendly") {
            rewritten = "Let's review this together so we're both comfortable before moving forward.";
            justification = "Invites open conversation while avoiding risky lock-ins.";
            key_changes = ["Added conversational review", "Bypassed default binding terms"];
          } else {
            rewritten = "Each party agrees to negotiate amendments to this term in good faith to maintain a balanced business relationship.";
            justification = "Encourages mutual fairness in a professional framework.";
            key_changes = ["Added mutual good-faith rule", "Secured relational balance"];
          }
        }

        return NextResponse.json({
          success: true,
          data: {
            original: clauseText || "Original clause",
            rewritten,
            justification,
            key_changes,
            model_simulated: activeModel
          }
        });
      }
      throw apiError;
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
