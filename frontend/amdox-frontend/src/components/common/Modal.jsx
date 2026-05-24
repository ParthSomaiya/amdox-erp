export default function Modal({
  open,
  onClose,
  children,
}) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-lg w-[500px]">

        {children}

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>

      </div>

    </div>

  );

}