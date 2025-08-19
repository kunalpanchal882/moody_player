// FaceExpressionDetector.jsx
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "../Component/FaceExpressionDetector.css";


export default function FaceExpressionDetector() {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("Loading models…");
  // const intervalRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // models in public/models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      startVideo();
    };
    loadModels();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera error:", err);
      setExpression("Camera not accessible");
    }
  };

  const detetFaceExpresion = async () => {
    const video = videoRef.current;
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections.length > 0) {
      const exp = detections[0].expressions;
      const [best] = Object.entries(exp).sort((a, b) => b[1] - a[1]);
      setExpression(best[0]); // top expression
    } else {
      setExpression("No face detected");
    }

    console.log(expression);
  };

  // const handlePlay = () => {

  //   intervalRef.current = setInterval(async () => {

  //   }, 1000);
  // };

  return (
    <div className="mainContainer">
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ borderRadius: "8px" }}
        className="user-video-feed"
      />
      <button onClick={detetFaceExpresion}>detect face </button>
    </div>
  );
}
