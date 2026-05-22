"""Full E2E walk of every public page + admin login + screenshots."""

import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "https://rougeintime.vercel.app"
OUT = Path("/tmp/rouge-screens/v3")
OUT.mkdir(parents=True, exist_ok=True)

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")


def shot(page, name: str, full: bool = False):
    page.screenshot(path=str(OUT / f"{name}.png"), full_page=full)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Desktop pages
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()
        all_errors: list[tuple[str, str]] = []
        page.on(
            "console",
            lambda m: all_errors.append((page.url, m.text)) if m.type == "error" else None,
        )

        pages = [
            ("home", "/"),
            ("catalog", "/productos"),
            ("catalog-sets", "/productos?cat=sets"),
            ("catalog-sorted", "/productos?orden=price-desc"),
            ("cat-sets", "/sets"),
            ("cat-corsets", "/corsets"),
            ("cat-body", "/body"),
            ("product-black-ritual", "/producto/black-ritual-e7n3w"),
            ("product-dominia", "/producto/dominia-7vjsb"),
            ("guia-talles", "/guia-de-talles"),
            ("contacto", "/contacto"),
            ("politica", "/politica-de-cambios"),
        ]

        print("=== DESKTOP WALK ===")
        for name, path in pages:
            url = f"{BASE}{path}"
            try:
                resp = page.goto(url, wait_until="networkidle", timeout=30000)
                status = resp.status if resp else "?"
                page.wait_for_timeout(800)
                shot(page, name, full=name in ("home", "catalog"))
                title = page.title()
                print(f"  {status} {path:40} → {title!r}")
            except Exception as e:
                print(f"  ✗ {path}: {e}")

        # Mobile walk
        print("\n=== MOBILE WALK ===")
        ctx_m = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2)
        page_m = ctx_m.new_page()
        for name, path in [("home", "/"), ("catalog", "/productos"), ("product", "/producto/black-ritual-e7n3w")]:
            try:
                page_m.goto(f"{BASE}{path}", wait_until="networkidle", timeout=30000)
                page_m.wait_for_timeout(800)
                shot(page_m, f"mobile-{name}", full=True)
                print(f"  mobile {path}")
            except Exception as e:
                print(f"  ✗ mobile {path}: {e}")

        # Cart flow (desktop)
        print("\n=== CART FLOW ===")
        page.goto(f"{BASE}/producto/black-ritual-e7n3w", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(800)
        # Click "Agregar al carrito"
        add_btn = page.get_by_role("button", name="Agregar al carrito")
        add_btn.click()
        page.wait_for_timeout(1500)
        shot(page, "cart-drawer-open")
        print("  cart drawer shown after add-to-cart")

        # Visit checkout
        page.goto(f"{BASE}/checkout", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(800)
        shot(page, "checkout", full=True)
        print("  checkout rendered")

        # Admin login
        print("\n=== ADMIN ===")
        page.goto(f"{BASE}/admin", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(500)
        url_now = page.url
        print(f"  /admin redirected to: {url_now}")
        shot(page, "admin-login")
        if ADMIN_EMAIL and ADMIN_PASSWORD and "login" in url_now:
            page.locator('input[name="email"]').fill(ADMIN_EMAIL)
            page.locator('input[name="password"]').fill(ADMIN_PASSWORD)
            page.locator('button[type="submit"]').click()
            page.wait_for_load_state("networkidle", timeout=30000)
            page.wait_for_timeout(800)
            shot(page, "admin-dashboard", full=True)
            print(f"  logged in, now at: {page.url}")
            page.goto(f"{BASE}/admin/productos", wait_until="networkidle")
            page.wait_for_timeout(800)
            shot(page, "admin-products", full=True)
            page.goto(f"{BASE}/admin/ordenes", wait_until="networkidle")
            page.wait_for_timeout(800)
            shot(page, "admin-orders", full=True)
            print("  admin walk done")
        else:
            print("  (skipping admin login — no env creds available)")

        print(f"\n=== CONSOLE ERRORS ({len(all_errors)}) ===")
        # Filter image 404s (expected for some categories)
        for url, msg in all_errors[:15]:
            kind = "img404" if "Failed to load resource" in msg else "ERR"
            print(f"  {kind}: {msg[:120]}")

        browser.close()


if __name__ == "__main__":
    main()
