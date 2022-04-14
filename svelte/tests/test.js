import { expect, test } from '@playwright/test';

test('index page focuses inmate search input on page load', async ({ page }) => {
	await page.goto('/');

	const inputElement = await page.waitForSelector('input:focus');
	const placeholderText = (await inputElement.getAttribute('placeholder')).toLowerCase();

	expect(inputElement).toBeTruthy();
	expect(placeholderText).toContain('inmate');
	expect(placeholderText).toContain('id');
	expect(placeholderText).toContain('press enter');
});
