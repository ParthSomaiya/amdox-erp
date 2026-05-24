import {
  useState,
  useRef,
} from "react";

export default function VoiceRecorder({

  onRecorded,

}) {

  const [recording,
    setRecording] =
    useState(false);

  const mediaRecorder =
    useRef(null);

  const chunks =
    useRef([]);

  // =========================
  // START
  // =========================

  const startRecording =
    async () => {

      const stream =
        await navigator.mediaDevices.getUserMedia({

          audio: true,

        });

      const recorder =
        new MediaRecorder(stream);

      mediaRecorder.current =
        recorder;

      recorder.ondataavailable =
        (e) => {

          chunks.current.push(
            e.data
          );

        };

      recorder.onstop =
        () => {

          const blob =
            new Blob(

              chunks.current,

              {
                type:
                  "audio/webm",
              }

            );

          onRecorded(blob);

          chunks.current = [];

        };

      recorder.start();

      setRecording(true);

    };

  // =========================
  // STOP
  // =========================

  const stopRecording =
    () => {

      mediaRecorder.current.stop();

      setRecording(false);

    };

  return (

    <button

      onClick={
        recording
          ? stopRecording
          : startRecording
      }

      className={`px-4 py-2 rounded text-white ${
        recording
          ? "bg-red-600"
          : "bg-green-600"
      }`}

    >

      {
        recording
          ? "Stop"
          : "Voice"
      }

    </button>

  );

}