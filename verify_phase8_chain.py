import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})

        # We need to find the actual port. Let's try to grab it from a file or just use a range.
        port = 5175
        base_url = f'http://localhost:{port}'

        # Login
        await page.goto(f"{base_url}/login")
        await page.fill('input[type="email"]', 'admin@jogab.com.br')
        await page.fill('input[type="password"]', 'jogab123')
        await page.click('button[type="submit"]')

        # Wait for navigation to dashboard
        await page.wait_for_url(f"{base_url}/dashboard")

        # 1. FOPAG List
        print("Navigating to FOPAG List")
        await page.goto(f"{base_url}/fopag", wait_until="networkidle")
        await asyncio.sleep(2)
        await page.screenshot(path='fopag_list.png')

        # 2. FOPAG Detail
        print("Navigating to FOPAG Detail")
        # Click the first "Abrir detalhe da competência" link
        await page.click('text=Abrir detalhe da competência')
        await page.wait_for_load_state("networkidle")
        await asyncio.sleep(2)
        await page.screenshot(path='fopag_detail.png')

        # 3. Financeiro Dashboard
        print("Navigating to Financeiro Dashboard")
        await page.goto(f"{base_url}/financeiro", wait_until="networkidle")
        await asyncio.sleep(2)
        # Click to expand personnel costs if present
        try:
            await page.click('text=Custo de pessoal por obra')
            await asyncio.sleep(1)
        except:
            pass
        await page.screenshot(path='financeiro_dashboard.png')

        await browser.close()
        print("Verification completed. Screenshots saved.")

if __name__ == "__main__":
    asyncio.run(run())
