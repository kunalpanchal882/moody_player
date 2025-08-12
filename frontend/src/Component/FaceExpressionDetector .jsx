import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const FaceExpressionDetection = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState("Neutral");
  const detectionRequest = useRef(null);

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL ="/models";

      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL), // More accurate than TinyFaceDetector
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);

      startVideo();
    };

    loadModels();

    return () => stopVideo();
  }, []);

  // Start camera
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 720, height: 560 } })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Error accessing webcam:", err));
  };

  // Stop camera and cancel detection loop
  const stopVideo = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    if (detectionRequest.current) {
      cancelAnimationFrame(detectionRequest.current);
    }
  };

  // Detect face + expressions
  const detectExpressions = async () => {
    if (!videoRef.current || videoRef.current.readyState !== 4) {
      detectionRequest.current = requestAnimationFrame(detectExpressions);
      return;
    }

    const displaySize = {
      width: videoRef.current.width,
      height: videoRef.current.height,
    };
    faceapi.matchDimensions(canvasRef.current, displaySize);

    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
      .withFaceLandmarks()
      .withFaceExpressions();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

    // Pick most likely expression with threshold
    if (detections.length > 0) {
      const expressions = detections[0].expressions;
      const [bestExpression, confidence] = Object.entries(expressions).reduce(
        (a, b) => (a[1] > b[1] ? a : b)
      );

      if (confidence > 0.6) {
        setMood(bestExpression);
      }
    }

    detectionRequest.current = requestAnimationFrame(detectExpressions);
  };

  // Start detection when video plays
  useEffect(() => {
    if (!videoRef.current) return;

    const handlePlay = () => {
      setLoading(false);
      detectExpressions();
    };

    videoRef.current.addEventListener("play", handlePlay);
    return () => videoRef.current?.removeEventListener("play", handlePlay);
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      {loading && <p>Loading models & camera...</p>}
      <video ref={videoRef} autoPlay muted width="720" height="560" />
      <canvas ref={canvasRef} width="720" height="560" style={{ position: "absolute" }} />
      <h3 style={{ marginTop: "20px" }}>
        Current Mood: <span style={{ color: "#007BFF", textTransform: "capitalize" }}>{mood}</span>
      </h3>
    </div>
  );
};

export default FaceExpressionDetection;
