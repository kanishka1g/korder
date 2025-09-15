import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(customParseFormat);
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime);
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(timezone);
import isBetween from "dayjs/plugin/isBetween.js";
dayjs.extend(isBetween);
import minMax from "dayjs/plugin/minMax.js";
dayjs.extend(minMax);
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
dayjs.extend(isSameOrAfter);
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
dayjs.extend(isSameOrBefore);
import weekday from "dayjs/plugin/weekday.js";
dayjs.extend(weekday);
import weekOfYear from "dayjs/plugin/weekOfYear.js";
dayjs.extend(weekOfYear);

const defaultDisplayFormat = "D/M/YYYY h:mm a"; // Same as displayDateTimeFormat
dayjs.prototype.toString = function (style) {
	let format = defaultDisplayFormat;
	switch (style) {
		case "date":
			format = "D/M/YYYY"; // Same as displayDateFormat
			break;
		case "date-iso":
			format = "YYYY-MM-DD"; // Same as dataDateFormat
			break;
		case "time": // Same as displayTimeFormat
			format = "h:mm a";
			break;
		case undefined:
			// No argument supplied - use default.
			break;
		default:
			console.warn("Attempted to toString with invalid style", style);
			break;
	}
	return this.format(format);
};
dayjs.prototype.isStartOfDay = function () {
	return this.minute() === 0 && this.hour() === 0;
};
dayjs.prototype.isEndOfDay = function () {
	return this.minute() === 59 && this.hour() === 23;
};
export default dayjs;
