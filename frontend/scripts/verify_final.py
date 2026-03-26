import asyncio
import os
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        # Tentar conectar em portas comuns caso a 5173 não esteja ativa
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Base URL - check which one is active
        ports = [5173, 5174, 5175, 3000]
        base_url = None

        for port in ports:
            try:
                test_url = f'http://localhost:{port}'
                await page.goto(test_url, timeout=2000)
                base_url = test_url
                print(f"Connected to {base_url}")
                break
            except:
                continue

        if not base_url:
            print("Could not connect to dev server. Make sure 'npm run dev' is running.")
            await browser.close()
            return

        # 1. Check Login Page Branding
        try:
            await page.goto(f"{base_url}/login")
            # My added logo has alt="JOGAB Engenharia"
            await page.wait_for_selector('img[alt="JOGAB Engenharia"]', timeout=5000)
            print("✓ Login branding (logo-jogab.png) found.")
            await page.screenshot(path="verify_login.png")
        except Exception as e:
            print(f"✗ Login branding NOT found: {e}")

        # 2. Login
        await page.fill('input[id="email"]', 'admin@jogab.com.br')
        await page.fill('input[id="password"]', 'jogab123')
        await page.click('button[type="submit"]')
        await page.wait_for_url('**/dashboard', timeout=10000)
        print("✓ Logged in successfully.")

        # 3. Check Sidebar Branding
        try:
            # Check collapsed state (default)
            await page.wait_for_selector('aside img[src="/logo-sem-texto.png"]', timeout=5000)
            print("✓ Sidebar collapsed logo (logo-sem-texto.png) found.")

            # Expand Sidebar
            # The button title might be "Fixar menu" or "Recolher menu"
            await page.click('button[title="Fixar menu"]')
            await asyncio.sleep(1)
            await page.wait_for_selector('aside img[src="/logo-horizontal-branco.png"]', timeout=5000)
            print("✓ Sidebar expanded logo (logo-horizontal-branco.png) found.")
            await page.screenshot(path="verify_dashboard_sidebar.png")
        except Exception as e:
            print(f"✗ Sidebar branding issues: {e}")

        # 4. Check Mock Data (Hospital da Luz - OBR-007)
        try:
            # Open context selector for Obras
            # Find the select with the current obra OBR-001
            await page.click('div.flex.items-center.gap-2:has-text("OBR-001")')
            # Or just check if OBR-007 exists in the dropdown
            await page.wait_for_selector('text=OBR-007 — Hospital da Luz', timeout=5000)
            print("✓ OBR-007 found in global context selector.")

            # Select it
            await page.click('text=OBR-007 — Hospital da Luz')
            await asyncio.sleep(1)

            # Check if Dashboard updated with OBR-007 data (Analytical)
            # The title of the card should contain Hospital da Luz
            await page.wait_for_selector('text=Obra com maior custo de pessoal — Hospital da Luz', timeout=5000)
            print("✓ Dashboard showing OBR-007 data.")
            await page.screenshot(path="verify_obra_data.png")

        except Exception as e:
            print(f"✗ Mock data verification failed: {e}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
