document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");
  const emergencyStopButton = document.getElementById("emergencyStopButton");
  const mobileSearchButton = document.getElementById("mobileSearchButton");

  startButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ command: "start" });
    startButton.disabled = true;
    stopButton.disabled = false;
    emergencyStopButton.disabled = false;
    mobileSearchButton.disabled = true;
  });
  
  stopButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ command: "stop" });
    startButton.disabled = false;
    stopButton.disabled = true;
    emergencyStopButton.disabled = true;
    mobileSearchButton.disabled = false;
  });
  
  emergencyStopButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ command: "emergencyStop" });
    startButton.disabled = false;
    stopButton.disabled = true;
    emergencyStopButton.disabled = true;
    mobileSearchButton.disabled = false;
  });

  mobileSearchButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ command: "mobileSearch" });
    mobileSearchButton.disabled = true;
  });
});
