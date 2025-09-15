import dayjs from "../plugins/dayjs.js";
import { parseDateTime } from "./time.js";

/**
 * Simple backend "clock" utility that updates every second.
 * Supports optional global override for testing or simulations.
 */
class Clock {
  #current;
  #override = null;

  constructor() {
    this.#current = dayjs().startOf("minute");

    setInterval(() => {
      const expected = this.#override ? parseDateTime(this.#override) : dayjs().startOf("minute");
      if (!expected.isSame(this.#current)) {
        this.#current = expected;
      }
    }, 1000);
  }

  /**
   * Get the current "now" value
   * @returns {dayjs}
   */
  get now() {
    return this.#current;
  }

  /**
   * Set a global override for "now"
   * @param {string|dayjs|null} value
   */
  set override(value) {
    this.#override = value;
  }
}

const clock = new Clock();
export default clock;
