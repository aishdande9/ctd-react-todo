import { forwardRef } from 'react';

const TextInputWithLabel = forwardRef(function TextInputWithLabel(
  {
    elementId,
    labelText,
    onChange,
    value,
  },
  ref
) {
  return (
    <>
      <label htmlFor={elementId}>
        {labelText}
      </label>

      <input
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
});

export default TextInputWithLabel;