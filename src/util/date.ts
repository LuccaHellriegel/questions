export function today(): Date {
	return new Date();
}

export function tomorrow(from: Date = today()): Date {
	from.setDate(from.getDate() + 1);
	return from;
}

export function inAWeek(from: Date = today()): Date {
	from.setDate(from.getDate() + 7);
	return from;
}

export function inAMonth(from: Date = today()): Date {
	from.setMonth(from.getMonth() + 1);
	return from;
}
