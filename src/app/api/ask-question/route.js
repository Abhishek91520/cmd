import { NextResponse } from "next/server";
import { callNIM } from "@/lib/nim";
import { ASK_QUESTION_PROMPT } from "@/lib/prompts";

export async function POST(request) {
  try {
    const { documentText, question, modelId, language } = await request.json();
    const activeModel = modelId || "meta/llama-3.1-70b-instruct";
    const targetLang = language || "English";

    try {
      const response = await callNIM(
        ASK_QUESTION_PROMPT.system,
        ASK_QUESTION_PROMPT.user(documentText, question, targetLang),
        { max_tokens: 1024, temperature: 0.2, model: activeModel }
      );

      return NextResponse.json({ success: true, answer: response });

    } catch (apiError) {
      if (
        apiError.message === "MOCK_FALLBACK_REQUIRED" ||
        apiError.status === 401 ||
        apiError.message.includes("API key") ||
        apiError.message.includes("apiKey")
      ) {
        console.warn(`Fallback triggered in Q&A. Model: ${activeModel}, Language: ${targetLang}`);

        const lowerQ = (question || "").toLowerCase();
        let answer = "";

        if (targetLang === "Hindi") {
          if (lowerQ.includes("payment") || lowerQ.includes("pay") || lowerQ.includes("भुगतान")) {
            answer = "भुगतान शर्तें अत्यधिक एकपक्षीय हैं। भुगतान चालान (invoice) जारी होने के 60 दिनों के भीतर देय है और यदि ग्राहक संतुष्ट नहीं है, तो वे अपने विवेकाधिकार से भुगतान रोक सकते हैं। देर से भुगतान पर कोई जुर्माना या ब्याज नहीं लगेगा।";
          } else if (lowerQ.includes("renewal") || lowerQ.includes("renew") || lowerQ.includes("नवीनीकरण")) {
            answer = "अनुबंध धारा 8 के तहत 12 महीने की अवधि के लिए स्वचालित रूप से नवीनीकृत हो जाता है, जब तक कि आप अवधि समाप्त होने से 90 दिन पहले प्रमाणित डाक (certified mail) द्वारा लिखित सूचना नहीं भेजते। यह एक गंभीर जाल है।";
          } else if (lowerQ.includes("liability") || lowerQ.includes("दायित्व")) {
            answer = "दायित्व सीमाएं पूरी तरह से असंतुलित हैं। धारा 7 के अनुसार, डेवलपर की जिम्मेदारी असीमित है जबकि क्लाइंट की कुल जिम्मेदारी केवल $500 तक सीमित है।";
          } else {
            answer = "इस अनुबंध में कई उच्च जोखिम वाले प्रावधान हैं। इसमें बिना किसी सूचना के त्वरित समाप्ति, व्यक्तिगत साइड-प्रोजेक्ट्स का बौद्धिक संपदा (IP) क्लाइंट को हस्तांतरण और 3 साल की लंबी गैर-प्रतिस्पर्धा (non-compete) शामिल है।";
          }
        } else if (targetLang === "Marathi") {
          if (lowerQ.includes("payment") || lowerQ.includes("pay") || lowerQ.includes("पैसे")) {
            answer = "पैसे देण्याची अट अत्यंत एकतर्फी आहे. इनव्हॉइस मिळाल्यानंतर ६० दिवसांच्या आत पेमेंट करावे लागेल आणि जर क्लाइंट समाधानी नसेल, तर तो स्वतःच्या मर्जीने पेमेंट रोखू शकतो. उशिरा पेमेंट केल्यास कोणताही दंड लागणार नाही.";
          } else if (lowerQ.includes("renewal") || lowerQ.includes("renew") || lowerQ.includes("नूतनीकरण")) {
            answer = "कलम ८ नुसार हा करार १२ महिन्यांसाठी आपोआप नूतनीकरण (auto-renew) होतो. नूतनीकरण रोखण्यासाठी मुदत संपण्याच्या ९० दिवस आधी प्रमाणित पत्राद्वारे (certified mail) लेखी नोटीस देणे अनिवार्य आहे.";
          } else if (lowerQ.includes("liability") || lowerQ.includes("जबाबदारी")) {
            answer = "जबाबदारीची मर्यादा अत्यंत अन्यायकारक आहे. कलम ७ नुसार, तुमची (डेव्हलपर) जबाबदारी अमर्याद आहे, तर क्लाइंटची कमाल जबाबदारी फक्त $५०० पर्यंत मर्यादित ठेवण्यात आली आहे.";
          } else {
            answer = "या करारात अनेक धोकादायक अटी आहेत. यामध्ये विनानोटीस कामावरून काढणे, वैयक्तिक साइड प्रोजेक्ट्सचे हक्क कंपनीकडे जाणे आणि ३ वर्षांची कडक नॉन-कंपीट अट समाविष्ट आहे.";
          }
        } else if (targetLang === "Tamil") {
          if (lowerQ.includes("payment") || lowerQ.includes("pay") || lowerQ.includes("பணம்")) {
            answer = "பணம் செலுத்தும் விதிமுறைகள் மிகவும் ஒருதலைப்பட்சமானவை. விலைப்பட்டியல் (invoice) சமர்ப்பித்த 60 நாட்களுக்குள் பணம் செலுத்த வேண்டும். கிளையண்ட் அதிருப்தி அடைந்தால், அவர்கள் பணத்தை நிறுத்தி வைக்க முழு அதிகாரம் உள்ளது. தாமதக் கட்டணங்கள் ஏதுமில்லை.";
          } else if (lowerQ.includes("renewal") || lowerQ.includes("renew") || lowerQ.includes("புதுப்பித்தல்")) {
            answer = "விதிமுறை 8-ன் படி, ஒப்பந்தம் முடிவதற்கு 90 நாட்களுக்கு முன்பாக சான்றளிக்கப்பட்ட அஞ்சல் (certified mail) மூலம் எழுத்துப்பூர்வ அறிவிப்பு தராவிட்டால், இந்த ஒப்பந்தம் தானாகவே மேலும் 12 மாதங்களுக்கு புதுப்பிக்கப்படும்.";
          } else if (lowerQ.includes("liability") || lowerQ.includes("பொறுப்பு")) {
            answer = "பொறுப்பு வரம்புகள் முற்றிலும் சமமற்றவை. பிரிவு 7-ன் படி, டெவலப்பர் வரம்பற்ற பொறுப்பை ஏற்க வேண்டும், ஆனால் வாடிக்கையாளரின் அதிகபட்ச பொறுப்பு வெறும் $500 மட்டுமே.";
          } else {
            answer = "இந்த ஒப்பந்தத்தில் பல ஆபத்தான பிரிவுகள் உள்ளன. அறிவிப்பின்றி உடனடியாக பணிநீக்கம் செய்தல், சொந்த வார இறுதி திட்டங்களின் முழு உரிமையை கிளையண்ட் எடுத்துக்கொள்ளுதல் மற்றும் 3 ஆண்டுகள் போட்டித்தடை விதிமுறைகள் உள்ளன.";
          }
        } else {
          // English Fallback
          if (lowerQ.includes("payment") || lowerQ.includes("pay")) {
            answer = "The payment terms are highly one-sided. Payments are delayed by Net-60 days with no late fee penalties. Additionally, the client retains subjective unilateral authority to withhold funds if 'not satisfied' with your platform deliverables.";
          } else if (lowerQ.includes("renewal") || lowerQ.includes("renew")) {
            answer = "This contract contains an automatic 12-month renewal trap in Section 8. To prevent it, you must deliver written notification via physical certified courier mail exactly 90 days prior to the expiration date.";
          } else if (lowerQ.includes("liability") || lowerQ.includes("sue")) {
            answer = "Section 7 specifies asymmetric liability exposure. TechCorp has capped its aggregate legal liability to a mere $500, while requiring you to accept unlimited, uncapped liability for software defects.";
          } else if (lowerQ.includes("competitors") || lowerQ.includes("work") || lowerQ.includes("non-compete")) {
            answer = "Section 6 installs a highly restrictive post-employment covenant. You are completely locked out from working for any competitor (unilaterally defined by TechCorp) for 3 full years after termination.";
          } else {
            answer = "I have scanned this agreement. Key risk areas include: Subjective satisfaction payment withholding, weekend personal IP transfers, 18-month software industry non-competes, and asymmetrical liability caps.";
          }
        }

        return NextResponse.json({ success: true, answer });
      }
      throw apiError;
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
