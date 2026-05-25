export default function KpiCard({
  title,
  value,
  growth,
  icon = "📊",
}) {

  return (

    <div
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-white/5
        bg-[#0F172A]
        p-7
        transition-all
        duration-300
        hover:translate-y-[-6px]
        hover:border-cyan-500/30
      "
    >

      {/* GLOW */}

      <div
        className="
          absolute
          top-[-40px]
          right-[-40px]
          w-[140px]
          h-[140px]
          rounded-full
          bg-cyan-500/10
          blur-[70px]
        "
      />

      {/* TOP */}

      <div className="flex items-start justify-between">

        <div>

          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-black mt-4 tracking-tight">
            {value}
          </h2>

        </div>

        <div
          className="
            h-14
            w-14
            rounded-2xl
            bg-gradient-to-r
            from-cyan-500
            to-blue-500
            flex
            items-center
            justify-center
            text-2xl
            shadow-lg
            shadow-cyan-500/20
          "
        >
          {icon}
        </div>

      </div>

      {/* BOTTOM */}

      <div className="mt-8 flex items-center justify-between">

        <div
          className="
            px-3
            py-1
            rounded-full
            bg-emerald-500/10
            text-emerald-400
            text-sm
            font-medium
          "
        >
          {growth}
        </div>

        <p className="text-slate-500 text-sm">
          vs last month
        </p>

      </div>

    </div>

  );

}