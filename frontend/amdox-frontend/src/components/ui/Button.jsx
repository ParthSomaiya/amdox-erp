export default function Button({
  children,
  className = "",
  ...props
}) {
  return (
    <button
      className={`
        h-12
        px-5
        rounded-2xl
        bg-gradient-to-r
        from-blue-500
        to-indigo-500
        text-white
        font-medium
        transition-all
        duration-300
        hover:scale-[1.02]
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}