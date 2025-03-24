export function* range(start, end, step = 1) {
	switch (arguments.length) {
		case 1:
			end = start;
			start = 0;
			break;
		case 2:
		case 3:
			break;
		default:
			throw new Error("Invalid number of arguments");
	}

	for (let i = start; step > 0 ? i < end : i > end; i += step) {
		yield i;
	}
}

// Parameters left for code completion reasons.

export function rangeArray() {
	return [...range(...arguments)];
}

