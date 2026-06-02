function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    secondary:
      "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",

    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-50",

    danger:
      "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      type={type}
      className={`
        px-6 py-3
        rounded-2xl
        font-medium
        transition-all
        duration-200
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;