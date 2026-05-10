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
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("[VoiceChain] Speech failed:", error);
  }
}
