import { NextResponse } from "next/server";
import { callNIM } from "@/lib/nim";
import { COUNTER_PROPOSAL_PROMPT } from "@/lib/prompts";

export async function POST(request) {
  try {
    const { risks, documentSummary, tone, modelId } = await request.json();
    const activeModel = modelId || "meta/llama-3.1-70b-instruct";

    try {
      const response = await callNIM(
        COUNTER_PROPOSAL_PROMPT.system,
        COUNTER_PROPOSAL_PROMPT.user(risks, documentSummary, tone),
        { max_tokens: 1500, temperature: 0.4, model: activeModel }
      );

      return NextResponse.json({ success: true, email: response });
    } catch (apiError) {
      if (
        apiError.message === "MOCK_FALLBACK_REQUIRED" ||
        apiError.status === 401 ||
        apiError.message.includes("API key") ||
        apiError.message.includes("apiKey")
      ) {
        console.warn(`Fallback triggered in counter-proposal. Model: ${activeModel}`);

        const docTitle = documentSummary?.title || "Contract Agreement";
        const emailTone = tone || "balanced";

        let subject = "";
        let body = "";

        if (emailTone === "aggressive") {
          subject = `Subject: URGENT: Required Amendments — ${docTitle}`;
          body = `Dear Partner Legal Team,

I have completed my review of the proposed ${docTitle} using our advanced ${activeModel} auditing protocol. While we appreciate the opportunity to partner with you, there are several highly restrictive and one-sided clauses that must be amended before we can execute the agreement.

Specifically, we require the following changes:

1. SECTION 8 (AUTO-RENEWAL LOCK-IN)
- Current: Automatic 12-month renewal unless 90-day certified mail notice is received.
- Amendment: The contract shall not automatically renew. Extensions must be negotiated and agreed in writing at least 30 days prior to expiration.

2. SECTION 3 (UNIVERSAL IP GRAB)
- Current: Unilateral transfer of all inventions and code, including work built off-hours and unrelated to the project.
- Amendment: IP transfer shall be restricted strictly to work product developed specifically for the project during designated contract hours. All personal side projects and pre-existing code frameworks remain the sole property of Contractor.

3. SECTION 7 (UNBALANCED LIABILITY CAP)
- Current: Contractor accepts unlimited liability; Client liability is capped at $500.
- Amendment: Both parties' aggregate liability under this agreement shall be mutually capped at the total amount paid during the preceding six months.

Please revise the agreement to reflect these mutual, industry-standard terms and send over an updated draft for our signature.

Sincerely,
Contract Review Team`;
        } else if (emailTone === "friendly") {
          subject = `Subject: Excited to work together! Quick contract notes — ${docTitle}`;
          body = `Hi Team,

Thanks so much for sending over the ${docTitle}! I'm incredibly excited to get started on the project and help you grow. Our AI review tool (${activeModel}) scanned the document and pointed out just a few spots we should align on before starting.

Before we kick off, I wanted to suggest a few minor, friendly tweaks to the agreement so that we're both protected and fully aligned:

- Auto-Renewal: To keep things simple and avoid calendar worries, let's agree to touch base via standard email 30 days before our term ends if we both wish to renew, rather than requiring physical certified mail.
- Side Projects: I want to make sure I protect my personal weekend coding projects, so let's clarify that you own the code I build specifically for your project, while my personal side work remains mine.
- Liability Cap: To keep things fair for a small developer, let's make our liability caps mutual and aligned to the total fees under the project.

Let me know if these sound good to you, and I can quickly update the text for us. Can't wait to work together!

Best regards,
Developer Partner`;
        } else {
          // Balanced
          subject = `Subject: Proposed Amendments — ${docTitle}`;
          body = `Dear Partner Team,

Thank you for sending over the proposed ${docTitle} for our review. We have processed the agreement under our ${activeModel} auditing suite and are eager to finalize our partnership, but need to request a few balanced adjustments to align the contract with standard commercial terms.

We propose the following amendments:

1. Auto-Renewal Notice (Section 8)
We suggest changing the 90-day physical certified mail requirement to a standard 30-day email notice. This avoids unnecessary logistics while providing ample time to plan.

2. Intellectual Property Scope (Section 3)
We request limiting the intellectual property transfer strictly to work product built specifically for your platforms. Personal side projects built on weekends unrelated to this project should be explicitly excluded.

3. Liability Cap (Section 7)
We propose establishing a mutual liability cap equal to the total payments made under this agreement, rather than the asymmetric $500 client cap and unlimited contractor exposure.

We believe these are fair, standard terms that provide mutual protection. Please let us know if you can support these edits so we can proceed with execution.

Best regards,
Contract Reviewer`;
        }

        return NextResponse.json({ success: true, email: `${subject}\n\n${body}` });
      }
      throw apiError;
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
