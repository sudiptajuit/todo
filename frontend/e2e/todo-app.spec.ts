import { test, expect } from '@playwright/test'

test.describe('ToDo App E2E Tests', () => {
  test('should add a new todo', async ({ page }) => {
    await page.goto('/')

    // Fill in the title
    await page.fill('[placeholder="Title"]', 'Buy groceries')
    await page.fill('[placeholder="Description (optional)"]', 'Milk, eggs, bread')

    // Click Add button
    await page.click('button:has-text("Add")')

    // Wait for todo to appear
    await expect(page.locator('h3:has-text("Buy groceries")')).toBeVisible()
    await expect(page.locator('text=Milk, eggs, bread')).toBeVisible()
  })

  test('should toggle todo completion', async ({ page }) => {
    await page.goto('/')

    // Add a todo first
    await page.fill('[placeholder="Title"]', 'Test todo')
    await page.click('button:has-text("Add")')

    // Click complete button
    await page.click('button:has-text("Complete")')

    // Verify it shows Completed
    await expect(page.locator('button:has-text("Completed")')).toBeVisible()
  })

  test('should edit a todo', async ({ page }) => {
    await page.goto('/')

    // Add a todo
    await page.fill('[placeholder="Title"]', 'Original title')
    await page.click('button:has-text("Add")')

    // Click edit
    await page.click('button:has-text("Edit")')

    // Edit the title
    await page.fill('input[value="Original title"]', 'Updated title')
    await page.click('button:has-text("Save")')

    // Verify update
    await expect(page.locator('h3:has-text("Updated title")')).toBeVisible()
  })

  test('should delete a todo', async ({ page }) => {
    await page.goto('/')

    // Add a todo
    await page.fill('[placeholder="Title"]', 'To delete')
    await page.click('button:has-text("Add")')

    // Click delete
    await page.click('button:has-text("Delete")')

    // Handle confirmation dialog
    await page.on('dialog', dialog => dialog.accept())

    // Verify todo is removed
    await expect(page.locator('h3:has-text("To delete")')).not.toBeVisible()
  })
})
