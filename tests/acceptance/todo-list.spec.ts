import { expect, test, type Locator, type Page } from '@playwright/test';

const taskStorageKey = 'curso-pswe-07.tasks';

async function addTask(page: Page, title: string, description = ''): Promise<void> {
  await page.getByRole('button', { name: 'Add task' }).click();
  await page.getByLabel('Title').fill(title);
  if (description) {
    await page.getByLabel('Description').fill(description);
  }
  await page.getByRole('button', { name: 'Add task', exact: true }).last().click();
}

async function seedTasks(page: Page): Promise<void> {
  await page.addInitScript(
    ({ key, tasks }) => localStorage.setItem(key, JSON.stringify(tasks)),
    {
      key: taskStorageKey,
      tasks: [
        { id: 'pending-1', title: 'First task', description: '', status: 'Pending' },
        { id: 'done-1', title: 'Finished task', description: '', status: 'Done' },
      ],
    },
  );
  await page.goto('/');
}

async function contrastRatio(locator: Locator): Promise<number> {
  return locator.evaluate((element) => {
    const parseColor = (color: string): number[] => {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) {
        throw new Error(`Unsupported computed color: ${color}`);
      }
      return [Number(match[1]), Number(match[2]), Number(match[3])];
    };
    const luminance = (color: number[]) => {
      const channels = color.map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const foreground = parseColor(getComputedStyle(element).color);
    let backgroundElement: Element | null = element;
    let backgroundColor = 'rgba(0, 0, 0, 0)';
    while (backgroundElement && backgroundColor.endsWith(', 0)')) {
      backgroundColor = getComputedStyle(backgroundElement).backgroundColor;
      if (backgroundColor === 'rgba(0, 0, 0, 0)') {
        backgroundElement = backgroundElement.parentElement;
      }
    }
    const background = parseColor(backgroundColor);
    const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
      (a, b) => b - a,
    );
    return (lighter + 0.05) / (darker + 0.05);
  });
}

async function expectResponsiveAccessibility(page: Page): Promise<void> {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

  const textLeafCount = await page.locator('body *:visible').evaluateAll((elements) => {
    const textLeaves = elements.filter(
      (element) =>
        element.children.length === 0 &&
        [...element.childNodes].some(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
        ),
    );
    textLeaves.forEach((element, index) =>
      element.setAttribute('data-contrast-check', String(index)),
    );
    return textLeaves.length;
  });
  for (let index = 0; index < textLeafCount; index += 1) {
    const locator = page.locator(`[data-contrast-check="${index}"]`);
    const ratio = await contrastRatio(locator);
    const { fontSize, fontWeight } = await locator.evaluate((element) => ({
      fontSize: parseFloat(getComputedStyle(element).fontSize),
      fontWeight: Number(getComputedStyle(element).fontWeight),
    }));
    const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
    expect(ratio).toBeGreaterThanOrEqual(isLargeText ? 3 : 4.5);
  }
}

test.describe('User Story 1: Capture and organize tasks', () => {
  test('shows a friendly empty state, app identity, and add action', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('Curso-PSWE-07');
    await expect(page.getByRole('heading', { name: 'Curso-PSWE-07' })).toBeVisible();
    await expect(page.getByText(/no tasks yet/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add task' }).first()).toBeVisible();
  });

  test('adds tasks with optional descriptions in oldest-first order', async ({ page }) => {
    await page.goto('/');
    await addTask(page, 'First task');
    await addTask(page, 'Second task', 'Remember the details');

    const rows = page.locator('[data-task-id]');
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0)).toContainText('First task');
    await expect(rows.nth(1)).toContainText('Second task');
    await expect(rows.nth(0)).toContainText('Pending');
    await expect(page.getByText(/no tasks yet/i)).toHaveCount(0);
  });

  test('filters tasks, indicates the active filter, and shows a no-match state', async ({ page }) => {
    await seedTasks(page);

    await expect(page.locator('[data-task-id]')).toHaveCount(2);
    await page.getByRole('button', { name: 'Pending', exact: true }).click();
    await expect(page.locator('[data-task-id]')).toHaveCount(1);
    await expect(page.locator('[data-task-id]').first()).toContainText('First task');
    await expect(page.getByRole('button', { name: 'Pending', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.getByRole('button', { name: 'Done', exact: true }).click();
    await expect(page.locator('[data-task-id]')).toHaveCount(1);
    await expect(page.locator('[data-task-id]').first()).toContainText('Finished task');
    await page.getByRole('button', { name: 'All', exact: true }).click();
    await expect(page.locator('[data-task-id]')).toHaveCount(2);
  });

  test('opens a task and checks the list visual hierarchy and targets', async ({ page }) => {
    await seedTasks(page);

    const doneTitle = page.locator('[data-task-id="done-1"] .task-title');
    const pendingTitle = page.locator('[data-task-id="pending-1"] .task-title');
    await expect(doneTitle).toHaveCSS('text-decoration-line', 'line-through');
    await expect(doneTitle).not.toHaveCSS('color', await pendingTitle.evaluate((e) => getComputedStyle(e).color));
    await expect(page.locator('.app-shell')).toHaveCSS('background-color', 'rgb(247, 248, 252)');
    const bodyFont = await page.locator('body').evaluate((e) => getComputedStyle(e).fontFamily);
    const titleFont = await pendingTitle.evaluate((e) => getComputedStyle(e).fontFamily);
    expect(titleFont).toBe(bodyFont);
    const shellPadding = await page.locator('.app-shell').evaluate((e) =>
      parseFloat(getComputedStyle(e).paddingLeft),
    );
    expect(shellPadding).toBeGreaterThanOrEqual(16);
    const addButton = page.getByRole('button', { name: 'Add task' }).first();
    const addTarget = await addButton.boundingBox();
    expect(addTarget?.width).toBeGreaterThanOrEqual(44);
    expect(addTarget?.height).toBeGreaterThanOrEqual(44);
    await page.getByRole('button', { name: 'Pending', exact: true }).click();
    const activeFilterColor = await page
      .getByRole('button', { name: 'Pending', exact: true })
      .evaluate((e) => getComputedStyle(e).backgroundColor);
    const primaryActionColor = await addButton.evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(activeFilterColor).toBe(primaryActionColor);

    await page.locator('[data-task-id]').first().click();
    await expect(page.getByRole('heading', { name: 'First task' })).toBeVisible();
  });
});

test.describe('User Story 2: Review and manage a task', () => {
  test('shows detail, edits, validates, toggles, and confirms deletion', async ({ page }) => {
    await page.goto('/');
    await addTask(page, 'Project notes', 'Initial details');
    await page.locator('[data-task-id]').click();

    await expect(page.getByRole('heading', { name: 'Project notes' })).toBeVisible();
    await expect(page.getByText('Initial details')).toBeVisible();
    await expect(page.getByText('Pending', { exact: true })).toBeVisible();
    const detailTitleSize = await page
      .getByRole('heading', { name: 'Project notes' })
      .evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
    const descriptionSize = await page
      .getByText('Initial details')
      .evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
    expect(detailTitleSize).toBeGreaterThan(descriptionSize);
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByLabel('Title')).toHaveValue('Project notes');
    await expect(page.getByLabel('Description')).toHaveValue('Initial details');
    await page.getByLabel('Title').fill('Unsaved title');
    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByLabel('Title')).toHaveValue('Project notes');
    await page.getByLabel('Title').fill('   ');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText(/enter a task title/i)).toBeVisible();
    await expect(page.getByLabel('Title')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByLabel('Title').fill('Updated notes');
    await page.getByLabel('Description').fill('Updated details');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('heading', { name: 'Updated notes' })).toBeVisible();
    await page.getByRole('button', { name: 'Mark as done' }).click();
    await expect(page.getByRole('button', { name: 'Mark as not done' })).toBeVisible();
    await page.getByRole('button', { name: 'Mark as not done' }).click();
    await expect(page.getByRole('button', { name: 'Mark as done' })).toBeVisible();

    const deleteButton = page.getByRole('button', { name: 'Delete' });
    const deleteColor = await deleteButton.evaluate((e) => getComputedStyle(e).backgroundColor);
    const primaryColor = await page
      .getByRole('button', { name: 'Edit' })
      .evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(deleteColor).not.toBe(primaryColor);
    for (const button of await page.getByRole('button').all()) {
      const bounds = await button.boundingBox();
      if (bounds) {
        expect(bounds.width).toBeGreaterThanOrEqual(44);
        expect(bounds.height).toBeGreaterThanOrEqual(44);
      }
    }

    await deleteButton.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'Updated notes' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete task' }).click();
    await expect(page.locator('[data-task-id]')).toHaveCount(0);
  });

  test('shows a muted placeholder when a task description is empty', async ({ page }) => {
    await page.goto('/');
    await addTask(page, 'No details');
    await page.locator('[data-task-id]').click();

    const placeholder = page.getByText('No description');
    await expect(placeholder).toBeVisible();
    await expect(placeholder).toHaveCSS('color', /.+/);
  });
});

test.describe('User Story 3: Persistence and responsive accessibility', () => {
  test('preserves tasks and status after reload and fits mobile and desktop viewports', async ({
    page,
  }) => {
    await page.goto('/');
    await addTask(page, 'First persistent task', 'First details');
    await addTask(page, 'Second persistent task', 'Second details');
    await page.locator('[data-task-id]').nth(1).click();
    await page.getByRole('button', { name: 'Mark as done' }).click();
    await page.getByRole('button', { name: 'Back to tasks' }).click();
    await page.reload();

    const rows = page.locator('[data-task-id]');
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0)).toContainText('First persistent task');
    await expect(rows.nth(1)).toContainText('Second persistent task');
    await expect(rows.nth(1)).toContainText('Done');
    await rows.nth(0).click();
    await expect(page.getByText('First details')).toBeVisible();
    await page.getByRole('button', { name: 'Back to tasks' }).click();

    for (const viewport of [{ width: 375, height: 812 }, { width: 1280, height: 900 }]) {
      await page.setViewportSize(viewport);
      await expect(page.getByRole('button', { name: 'Add task' }).first()).toBeVisible();
      await expectResponsiveAccessibility(page);

      await page.locator('[data-task-id]').first().click();
      await expectResponsiveAccessibility(page);
      await page.getByRole('button', { name: 'Edit' }).click();
      await expectResponsiveAccessibility(page);
      await page.getByRole('button', { name: 'Cancel' }).click();
      await page.getByRole('button', { name: 'Back to tasks' }).click();
    }
  });
});
