document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");
  const emergencyStopButton = document.getElementById("emergencyStopButton");

  const startSearch = () => {
    chrome.runtime.sendMessage({ command: "start" });
    startButton.disabled = true;
    stopButton.disabled = false;
    emergencyStopButton.disabled = false;
  };

  const stopSearch = () => {
    chrome.runtime.sendMessage({ command: "stop" });
    startButton.disabled = false;
    stopButton.disabled = true;
    emergencyStopButton.disabled = true;
  };

  const emergencyStop = () => {
    chrome.runtime.sendMessage({ command: "emergencyStop" });
    startButton.disabled = false;
    stopButton.disabled = true;
    emergencyStopButton.disabled = true;
  };

  startButton.addEventListener("click", startSearch);
  stopButton.addEventListener("click", stopSearch);
  emergencyStopButton.addEventListener("click", emergencyStop);
});
