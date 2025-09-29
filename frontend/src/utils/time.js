import dayjs from "@/plugins/dayjs";
import log from "@/plugins/log";

export function secondsToFuzzyDuration(seconds) {
	let suffix = "";
	if (seconds < 0) {
		seconds *= -1;
		suffix = " ago";
	}
	if (seconds < 90) {
		return `${Math.floor(seconds)}s${suffix}`;
	}
	seconds /= 60;
	if (seconds < 90) {
		return `${Math.floor(seconds)}m${suffix}`;
	}
	seconds /= 60;
	return `${Math.floor(seconds)}h${suffix}`;
}

export function msToFuzzyDuration(ms) {
	return secondsToFuzzyDuration(ms / 1000);
}

export function compareDateTime(a, b) {
	return parseDateTime(b).valueOf() - parseDateTime(a).valueOf();
}

export const displayTimeFormat = "h:mm a";
export const displayDateFormat = "DD/MM/YYYY";
export const displayDateTimeFormat = `${displayDateFormat} ${displayTimeFormat}`;

export const dataTimeFormat = "HH:mm";
export const dataDateFormat = "YYYY-MM-DD";
export const dataDateTimeFormat = `${dataDateFormat}T${dataTimeFormat}:ss.sss`;
export const displayLongDateTimeFormat = "dddd, D MMMM YYYY";

export const displayLongMonthDayFormat = "DD MMM";
export const displayLongFullDateFormat = "DD MMM, YYYY";
export const displayDayNameFormat = "ddd";

export const epochRegex = /\/Date\(-?(\d+)\)/;

const dateFormatsToTry = [
	displayDateFormat,
	dataDateFormat,
	"D/M/YYYY",
	// "D/M/YY", // This is excluded because this was not being identified unambiguously.
];

const timeFormatsToTry = [displayTimeFormat, "HH:mm:ss", "h:mm a", "hmm", "h:mm", "h a", "h"];

const dateTimeFormatsToTry = ["YYYY-MM-DDTHH:mm:ss"];
for (const timeFormat of timeFormatsToTry) {
	for (const dateFormat of dateFormatsToTry) {
		dateTimeFormatsToTry.push(`${dateFormat} ${timeFormat}`);
	}
}
dateTimeFormatsToTry.push(...dateFormatsToTry);
dateTimeFormatsToTry.push(...timeFormatsToTry);

function attemptToParse(name, formatsToTry, value) {
	if (!value) {
		return null;
	}
	let attempt = dayjs(value, formatsToTry);
	if (attempt.isValid()) {
		return Object.freeze(attempt);
	}
	log("DateTimeParser", `${name} parse failure`, value);
	return null;
}

export function parseTime(value) {
	value = precleanTime(value);
	return attemptToParse("time", timeFormatsToTry, value);
}

export function parseDate(value) {
	if (value && /^\d{8}$/.test(value)) {
		value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
	}

	return attemptToParse("date", dateFormatsToTry, value);
}

function precleanTime(value) {
	return value?.toLowerCase().replace(/ ?pm?$/i, " pm");
}

export function parseDateTime(value, overrideFormat = null) {
	if (value === "/Date(-62135596800000)/") {
		// This is the default C# datetime.
		return null;
	}
	if (overrideFormat) {
		return attemptToParse("datetime-override", overrideFormat, value);
	}
	if (typeof value === "string") {
		const epoch = epochRegex.exec(value);
		if (epoch) {
			return dayjs.tz(new Date(parseInt(epoch[1], 10)));
		}
		value = precleanTime(value);
	}
	return attemptToParse("datetime", dateTimeFormatsToTry, value);
}

export function dateRangeIsFullDay(startDate, endDate) {
	return startDate.isStartOfDay() && endDate.isEndOfDay() && startDate.isSame(endDate, "day");
}

export function dayIndexToDayName(index, long = false) {
	if (index === undefined || index === null) {
		return null;
	}

	// Index + 1 changes the order from Sunday being first day of week to Monday
	return dayjs()
		.day(index + 1)
		.format(long ? "dddd" : "ddd");
}
