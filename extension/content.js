(function () {
  console.log("[VoiceChain] Content script loaded");

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;

        const walletButtons = node.querySelectorAll?.('[class*="wallet-button"], [class*="connect"], [class*="WalletMultiButton"]') || [];
        walletButtons.forEach((btn) => {
          if (!btn.dataset.voicechainProtected) {
            btn.dataset.voicechainProtected = "true";
            btn.addEventListener("click", (e) => {
              chrome.runtime.sendMessage({ type: "WALLET_INTERACTION", url: window.location.href });
            });
          }
        });

        const txButtons = node.querySelectorAll?.('[class*="confirm"], [class*="send"], [class*="transfer"], [class*="approve"]') || [];
        txButtons.forEach((btn) => {
          if (!btn.dataset.voicechainProtected) {
            btn.dataset.voicechainProtected = "true";
            btn.addEventListener("click", (e) => {
              chrome.runtime.sendMessage({ type: "TRANSACTION_INITIATED", url: window.location.href });
            });
          }
        });
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SHOW_WARNING") {
      showWarningBanner(message.warning, message.riskScore);
    }
  });

  function showWarningBanner(warning, riskScore) {
    const existing = document.getElementById("voicechain-warning");
    if (existing) existing.remove();

    const banner = document.createElement("div");
    banner.id = "voicechain-warning";
    banner.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; z-index: 999999;
      background: ${riskScore >= 75 ? "rgba(239,68,68,0.95)" : "rgba(234,179,8,0.95)"};
      color: white; padding: 16px 24px; text-align: center;
      font-family: system-ui, sans-serif; font-size: 14px;
      display: flex; align-items: center; justify-content: center; gap: 12px;
    `;
    banner.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <span><strong>VoiceChain Warning:</strong> ${warning}</span>
      <button onclick="this.parentElement.remove()" style="background:rgba(255,255,255,0.2);border:none;color:white;padding:4px 12px;border-radius:6px;cursor:pointer;margin-left:12px;">Dismiss</button>
    `;

    document.body.prepend(banner);

    const audio = new Audio();
    audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==";
    audio.play().catch(() => {});
  }
})();
