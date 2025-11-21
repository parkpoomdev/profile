import { test, expect } from '@playwright/test'

test.describe('favicon', () => {
  test('is referenced in head and served by the app', async ({ page, request }) => {
    const iconResponse = await request.get('/favicon.ico')
    expect(iconResponse.ok()).toBeTruthy()
    expect(iconResponse.headers()['content-type']).toMatch(/image|icon/i)

    await page.goto('/')
    const iconHref = await page.locator('head link[rel="icon"]').first().getAttribute('href')
    expect(iconHref).toBeTruthy()

    const resolvedHref = new URL(iconHref!, page.url()).toString()
    const followUp = await request.get(resolvedHref)
    expect(followUp.ok()).toBeTruthy()
  })
})
