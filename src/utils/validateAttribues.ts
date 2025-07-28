import { IAttribute } from "../types/category";

const isValidType = (type: string, value: any) => {
  switch (type) {
    case "String":
      return typeof value === "string";
    case "Number":
      return typeof value === "number";
    case "Boolean":
      return typeof value === "boolean";
    case "Date":
      return !isNaN(Date.parse(value));
    default:
      return false;
  }
};

export const validateAttribues = (
  cateAttr: IAttribute[],
  prodAttr: Record<string, any>
) => {
  const errors = [];
  for (const attr of cateAttr) {
    const value = prodAttr[attr.name];

    if (attr.required && (value === undefined || value === null)) {
      errors.push(`${attr.name} is required`);
      continue;
    }

    if (attr.multiple) {
      if (!Array.isArray(value)) {
        errors.push(`${attr.name} must be an array`);
        continue;
      }
      for (const v of value) {
        if (!isValidType(attr.type, v)) {
          errors.push(
            `${attr.name} contains invalid value "${v}" (expected ${attr.type})`
          );
        }
      }
    } else {
      if (!isValidType(attr.type, value)) {
        errors.push(`${attr.name} must be a ${attr.type.toLowerCase()}`);
      }
    }
  }
  return errors;
};
