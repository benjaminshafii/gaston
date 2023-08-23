// Accessing the DOM elements
const maxHeightInput = document.getElementById("max-height");
const startMeasurementButton = document.getElementById("start-measurement");
const estimatedHeightOutput = document.getElementById("estimated-height");
const accelerationOutput = document.getElementById("acceleration"); // New DOM element
const fallingCountOutput = document.getElementById("falling-count");

// Defining the accelerometer data
let accelerometerData = { x: 0, y: 0, z: 0 };

// Defining the maximum height
let maxHeight = 0;

// Defining the estimated height
let estimatedHeight = 0;

// Defining the gravity constant
const gravity = 9.81;

// Defining the previous time
let previousTime = null;

// Defining the velocity
let velocity = 0;

// Defining the height
let height = 0;

// Defining the falling flag
let isFalling = false;

if (window.DeviceMotionEvent) {
  console.log("hello");
  window.addEventListener("devicemotion", handleAccelerometer, true);
} else {
  alert("Your device does not support the Device Motion API.");
}

let fallingCount = 0;

// Function to handle the accelerometer data
function handleAccelerometer(event) {
  const currentTime = new Date().getTime();
  const deltaTime = previousTime ? (currentTime - previousTime) / 1000 : 0;
  previousTime = currentTime;

  accelerometerData = {
    x: event.accelerationIncludingGravity.x,
    y: event.accelerationIncludingGravity.y,
    z: event.accelerationIncludingGravity.z,
  };

  const totalAcceleration = Math.sqrt(
    accelerometerData.x * accelerometerData.x +
      accelerometerData.y * accelerometerData.y +
      accelerometerData.z * accelerometerData.z
  );

  // Check if the object is falling
  if (totalAcceleration < gravity) {
    isFalling = true;
    velocity += totalAcceleration * deltaTime;
    height += velocity * deltaTime;

    if (!isFalling && height > 0.2) {
      // If the object was not falling before and the height is more than 20cm
      fallingCount++; // Increment the falling count
      fallingCountOutput.textContent = `Falling count: ${fallingCount}`; // Update the UI
    }
  } else {
    if (isFalling && height > 0.2) {
      // If the object was falling and the height is more than 20cm
      fallingCount++; // Increment the falling count
      fallingCountOutput.textContent = `Falling count: ${fallingCount}`; // Update the UI
    }
    isFalling = false;
    velocity = 0;
    height = 0;
  }

  // Update the acceleration and height in the DOM
  accelerationOutput.textContent = `X: ${accelerometerData.x.toFixed(
    2
  )}, Y: ${accelerometerData.y.toFixed(2)}, Z: ${accelerometerData.z.toFixed(
    2
  )}`;
  estimatedHeightOutput.textContent = isFalling
    ? `Falling from height: ${height.toFixed(2)} m`
    : "Not falling";
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
