import asyncio
import os
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Base URL
        base_url = 'http://localhost:5173'

        # Check Login Page
        try:
            await page.goto(f"{base_url}/login")
            await page.wait_for_selector('img[alt="JOGAB Logo"]', timeout=5000)
            print("✓ Login branding found.")
        except Exception as e:
            print(f"✗ Login branding NOT found: {e}")

        # Login
        await page.fill('input[id="email"]', 'admin@jogab.com.br')
        await page.fill('input[id="password"]', 'jogab123')
        await page.click('button[type="submit"]')
        await page.wait_for_url('**/dashboard')

        # Check Sidebar (Collapsed)
        try:
            await page.wait_for_selector('aside img[src="/logo-sem-texto.png"]', timeout=5000)
            print("✓ Sidebar collapsed logo found.")
        except Exception as e:
            print(f"✗ Sidebar collapsed logo NOT found: {e}")

        # Check Sidebar (Expanded)
        try:
            await page.click('button[title="Fixar menu"]')
            await asyncio.sleep(0.5)
            await page.wait_for_selector('aside img[src="/logo-horizontal-branco.png"]', timeout=5000)
            print("✓ Sidebar expanded logo found.")
        except Exception as e:
            print(f"✗ Sidebar expanded logo NOT found: {e}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
