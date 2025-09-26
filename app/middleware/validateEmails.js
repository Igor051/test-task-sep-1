import { HttpError } from "../utils/errors.js";

const validateEmails = () => ({
  before: (request) => {
    const { items } = request.event;

    if (!Array.isArray(items) || items.length === 0) {
      throw new HttpError("Items must be a non-empty array", 400);
    }

    items.forEach((item, index) => {
      if (!item.body || typeof item.body !== "string" || !item.body.trim()) {
        throw new HttpError(
          `Item at index ${index} must have a non-empty body`,
          400
        );
      }
    });
  },
});

export default validateEmails;
