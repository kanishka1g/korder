import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import timezone from "dayjs/plugin/timezone";
dayjs.extend(timezone);
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import minMax from "dayjs/plugin/minMax";
dayjs.extend(minMax);
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);
import weekday from "dayjs/plugin/weekday";
dayjs.extend(weekday);
import weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(weekOfYear);
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/en-au";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

dayjs.extend(localeData);
dayjs.locale("en-au");

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
