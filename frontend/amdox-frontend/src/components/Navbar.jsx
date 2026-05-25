export default function Navbar() {
  return (
    <nav
      className="
        h-20
        px-8
        flex
        items-center
        justify-between
        border-b
        border-white/5
        bg-[#020617]/80
        backdrop-blur-xl
        sticky
        top-0
        z-40
      "
    >
      {/* SEARCH */}
      <div
        className="
          flex
          items-center
          gap-3
          bg-[#0F172A]
          border
          border-white/5
          h-12
          w-[360px]
          rounded-2xl
          px-4
        "
      >
        <span className="text-slate-400 text-lg">
          🔍
        </span>

        <input
          type="text"
          placeholder="Search anything..."
          className="
            bg-transparent
            outline-none
            text-sm
            w-full
            text-white
          "
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        <button
          className="
            h-12
            px-5
            rounded-2xl
            bg-gradient-to-r
            from-blue-500
            to-indigo-500
            flex
            items-center
            gap-2
            text-white
            font-medium
            shadow-lg
            shadow-blue-500/20
          "
        >
          ✨ AI Assistant
        </button>

        <button
          className="
            h-12
            w-12
            rounded-2xl
            bg-[#0F172A]
            border
            border-white/5
            flex
            items-center
            justify-center
            text-white
          "
        >
          🔔
        </button>

        <div
          className="
            h-12
            w-12
            rounded-2xl
            bg-gradient-to-r
            from-cyan-500
            to-blue-500
          "
        />
      </div>
    </nav>
  );
}