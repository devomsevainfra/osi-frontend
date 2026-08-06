/**
 * Reusable labelled form field.
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.label
 * @param {string} [props.type]
 * @param {string} [props.error]
 * @param {boolean} [props.required]
 * @param {React.ReactNode} [props.children] - pass a custom input/select/textarea
 * @param {string} [props.hint]
 */
export function FormField({
  id,
  label,
  type = 'text',
  error,
  required,
  hint,
  children,
  ...inputProps
}) {
  return (
    <div className="admin-form-field">
      <label htmlFor={id} className="admin-form-field__label">
        {label}
        {required && <span className="admin-form-field__req" aria-hidden>*</span>}
      </label>

      {children ? (
        children
      ) : (
        <input
          id={id}
          type={type}
          className={`admin-input ${error ? 'admin-input--error' : ''}`}
          {...inputProps}
        />
      )}

      {hint && !error && <p className="admin-form-field__hint">{hint}</p>}
      {error && <p className="admin-form-field__error" role="alert">{error}</p>}
    </div>
  );
}
