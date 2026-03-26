"""
verify_contratos.py — Playwright smoke test for the Contratos and RH workspace tabs.

Usage:
    python scripts/verify_contratos.py [--port PORT] [--base-url URL]

Environment variables:
    JOGAB_PORT      Port where the dev server is listening (default: 5173)
    JOGAB_BASE_URL  Full base URL override (takes precedence over JOGAB_PORT)
"""

import argparse
import asyncio
import os
from playwright.async_api import async_playwright


def get_base_url(args: argparse.Namespace) -> str:
    if args.base_url:
        return args.base_url.rstrip('/')
    port = args.port or int(os.getenv('JOGAB_PORT', '5173'))
    return f'http://localhost:{port}'


async def run(base_url: str) -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})

        print(f"Using base URL: {base_url}")

        # Login
        await page.goto(f"{base_url}/login")
        await page.fill('input[type="email"]', 'admin@jogab.com.br')
        await page.fill('input[type="password"]', 'jogab123')
        await page.click('button[type="submit"]')

        # Wait for navigation to dashboard
        await page.wait_for_url(f"{base_url}/dashboard")

        # Navigate to Contratos tab
        target_url = f'{base_url}/obras/obra-1/contratos'
        print(f"Navigating to {target_url}")
        await page.goto(target_url, wait_until="networkidle")

        await asyncio.sleep(2)
        await page.screenshot(path='contratos_tab.png')
        print("Screenshot saved to contratos_tab.png")

        # RH tab
        await page.goto(f'{base_url}/obras/obra-1/rh', wait_until="networkidle")
        await asyncio.sleep(2)
        await page.screenshot(path='rh_tab.png')
        print("Screenshot saved to rh_tab.png")

        await browser.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Verify Contratos and RH workspace tabs.')
    parser.add_argument('--port', type=int, default=None, help='Dev server port (default: JOGAB_PORT env or 5173)')
    parser.add_argument('--base-url', default=None, help='Full base URL (overrides --port)')
    args = parser.parse_args()

    asyncio.run(run(get_base_url(args)))
