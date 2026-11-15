const profiles = {
  harbour: {
    name: "Harbour",
    description: "Calm, authoritative Canadian male — mid-30s",
    rate: 0.95,
    pitch: 0.9,
    volume: 1.0,
    lang: "en-CA",
    grok: "Use the Harbour voice: calm authoritative Canadian male, mid-30s, medium-low pitch, warm slightly gravelly timbre, moderate pace, calm confidence."
  },
  nova: {
    name: "Nova",
    description: "Warm, clear professional female — late 20s",
    rate: 1.0,
    pitch: 1.1,
    volume: 1.0,
    lang: "en-US",
    grok: "Use the Nova voice: warm clear professional female, late 20s, medium pitch, clear warm slightly bright timbre, moderate pace, friendly professionalism."
  }
};

const profileSelect = document.getElementById("profile");
const rateInput = document.getElementById("rate");
const pitchInput = document.getElementById("pitch");
const volumeInput = document.getElementById("volume");
const rateVal = document.getElementById("rateVal");
const pitchVal = document.getElementById("pitchVal");
const volumeVal = document.getElementById("volumeVal");
const textArea = document.getElementById("text");
const promptPreview = document.getElementById("promptPreview");

let currentUtterance = null;

function updateLabels() {
  rateVal.textContent = rateInput.value;
  pitchVal.textContent = pitchInput.value;
  volumeVal.textContent = volumeInput.value;
  updatePrompt();
}

function applyProfile(id) {
  if (id === "custom") return;
  const p = profiles[id];
  if (!p) return;
  rateInput.value = p.rate;
  pitchInput.value = p.pitch;
  volumeInput.value = p.volume;
  updateLabels();
}

function updatePrompt() {
  const id = profileSelect.value;
  const profile = profiles[id] || { name: "Custom", grok: "Use a custom voice with the settings below." };
  const text = textArea.value.trim() || "[your text here]";

  promptPreview.textContent = `Generate a voice sample with these exact parameters:

Voice Profile: ${profile.grok}
Tone / Emotion: calm confidence
Speaking Rate: ${rateInput.value} (relative)
Pitch: ${pitchInput.value} (relative)
Style: professional / conversational

Text to speak:
“${text}”

Keep the delivery natural and consistent with the voice profile. Do not add extra words.`;
}

function speak() {
  if (!window.speechSynthesis) {
    alert("Web Speech API is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(textArea.value);
  utterance.rate = parseFloat(rateInput.value);
  utterance.pitch = parseFloat(pitchInput.value);
  utterance.volume = parseFloat(volumeInput.value);

  const id = profileSelect.value;
  if (profiles[id]) {
    utterance.lang = profiles[id].lang;
  }

  // Prefer a matching voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.lang.startsWith(utterance.lang.split("-")[0]) &&
    (id === "harbour" ? v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("david") || v.name.toLowerCase().includes("alex") : true)
  );
  if (preferred) utterance.voice = preferred;

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

function stop() {
  window.speechSynthesis.cancel();
}

function copyPrompt() {
  navigator.clipboard.writeText(promptPreview.textContent).then(() => {
    const btn = document.getElementById("copyPrompt");
    const original = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = original), 1500);
  });
}

// Event listeners
profileSelect.addEventListener("change", (e) => applyProfile(e.target.value));
rateInput.addEventListener("input", updateLabels);
pitchInput.addEventListener("input", updateLabels);
volumeInput.addEventListener("input", updateLabels);
textArea.addEventListener("input", updatePrompt);

document.getElementById("speak").addEventListener("click", speak);
document.getElementById("stop").addEventListener("click", stop);
document.getElementById("copyPrompt").addEventListener("click", copyPrompt);

// Init
window.speechSynthesis.onvoiceschanged = () => {};
applyProfile("harbour");
updatePrompt();
