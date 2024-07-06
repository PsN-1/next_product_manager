import PropTypes from "prop-types";

export const ProductField = ({
  field,
  value,
  onChange,
  disabled,
  readOnly,
  onClick,
}) => {
  return (
    <div className="sm:col-span-2">
      <label
        htmlFor={field}
        className="block text-sm font-medium text-gray-700"
      >
        {field}
      </label>
      <div className="mt-1">
        <input
          onChange={(e) => onChange(e.target.value)}
          onClick={onClick}
          readOnly={readOnly}
          type="text"
          disabled={disabled}
          name={field}
          value={value}
          id={field}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

ProductField.propTypes = {
  field: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  readOnly: PropTypes.bool,
};
