function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  inputRef,
  value,
}) {
  return (
    <>
      <label htmlFor={elementId}>
        {labelText}
      </label>

      <input
        type="text"
        id={elementId}
        ref={inputRef}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel;