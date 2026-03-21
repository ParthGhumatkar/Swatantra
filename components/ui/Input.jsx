export default function Input({ 
  label, 
  error, 
  className = '', 
  required = false,
  type = 'text',
  ...props 
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-[var(--text-secondary)] mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-3 py-2 border rounded-lg bg-white text-black placeholder-gray-500 dark:bg-[var(--surface-2)] dark:text-[var(--text-primary)] dark:placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
