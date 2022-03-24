export const METHOD_GET = { method: 'get' };
export const METHOD_POST = { method: 'post' };
export const METHOD_PUT = { method: 'put' };
export const METHOD_DELETE = { method: 'delete' };

export const CONTENT_TYPE_JSON = {
	'Content-Type': 'application/json;charset=utf-8'
};

export const uriQueryJoin = (queryMap: any) => {
	const paramNames = Object.keys(queryMap).filter(paramName => queryMap[paramName] !== null);
	if(paramNames.length === 0) return ''

	return '?' + encodeURI(paramNames
		.map(paramName => `${paramName}=${queryMap[paramName].toString()}`)
		.join('&'));
}