const baseClasses =
  "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

const variants = {
  primary:
    "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105",
  secondary:
    "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
  success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) {
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""
    } ${className}`;

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
