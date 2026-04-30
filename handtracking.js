// handtracking.js
// MediaPipe Hands integration for Gesture Dashboard

let hands, camera;

function onResults(results) {
  const canvas = document.getElementById('skeleton-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {color: '#5cffa8', lineWidth: 2});
      drawLandmarks(ctx, landmarks, {color: '#fff', lineWidth: 1});
    }
  }
}

function startHandTracking() {
  hands = new Hands({
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });
  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
  });
  hands.onResults(onResults);

  const videoElement = document.getElementById('webcam');
  camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({image: videoElement});
    },
    width: 300,
    height: 224
  });
  camera.start();
}

document.addEventListener('DOMContentLoaded', startHandTracking);
