export default function CardSkeleton() {

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
        animate-pulse
      "
    >

      <div className="h-4 bg-slate-700 rounded w-24 mb-6" />

      <div className="h-10 bg-slate-600 rounded w-32 mb-8" />

      <div className="flex items-center justify-between">

        <div className="h-6 bg-slate-700 rounded w-20" />

        <div className="h-12 w-12 rounded-2xl bg-slate-700" />

      </div>

    </div>

  );

}