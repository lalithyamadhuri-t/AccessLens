import { test, expect } from '@playwright/test';

test('home dashboard renders core navigation and workflow', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Build experiences/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Open defect lab/i })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
});

test('defect lab can run a real axe-core audit', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Defect Lab/i }).click();
  await expect(page.getByRole('heading', { name: 'Accessibility defect lab' })).toBeVisible();
  await page.getByRole('button', { name: /Run accessibility audit/i }).click();
  await expect(page.getByRole('heading', { name: 'Audit report' })).toBeVisible();
  await expect(page.getByText(/LATEST RUN/i)).toBeVisible();
});

test('manual checklist has searchable test cases and status controls', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Manual checks' }).click();
  await expect(page.getByRole('heading', { name: 'Manual test checklist' })).toBeVisible();
  await expect(page.getByText('KB-01')).toBeVisible();
  await page.getByLabel('Result').first().selectOption('Pass');
  await expect(page.getByText('1', { exact: true }).first()).toBeVisible();
  await page.getByLabel('Search test cases').fill('screen reader');
  await expect(page.getByText('SR-01')).toBeVisible();
});

test('seeded and corrected fixture modes can be switched', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Defect Lab/i }).click();
  await page.getByLabel('Test scenario').selectOption('Forms');
  await expect(page.getByText(/Seeded defect: the email field/i)).toBeVisible();
  await page.getByRole('button', { name: 'Corrected example' }).click();
  await expect(page.getByText(/Corrected example: both fields/i)).toBeVisible();
});
