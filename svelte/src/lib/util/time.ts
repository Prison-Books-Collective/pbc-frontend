export const getCurrentDate = () => {
	return formatDate(new Date());
};

// returns date formatted as 'yyyy-mm-dd'
export const formatDate = (date: Date): string => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
};

export const formatDateForInvoice = (date: Date = new Date()) => {
	let timeZone = 'UTC'
	if (date.getDate() == new Date().getDate()) {
		timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
	}
	return date.toLocaleDateString('default', {
		month: 'long',
		day: '2-digit',
		year: 'numeric',
		timeZone
	});
};

export const delay = (ms: number) =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
