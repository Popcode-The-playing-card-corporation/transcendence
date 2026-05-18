export type errorT = {
  code: number,
  response: string,
};

export type backendErrorT = {
	error: string;
};


export function getError(data: unknown): string {

	if (data === null) {
		return "Unknown error";
	}

	if (typeof data === "string")
		return data;

	if (typeof data === "object") {

		if ("error" in data)
			return String(data.error);

		if ("detail" in data)
			return String(data.detail);

		const obj = data as Record<string, unknown>;
		const keys = Object.keys(obj);

		let res:string = "";
		let count:number = 0;
		for (const key of keys) {
			if (count != 0) {
				res += '\n';
			}
			res += key + ': ' + String(obj[key]);
			count += 1;
		}
		return res;
	}

	return "Unknown error";
}
