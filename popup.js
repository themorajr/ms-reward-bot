document.addEventListener("DOMContentLoaded", () => {
  const statusText = document.getElementById("status");
  const buttons = {
    start: document.getElementById("startButton"),
    mobile: document.getElementById("mobileSearchButton"),
    stop: document.getElementById("stopButton"),
    emergency: document.getElementById("emergencyStopButton")
  };

  const render = (status) => {
    const running = Boolean(status && status.running);
    buttons.start.disabled = running;
    buttons.mobile.disabled = running;
    buttons.stop.disabled = !running;
    buttons.emergency.disabled = !running;

    if (running) {
      const label = status.mode === "mobile" ? "Mobile" : "PC";
      statusText.textContent = `${label} search running: ${status.done} / ${status.total}`;
    } else if (status && status.total > 0) {
      statusText.textContent = status.done >= status.total
        ? `Finished all ${status.total} searches.`
        : `Stopped at ${status.done} / ${status.total} searches.`;
    } else {
      statusText.textContent = "Idle";
    }
  };

  const send = async (command) => {
    try {
      render(await chrome.runtime.sendMessage({ command }));
    } catch {
      render(null);
    }
  };

  buttons.start.addEventListener("click", () => send("start"));
  buttons.mobile.addEventListener("click", () => send("mobileSearch"));
  buttons.stop.addEventListener("click", () => send("stop"));
  buttons.emergency.addEventListener("click", () => send("emergencyStop"));

  send("getStatus");
  setInterval(() => send("getStatus"), 1000);
});
