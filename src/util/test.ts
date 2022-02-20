import { expect } from "vitest";

export function expectUnchangedExcept<T extends Object>(oldData: T, newData: T, keysToIgnore: (keyof T)[]) {
	let count = 0;
	const keys = Object.keys(oldData);
	keys.forEach((key) => {
		if (!keysToIgnore.includes(key as keyof T)) {
			expect(newData[key]).toEqual(oldData[key]);
			count++;
		}
	});
	expect(count).toBeGreaterThan(0);
	expect(count).toBe(keys.length - keysToIgnore.length);
}
