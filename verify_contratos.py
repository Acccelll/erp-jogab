import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})

        port = 5175
        base_url = f'http://localhost:{port}'

        # Login
        await page.goto(f"{base_url}/login")
        await page.fill('input[type="email"]', 'admin@jogab.com.br')
        await page.fill('input[type="password"]', 'jogab123')
        await page.click('button[type="submit"]')

        # Wait for navigation to dashboard
        await page.wait_for_url(f"{base_url}/dashboard")

        # Now navigate to the target tab
        target_url = f'{base_url}/obras/obra-1/contratos'
        print(f"Navigating to {target_url}")
        await page.goto(target_url, wait_until="networkidle")

        await asyncio.sleep(2)
        await page.screenshot(path='contratos_tab.png')
        print("Screenshot saved to contratos_tab.png")

        # Also take screenshot of RH tab
        await page.goto(f'{base_url}/obras/obra-1/rh', wait_until="networkidle")
        await asyncio.sleep(2)
        await page.screenshot(path='rh_tab.png')
        print("Screenshot saved to rh_tab.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
