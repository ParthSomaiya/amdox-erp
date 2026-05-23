import { useEffect, useRef } from "react";
import io from "socket.io-client";

const socket =
  io("http://localhost:5000");

export default function VideoCall() {

  const localVideo = useRef();

  useEffect(() => {

    startVideo();

  }, []);


  const startVideo =
    async () => {

      const stream =
        await navigator.mediaDevices.getUserMedia({

          video: true,
          audio: true,

        });

      localVideo.current.srcObject =
        stream;

    };

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-5">
        Video Call
      </h2>

      <video
        ref={localVideo}
        autoPlay
        muted
        className="w-full rounded shadow"
      />

    </div>

  );

}