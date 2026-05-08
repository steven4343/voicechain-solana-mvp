const voiceToggle = document.getElementById("voiceToggle");
const autoBlockToggle = document.getElementById("autoBlockToggle");
const logContainer = document.getElementById("log");

chrome.storage.sync.get(["voiceEnabled", "autoBlockEnabled", "logs"], (result) => {
  voiceToggle.checked = result.voiceEnabled !== false;
  autoBlockToggle.checked = result.autoBlockEnabled !== false;
  renderLogs(result.logs || []);
});

voiceToggle.addEventListener("change", (e) => {
  chrome.storage.sync.set({ voiceEnabled: e.target.checked });
});

autoBlockToggle.addEventListener("change", (e) => {
  chrome.storage.sync.set({ autoBlockEnabled: e.target.checked });
});

function renderLogs(logs) {
  logContainer.innerHTML = "";
  logs.slice(-10).reverse().forEach((log) => {
    const item = document.createElement("div");
    item.className = `log-item ${log.level}`;
    item.innerHTML = `<span class="time">${log.time}</span> ${log.message}`;
    logContainer.appendChild(item);
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "TRANSACTION_ANALYZED") {
    chrome.storage.sync.get(["logs"], (result) => {
      const logs = result.logs || [];
      logs.push({
        time: new Date().toLocaleTimeString(),
        level: message.riskScore >= 75 ? "danger" : message.riskScore >= 40 ? "warn" : "safe",
        message: `Risk: ${message.riskScore}/100 - ${message.result}`,
      });
      chrome.storage.sync.set({ logs: logs.slice(-50) });
      renderLogs(logs);
    });
  }
});
