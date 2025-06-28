export const Input = ({ className, ...props }) => (
  <input
    {...props}
    className={`border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
  />
);