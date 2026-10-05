const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }

  // Preserve File objects as-is
  if (obj instanceof File) {
    return obj;
  }

  if (obj !== null && typeof obj === "object") {
    const snakeCaseObj: Record<string, any> = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const snakeCaseKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
        snakeCaseObj[snakeCaseKey] = toSnakeCase(obj[key]);
      }
    }

    return snakeCaseObj;
  }

  return obj;
};

export { toSnakeCase };
