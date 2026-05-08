const BACKEND_URL = "http://localhost:3001";

chrome.runtime.onInstalled.addListener(() => {
  console.log("[VoiceChain] Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TRANSACTION_INITIATED") {
    analyzeCurrentTransaction(sender.tab);
  }

  if (message.type === "WALLET_INTERACTION") {
    chrome.storage.sync.get(["logs"], (result) => {
      const logs = result.logs || [];
      logs.push({
        time: new Date().toLocaleTimeString(),
        level: "warn",
        message: `Wallet interaction on ${new URL(message.url).hostname}`,
      });
      chrome.storage.sync.set({ logs: logs.slice(-50) });
    });
  }
});

async function analyzeCurrentTransaction(tab) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/risk/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionData: {
          url: tab.url,
          timestamp: Date.now(),
        },
        walletAddress: null,
      }),
    });

    const result = await response.json();

    chrome.tabs.sendMessage(tab.id, {
      type: "SHOW_WARNING",
      warning: result.recommendation,
      riskScore: result.riskScore,
    });

    chrome.runtime.sendMessage({
      type: "TRANSACTION_ANALYZED",
      riskScore: result.riskScore,
      result: result.recommendation,
    });

    if (result.riskScore >= 75) {
      chrome.storage.sync.get(["voiceEnabled"], (data) => {
        if (data.voiceEnabled !== false) {
          const warningText = "Warning: Risky transaction detected on " + new URL(tab.url).hostname;
          speak(warningText);
        }
      });
    }
  } catch (error) {
    console.error("[VoiceChain] Analysis failed:", error);
  }
}

function speak(text) {
  chrome.storage.sync.get(["elevenLabsApiKey"], async (data) => {
    if (!data.elevenLabsApiKey) return;

    try {
      const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": data.elevenLabsApiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
        }),
      });

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error("[VoiceChain] Voice alert failed:", error);
    }
  });
}
