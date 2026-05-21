function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  maxLength,
  minLength,
  required = false,
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        className={`w-full rounded-2xl border bg-white/90 px-4 py-3 text-base text-slate-900 outline-none transition ${
          error
            ? 'border-red-300 ring-2 ring-red-100'
            : 'border-slate-200 focus:border-tide focus:ring-2 focus:ring-sky-100'
        }`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        minLength={minLength}
        required={required}
      />
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

export default FormInput;
