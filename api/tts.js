module.exports=async function(req,res){
  if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"Method not allowed"});}
  if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:"Neural speech is not configured"});
  const {text,profile}=req.body||{};
  if(typeof text!=="string"||!text.trim()||text.length>3000)return res.status(400).json({error:"Text must be 1–3000 characters"});
  const female=profile!=="harbour";
  try{
    const response=await fetch("https://api.openai.com/v1/audio/speech",{method:"POST",headers:{"Authorization":"Bearer "+process.env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4o-mini-tts",voice:female?"nova":"onyx",input:text,instructions:female?"Speak as a warm, soft, feminine, naturally expressive conversational companion. Gentle Canadian English inflection, unhurried authentic rhythm, subtle emotional nuance, never robotic or exaggerated.":"Speak as a calm, warm Canadian English male with natural pacing.",response_format:"mp3"})});
    if(!response.ok)return res.status(502).json({error:"Speech provider unavailable"});
    res.setHeader("Content-Type","audio/mpeg");res.setHeader("Cache-Control","no-store");
    return res.status(200).send(Buffer.from(await response.arrayBuffer()));
  }catch(e){return res.status(502).json({error:"Speech service unavailable"});}
};