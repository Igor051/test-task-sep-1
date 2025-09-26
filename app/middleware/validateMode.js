import { HttpError } from "../utils/errors.js";

const validateMode = () => ({
  before: (request) => {
    const { mode } = request.event;
    const validModes = ["classify", "summarize"];

    if (!validModes.includes(mode)) {
      throw new HttpError(
        `Invalid mode: ${mode}. Valid modes are: ${validModes.join(", ")}`,
        400
      );
    }
  },
});

export default validateMode;
