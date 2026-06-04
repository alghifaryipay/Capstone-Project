function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  className = "",
  ...props
}) {
  return (
    <div>
      {label && (
        <label className="block mb-2 font-medium dark:text-white">
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full
          border border-gray-200
          dark:border-slate-700
          dark:bg-slate-700
          dark:text-white
          rounded-2xl
          p-4
          outline-none
          focus:border-blue-500
          transition-all
          ${className}
        `}
        {...props}
      />
    </div>
  );
}

export default Input;