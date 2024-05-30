export async function file2Blob(file: File) {
	const arrayBuffer = await file.arrayBuffer();
	return new Blob([arrayBuffer], { type: file.type });
}
