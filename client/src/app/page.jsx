"use client";
import { useState, useRef } from "react";

export default function ScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlobs, setRecordedBlobs] = useState([]);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      // Capture screen and tab audio
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: true, // Include system/tab audio
      });

      // Capture microphone audio with echo cancellation
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      // Combine the screen and microphone audio streams
      const combinedStream = new MediaStream([
        ...displayStream.getTracks(),
        ...micStream.getAudioTracks(),
      ]);

      // Save the combined stream for later use
      streamRef.current = combinedStream;

      // MediaRecorder setup
      const options = { mimeType: "video/webm; codecs=vp9,opus" }; // Use WebM for browser support
      const mediaRecorder = new MediaRecorder(combinedStream, options);
      mediaRecorderRef.current = mediaRecorder;

      const blobs = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          blobs.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setRecordedBlobs(blobs);

        // Stop all tracks to release resources
        combinedStream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedBlobs, { type: "video/webm" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "recording.webm"; // Save as WebM
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Screen Recorder</h2>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-6 py-3 rounded-lg text-white font-semibold shadow-md transition ${
          isRecording
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {!isRecording && recordedBlobs.length > 0 && (
        <button
          onClick={downloadRecording}
          className="px-6 py-3 mt-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md transition"
        >
          Download Recording
        </button>
      )}
    </div>
  );
}
