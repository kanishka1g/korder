class Clock {
  #override = null;

  //TODO:probably we can clean this up
  get now() {
    return this.#override ?? new Date();
  }

  set override(value) {
    this.#override = value instanceof Date ? value : new Date(value);
  }

  /** Clear the override */
  clearOverride() {
    this.#override = null;
  }

  static startOfDayUTC(d) {
    const nd = new Date(d);
    nd.setUTCHours(0, 0, 0, 0);
    return nd;
  }

  static endOfDayUTC(d) {
    const nd = new Date(d);
    nd.setUTCHours(23, 59, 59, 999);
    return nd;
  }

  static isSameDayUTC(a, b) {
    return (
      Clock.startOfDayUTC(a).getTime() === Clock.startOfDayUTC(b).getTime()
    );
  }

  static isAfterDayUTC(a, b) {
    return Clock.startOfDayUTC(a) > Clock.startOfDayUTC(b);
  }

  static isBeforeDayUTC(a, b) {
    return Clock.startOfDayUTC(a) < Clock.startOfDayUTC(b);
  }

  static weekdayNameUTC(d) {
    const weekdays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return weekdays[new Date(d).getUTCDay()];
  }
}

// Export instance as default, class as named export
const clock = new Clock();
export default clock;
export { Clock };
