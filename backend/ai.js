const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const LLM_ENDPOINT = process.env.GOOGLE_LLM_ENDPOINT;
const EMBED_ENDPOINT = process.env.GOOGLE_EMBED_ENDPOINT;

async function callGoogleLLM(prompt){
  const body={prompt,maxOutputTokens:300};
  const res=await fetch(LLM_ENDPOINT+`?key=${GOOGLE_API_KEY}`,{
    method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)
  });
  const j=await res.json();
  return j?.candidates?.[0]?.content || j?.output?.[0]?.content || "";
}

async function categorizeEmail(text){
  try{
    const out=await callGoogleLLM(
      `You classify emails as Interested, Meeting Booked, Not Interested, Spam, Out of Office. Return only label.\n${text}`
    );
    const l=out.trim().toLowerCase();
    if(l.includes("interested")) return "Interested";
    if(l.includes("meeting")) return "Meeting Booked";
    if(l.includes("not")) return "Not Interested";
    if(l.includes("office")||l.includes("vacation")) return "Out of Office";
    if(l.includes("spam")) return "Spam";
    return "Not Interested";
  }catch(e){return "Not Interested";}
}

async function embedText(text){
  const res=await fetch(EMBED_ENDPOINT+`?key=${GOOGLE_API_KEY}`,{
    method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({input:text})
  });
  const j=await res.json();
  return j?.data?.[0]?.embedding || null;
}

module.exports={categorizeEmail,embedText};
