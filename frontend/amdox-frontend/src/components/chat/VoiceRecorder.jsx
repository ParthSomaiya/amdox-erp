import { useState } from "react";

export default function VoiceRecorder() {

  const [recording, setRecording] =
    useState(false);

  let mediaRecorder;

  const startRecording =
    async () => {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      mediaRecorder =
        new MediaRecorder(stream);

      mediaRecorder.start();

      setRecording(true);

    };

  return (

    <button
      onClick={startRecording}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >

      {recording
        ? "Recording..."
        : "🎤 Voice"}

    </button>

  );

}