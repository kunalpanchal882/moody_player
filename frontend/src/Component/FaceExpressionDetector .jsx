import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const FaceExpressionDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mood, setMood] = useState("Loading...");

  // Load models and start video
  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      startVideo();
    };
    loadModels();
  }, []);

  // Start webcam
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Error starting webcam:", err));
  };

  // Detect expressions continuously
  const detectExpressions = async () => {
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
      .withFaceLandmarks()
      .withFaceExpressions();

   

    const dims = { width: 720, height: 560 };
    faceapi.matchDimensions(canvasRef.current, dims);
    const resized = faceapi.resizeResults(detections, dims);
    canvasRef.current.getContext("2d").clearRect(0, 0, 720, 560);

  };

  // Run detection every 500ms
  useEffect(() => {
    // let interval;
    // videoRef.current?.addEventListener("play", () => {
    //   interval = setInterval(detectExpressions, 500);
    // });
    // return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <video ref={videoRef} autoPlay muted width="720" height="560" />
        <canvas
          ref={canvasRef}
          width="720"
          height="560"
          style={{ position: "absolute", left: 0, top: 0 }}
        />
      </div>
      <h3 style={{ marginTop: "10px" }}>
        Current Mood: <span style={{ color: "#007bff" }}>{mood}</span>
      </h3>
      <button onClick={detectExpressions}>detect mood</button>
    </div>
  );
};

export default FaceExpressionDetector;
