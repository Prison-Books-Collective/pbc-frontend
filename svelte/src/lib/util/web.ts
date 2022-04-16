export const METHOD_GET = { method: 'get' };
export const METHOD_POST = { method: 'post' };
export const METHOD_PUT = { method: 'put' };
export const METHOD_DELETE = { method: 'delete' };

export const CONTENT_TYPE_JSON = {
	'Content-Type': 'application/json;charset=utf-8'
};

export const uriQueryJoin = (queryMap: any) => {
	const paramNames = Object.keys(queryMap).filter((paramName) => queryMap[paramName] !== null);
	if (paramNames.length === 0) return '';

	return (
		'?' +
		encodeURI(
			paramNames.map((paramName) => `${paramName}=${queryMap[paramName].toString()}`).join('&')
		)
	);
};

// attempts to retrieve query parameter regardless of the format it may have been provided in
// expects paramName to contain spaces between words; ie: field name "firstName" would be input as "first name"
// will also search aliases in addition to formatting variants
export const getQueryParam = (url: URL, paramName: string, ...aliases: string[]) => {
	const paramParts = paramName.split(' ').map((s) => s.toLowerCase());
	const paramlowercase = paramParts.join('');
	const paramUPPERCASE = paramParts.map((s) => s.toUpperCase()).join('');
	const param_SCREAMING_SNAKE = paramParts.map((s) => s.toUpperCase()).join('_');
	const param_snake_case = paramParts.join('_');
	const paramKebabCase = paramParts.join('-');
	const paramCamelCase = paramParts
		.map((s, index) => (index > 0 ? s[0].toUpperCase() + s.substring(1) : s))
		.join('');

	for (const variant of [
		...aliases,
		paramlowercase,
		paramUPPERCASE,
		param_SCREAMING_SNAKE,
		param_snake_case,
		paramCamelCase,
		paramKebabCase,
	]) {
		const value = url.searchParams.get(variant);
		if (value) return value;
	}

	return null;
};
