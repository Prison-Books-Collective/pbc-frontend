export const getCurrentDate = () => {
	return formatDate(new Date());
};

// returns date formatted as 'yyyy-mm-dd'
export const formatDate = (date: Date): string => {
	const year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
};

export const formatDateForInvoice = (date: Date = new Date()) => {
	return date.toLocaleDateString('default', {
		month: 'long',
		day: '2-digit',
		year: 'numeric'
	});
};

export const delay = (ms: number) =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
