const profiles = {
  nova: {name:"Nova",rate:0.94,pitch:1.03,volume:1,lang:"en-CA",description:"Soft, feminine, warm and naturally expressive",grok:"A soft, feminine, warm Canadian English female voice, naturally expressive, intimate but not breathy, relaxed conversational rhythm, gentle emphasis, authentic pauses, never robotic."},
  harbour: {name:"Harbour",rate:0.95,pitch:0.9,volume:1,lang:"en-CA",description:"Calm Canadian male",grok:"A calm, confident Canadian English male voice with a natural conversational delivery."}
};
const $=id=>document.getElementById(id);
const synth=window.speechSynthesis;
let available=[],active=null,audio=null;
function status(message){$("status").textContent=message;}
function refreshVoices(){
  if(!synth)return;
  available=synth.getVoices();
  const selected=$("deviceVoice").value;
  $("deviceVoice").replaceChildren(new Option("Automatic (best match)",""));
  available.filter(v=>/^en/i.test(v.lang)).forEach(v=>$("deviceVoice").add(new Option(v.name+" ("+v.lang+")",v.voiceURI)));
  if([...$("deviceVoice").options].some(o=>o.value===selected))$("deviceVoice").value=selected;
  status(available.length?"Ready · "+available.length+" device voices available":"Ready · waiting for device voices");
}
function chosenVoice(){
  const exact=available.find(v=>v.voiceURI===$("deviceVoice").value);
  if(exact)return exact;
  const female=/samantha|ava|allison|susan|victoria|karen|moira|serena|zoe|female|jenny|aria|emma|olivia|nova/i;
  const male=/male|david|alex|daniel|aaron|tom|fred/i;
  const id=$("profile").value;
  const ranked=available.filter(v=>/^en/i.test(v.lang)).map(v=>({
    voice:v,score:(v.lang.toLowerCase()==="en-ca"?7:0)+(v.lang.toLowerCase().startsWith("en-")?2:0)
    +(id==="harbour"?(male.test(v.name)?12:0):(female.test(v.name)?12:0))
    +(v.localService?1:0)
  })).sort((a,b)=>b.score-a.score);
  return ranked[0]?.voice||null;
}
function updatePrompt(){
  const p=profiles[$("profile").value]||profiles.nova;
  $("promptPreview").textContent=`Voice direction: ${p.grok}\nSpeaking rate: ${$("rate").value}\nPitch: ${$("pitch").value}\nText: ${$("text").value.trim()}\nSpeak naturally without adding or removing words.`;
}
function applyProfile(){
  const p=profiles[$("profile").value]||profiles.nova;
  for(const key of ["rate","pitch","volume"])$(key).value=p[key];
  updateLabels();
}
function updateLabels(){
  for(const key of ["rate","pitch","volume"])$(key+"Val").textContent=$(key).value;
  updatePrompt();
}
function stop(){
  if(synth)synth.cancel();
  if(audio){audio.pause();audio.src="";audio=null;}
  active=null;status("Stopped");
}
async function speak(){
  const text=$("text").value.trim();
  if(!text){status("Enter text to speak");return;}
  stop();
  $("speak").disabled=true;
  status("Generating voice…");
  try{
    const response=await fetch("/api/tts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text,profile:$("profile").value})});
    if(response.ok){
      const blob=await response.blob();
      const url=URL.createObjectURL(blob);
      audio=new Audio(url);
      audio.onended=()=>{status("Finished");URL.revokeObjectURL(url);};
      audio.onerror=()=>{status("Audio playback failed");URL.revokeObjectURL(url);};
      await audio.play();
      status("Playing neural voice");
      return;
    }
  }catch(e){/* Neural service not configured: use device voice. */}
  if(!synth){status("Speech playback is unavailable on this device");$("speak").disabled=false;return;}
  const u=new SpeechSynthesisUtterance(text);
  const p=profiles[$("profile").value]||profiles.nova;
  u.lang=p.lang;
  u.rate=Number($("rate").value);u.pitch=Number($("pitch").value);u.volume=Number($("volume").value);
  const v=chosenVoice();if(v){u.voice=v;u.lang=v.lang;}
  u.onstart=()=>status("Playing device voice"+(v?" · "+v.name:""));
  u.onend=()=>status("Finished");
  u.onerror=e=>status("Playback error: "+e.error);
  active=u;synth.speak(u);
  status("Starting device voice…");
  $("speak").disabled=false;
}
$("profile").addEventListener("change",applyProfile);
for(const key of ["rate","pitch","volume"])$(key).addEventListener("input",updateLabels);
$("text").addEventListener("input",updatePrompt);
$("speak").addEventListener("click",speak);
$("stop").addEventListener("click",stop);
$("copyPrompt").addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText($("promptPreview").textContent);status("Prompt copied");}
  catch(e){status("Copy unavailable: select and copy the prompt manually");}
});
if(synth){synth.addEventListener?.("voiceschanged",refreshVoices);refreshVoices();}
applyProfile();
