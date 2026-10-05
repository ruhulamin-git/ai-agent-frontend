// eslint-disable-next-line @typescript-eslint/no-explicit-any
const objectToFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];

      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    }
  }

  return formData;
};

export { objectToFormData };
