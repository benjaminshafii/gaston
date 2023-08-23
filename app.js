// Accessing the DOM elements
const maxHeightInput = document.getElementById("max-height");
const startMeasurementButton = document.getElementById("start-measurement");
const estimatedHeightOutput = document.getElementById("estimated-height");
const accelerationOutput = document.getElementById("acceleration"); // New DOM element

// Defining the accelerometer data
let accelerometerData = { x: 0, y: 0, z: 0 };

// Defining the maximum height
let maxHeight = 0;

// Defining the estimated height
let estimatedHeight = 0;

// Defining the gravity constant
const gravity = 9.81;
if (window.DeviceMotionEvent) {
  console.log("hello");
  window.addEventListener("devicemotion", handleAccelerometer, true);
} else {
  alert("Your device does not support the Device Motion API.");
}

// Function to handle the accelerometer data
function handleAccelerometer(event) {
  accelerometerData = {
    x: event.accelerationIncludingGravity.x,
    y: event.accelerationIncludingGravity.y,
    z: event.accelerationIncludingGravity.z,
  };

  console.log(event, accelerometerData);
  // Update the acceleration in the DOM
  accelerationOutput.textContent = `X: ${accelerometerData.x.toFixed(
    2
  )}, Y: ${accelerometerData.y.toFixed(2)}, Z: ${accelerometerData.z.toFixed(
    2
  )}`;
}

// Function to calculate the estimated height
function calculateEstimatedHeight() {
  const totalAcceleration = Math.sqrt(
    accelerometerData.x * accelerometerData.x +
      accelerometerData.y * accelerometerData.y +
      accelerometerData.z * accelerometerData.z
  );

  const fallTime = Math.sqrt((2 * totalAcceleration) / gravity);
  estimatedHeight = 0.5 * gravity * fallTime * fallTime;

  // Update the estimated height in the DOM
  estimatedHeightOutput.textContent = (estimatedHeight / maxHeight).toFixed(2);
}

// Event listener for the start measurement button
startMeasurementButton.addEventListener("click", () => {
  maxHeight = parseFloat(maxHeightInput.value);
  if (isNaN(maxHeight) || maxHeight <= 0) {
    alert("Please enter a valid maximum height.");
    return;
  }
  requestMotionPermission();

  // Start listening to the accelerometer
  if (window.DeviceMotionEvent) {
    window.addEventListener("devicemotion", handleAccelerometer, true);
  } else {
    alert("Your device does not support the Device Motion API.");
    return;
  }

  // Start the measurement
  setInterval(calculateEstimatedHeight, 100);
  calculateEstimatedHeight();
});

function requestMotionPermission() {
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === "granted") {
          window.addEventListener("devicemotion", handleAccelerometer, true);
        } else {
          alert("Permission not granted for DeviceMotion");
        }
      })
      .catch(console.error);
  } else {
    // handle regular non iOS 13+ devices
    window.addEventListener("devicemotion", handleAccelerometer, true);
  }
}
