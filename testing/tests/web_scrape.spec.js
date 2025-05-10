// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://127.0.0.1:5000/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Game Media Scraper/);
});

// test('start web crawl for Elden Ring on Youtube', async ({ page }) => {
//   await page.goto('http://localhost:5173/');

//   // Add "Elden Ring" to the text input
//   await page.fill('#game', 'Elden Ring');

//   // Select the "Youtube" platform
//   await page.getByText('Youtube').click();

//   // Click the "Start web scrape" button
//   await page.getByRole('button', { name: 'Start web scrape' }).click();

//   // Verify that the web crawl starts
//   await page.waitForSelector('.CardList');
//   const cardListContent = await page.textContent('.CardList');
//   expect(cardListContent).not.toBe('');
// });

// test('start web crawl for Elden Ring on Reddit', async ({ page }) => {
//   await page.goto('http://localhost:5173/');

//   // Add "Elden Ring" to the text input
//   await page.fill('#game', 'Elden Ring');

//   // Select the "Reddit" platform
//   await page.getByText('Reddit').click();

//   // Click the "Start web scrape" button
//   await page.getByRole('button', { name: 'Start web scrape' }).click();

//   // Verify that the web crawl starts
//   await page.waitForSelector('.CardList');
//   const cardListContent = await page.textContent('.CardList');
//   expect(cardListContent).not.toBe('');
// });

test('start web crawl for Elden Ring on Steam', async ({ page }) => {
  await page.goto('http://127.0.0.1:5000/');

  // Add "Elden Ring" to the text input
  await page.fill('#game', 'Elden Ring');

  // Select the "Steam" platform
  await page.getByText('Steam').click();

  // Click the "Start web scrape" button
  await page.getByRole('button', { name: 'Start web scrape' }).click();

  // Verify that the web crawl starts
  await page.waitForSelector('.CardList');
  const cardListContent = await page.textContent('.CardList');
  expect(cardListContent).not.toBe('');
});

// Add test to open the dashboard
test('open dashboard', async ({ page }) => {
  await page.goto('http://127.0.0.1:5000/');

  // Click the "Dashboard" button
  await page.getByRole('button', { name: 'Dashboard' }).click();

  // Verify that the dashboard opens
  await page.waitForSelector('.Dashboard');
  const dashboardContent = await page.textContent('.Dashboard');
  expect(dashboardContent).not.toBe('');
});