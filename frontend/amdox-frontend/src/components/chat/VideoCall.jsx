import {
  useEffect,
  useRef,
  useState,
} from "react";

import Peer from "simple-peer";

import io from "socket.io-client";

const socket =
  io("http://localhost:5000");

export default function VideoCall() {

  const [stream,
    setStream] =
    useState(null);

  const myVideo =
    useRef();

  const userVideo =
    useRef();

  const peerRef =
    useRef();

  // =========================
  // START CAMERA
  // =========================

  useEffect(() => {

    navigator.mediaDevices

      .getUserMedia({

        video: true,
        audio: true,

      })

      .then((currentStream) => {

        setStream(
          currentStream
        );

        myVideo.current.srcObject =
          currentStream;

      });

  }, []);

  // =========================
  // CREATE CALL
  // =========================

  const callUser =
    () => {

      const peer =
        new Peer({

          initiator: true,

          trickle: false,

          stream,

        });

      peer.on(

        "signal",

        (data) => {

          socket.emit(

            "signal",

            {
              roomId:
                "global-room",

              data,
            }

          );

        }

      );

      peer.on(

        "stream",

        (remoteStream) => {

          userVideo.current.srcObject =
            remoteStream;

        }

      );

      peerRef.current =
        peer;

    };

  // =========================
  // RECEIVE SIGNAL
  // =========================

  useEffect(() => {

    socket.on(

      "signal",

      ({ data }) => {

        if (
          !peerRef.current
        ) {

          const peer =
            new Peer({

              initiator: false,

              trickle: false,

              stream,

            });

          peer.on(

            "signal",

            (signalData) => {

              socket.emit(

                "signal",

                {
                  roomId:
                    "global-room",

                  data:
                    signalData,
                }

              );

            }

          );

          peer.on(

            "stream",

            (remoteStream) => {

              userVideo.current.srcObject =
                remoteStream;

            }

          );

          peer.signal(data);

          peerRef.current =
            peer;

        } else {

          peerRef.current.signal(
            data
          );

        }

      }

    );

  }, [stream]);

  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="flex gap-6 mb-6">

        <video

          ref={myVideo}

          autoPlay

          playsInline

          muted

          className="w-1/2 rounded shadow"

        />

        <video

          ref={userVideo}

          autoPlay

          playsInline

          className="w-1/2 rounded shadow"

        />

      </div>

      <button

        onClick={callUser}

        className="bg-blue-600 text-white px-6 py-3 rounded"

      >

        Start Video Call

      </button>

    </div>

  );

}