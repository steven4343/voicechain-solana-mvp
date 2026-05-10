const { config } = require("../config");

const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1";

const VOICES = {
  critical: "pNInz6obpgDQGcFmaJgB",
  high: "pNInz6obpgDQGcFmaJgB",
  medium: "pNInz6obpgDQGcFmaJgB",
  default: "pNInz6obpgDQGcFmaJgB",
};

function getApiKey() {
  if (!config.elevenlabs.apiKey) {
    throw new Error("ELEVENLABS_API_KEY not configured");
  }
  return config.elevenlabs.apiKey;
}

function getVoice(severity) {
  return VOICES[severity] || VOICES.default;
}

function buildVoiceSettings(severity) {
  const base = { similarity_boost: 0.75, use_speaker_boost: true };
  if (severity === "critical") {
    return { ...base, stability: 0.3, style: 0.4, speed: 0.95 };
  }
  if (severity === "high") {
    return { ...base, stability: 0.4, style: 0.2, speed: 1.0 };
  }
  return { ...base, stability: 0.5, speed: 1.0 };
}

function buildWarningText(riskScore, details) {
  if (riskScore >= 90) {
    return `CRITICAL WARNING. ${details?.reason || "This transaction is highly likely malicious"}. Do not proceed. Cancel immediately.`;
  }
  if (riskScore >= 75) {
    return `HIGH RISK ALERT. ${details?.reason || "This transaction shows suspicious patterns"}. Please review carefully before confirming.`;
  }
  if (riskScore >= 60) {
    return `WARNING. ${details?.reason || "This transaction may be risky"}. Exercise caution and verify all details before proceeding.`;
  }
  return null;
}

async function generateSpeech(text, options = {}) {
  const { model, voiceId, severity, outputFormat } = options;
  const apiKey = getApiKey();
  const vid = voiceId || getVoice(severity);

  const response = await fetch(
    `${ELEVENLABS_BASE}/text-to-speech/${vid}?output_format=${outputFormat || "mp3_44100_128"}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: model || config.elevenlabs.model,
        voice_settings: buildVoiceSettings(severity),
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text().catch(() => "");
    throw new Error(`ElevenLabs TTS error ${response.status}: ${err}`);
  }

  return response;
}

async function generateSpeechStream(text, options = {}) {
  const { model, voiceId, severity, outputFormat } = options;
  const apiKey = getApiKey();
  const vid = voiceId || getVoice(severity);

  const response = await fetch(
    `${ELEVENLABS_BASE}/text-to-speech/${vid}/stream?output_format=${outputFormat || "mp3_44100_128"}&optimize_streaming_latency=3`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: model || config.elevenlabs.model,
        voice_settings: buildVoiceSettings(severity),
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text().catch(() => "");
    throw new Error(`ElevenLabs stream error ${response.status}: ${err}`);
  }

  return response;
}

async function getVoices() {
  const apiKey = getApiKey();
  const response = await fetch(`${ELEVENLABS_BASE}/voices`, {
    headers: { "xi-api-key": apiKey },
  });
  if (!response.ok) throw new Error("Failed to fetch voices");
  return response.json();
}

module.exports = {
  generateSpeech,
  generateSpeechStream,
  buildWarningText,
  getVoices,
  getVoice,
};
