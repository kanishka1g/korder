export function removeFromArray(item, array) {
	let index = array.indexOf(item);
	if (index !== -1) {
		array.splice(index, 1);
	}
	return index;
}

export function addToArray(item, array, position, allowMultiple = false) {
	let index = array.indexOf(item);
	if (index === -1) {
		array.splice(position, 0, item);
	} else if (allowMultiple) {
		array.splice(position, 0, item);
	}
}

export function joinAnd(array, joinWord = "and") {
	return array
		.slice(0, -2)
		.concat(array.slice(-2).join(` ${joinWord} `))
		.join(", ");
}

export function preview(array, count = 3, map = (x) => x) {
	const extra = [];
	if (array.length > count) {
		extra.push(`and ${array.length - count + 1} more`);
		array = array.slice(0, count - 1);
	}
	return array.map(map).concat(extra).join(", ");
}

export function cmpFunction(func) {
	return function (a, b) {
		let result_a = func(a);
		let result_b = func(b);

		if (result_a < result_b) {
			return -1;
		}
		if (result_a > result_b) {
			return 1;
		}
		return 0;
	};
}

export function isFirst(item, array) {
	return array[0] === item;
}

export function isLast(item, array) {
	return array[array.length - 1] === item;
}

function moveItem(item, array, direction) {
	const oldIndex = removeFromArray(item, array);
	if (oldIndex === -1) {
		return;
	}
	let newIndex = oldIndex + direction;
	if (newIndex < 0) {
		// A negative number will count from the end of the array, causing the item to wrap around to the end
		newIndex = 0;
	}
	array.splice(newIndex, 0, item);
}

export function moveItemForward(item, array) {
	moveItem(item, array, 1);
}

export function moveItemBackward(item, array) {
	moveItem(item, array, -1);
}

export function contentsEqual(array1, array2, comparison = (a, b) => a === b) {
	if (array1.length !== array2.length) {
		return false;
	}
	for (let i = 0; i < array1.length; i += 1) {
		if (!comparison(array1[i], array2[i])) {
			return false;
		}
	}
	return true;
}

export function asArray(items) {
	/**
	 * Wraps the object in an array (if it isn't already one).
	 * Passing null/undefined will give you an empty array.
	 */
	if (items === undefined || items === null) {
		return [];
	}
	return Array.isArray(items) ? items : [items];
}

export function splitIntoHalf(array) {
	return [array.slice(0, array.length / 2), array.slice(array.length / 2)];
}
