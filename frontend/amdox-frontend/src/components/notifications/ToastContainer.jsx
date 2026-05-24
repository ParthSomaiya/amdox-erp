import { Toaster } from "react-hot-toast";

export default function ToastContainer() {

  return (

    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,

        style: {
          background: "#333",
          color: "#fff",
        },
      }}
    />

  );

}