function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        bg-white dark:bg-slate-800
        rounded-[32px]
        p-6
        shadow-sm
        hover:shadow-lg
        hover:-translate-y-1
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;