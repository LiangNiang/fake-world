const exportedObject: { [key: string]: any } = {};

export function exportLocalStorage(): { [key: string]: any } {
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key) {
			let value = localStorage.getItem(key);
			try {
				value = value ? JSON.parse(value) : value;
			} catch (e) {}
			exportedObject[key] = value;
		}
	}

	return exportedObject;
}
