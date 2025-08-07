import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceExpressionDetection = () => {
  const videoRef = useRef(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [mood, setMood] = useState("Neutral");

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      console.log("Models loaded");
    };
    loadModels();
  }, []);

  // Start video on user click
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraStarted(true);
      detectExpression();
    } catch (error) {
      console.error("Camera access denied or error:", error);
      alert("Please allow camera access.");
    }
  };

  // Detect expression every 2 seconds
  const detectExpression = () => {
    setInterval(async () => {
      if (!videoRef.current) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0) {
        const expressions = detections[0].expressions;
        const currentMood = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );
        setMood(currentMood);
        console.log("Detected Mood:", expressions);
      }
    }, 1
    000);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🎭 Face Expression Detection</h2>
      {!isCameraStarted && (
        <button onClick={startVideo} style={{ padding: "10px 20px", fontSize: "16px" }}>
          Start Camera
        </button>
      )}
      <div>
        <video
          ref={videoRef}
          autoPlay
          muted
          width="400"
          height="300"
          style={{ marginTop: "20px", borderRadius: "8px", border: "2px solid #ccc" }}
        />
      </div>
      <h3 style={{ marginTop: "20px" }}>
        Current Mood: <span style={{ color: "#007BFF" }}>{mood}</span>
      </h3>
    </div>
  );
};

export default FaceExpressionDetection;
