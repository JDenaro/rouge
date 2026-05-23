"""Thorough mobile UI audit — screenshots, horizontal overflow checks, tap targets."""

from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "https://rougeintime.vercel.app"
OUT = Path("/tmp/rouge-screens/mobile-audit")
OUT.mkdir(parents=True, exist_ok=True)

PAGES = [
    ("home", "/"),
    ("catalog", "/productos"),
    ("catalog-cat", "/productos?cat=sets"),
    ("cat-sets", "/sets"),
    ("cat-corsets", "/corsets"),
    ("product-detail", "/producto/black-ritual-e7n3w"),
    ("checkout", "/checkout"),
    ("guia-talles", "/guia-de-talles"),
    ("contacto", "/contacto"),
    ("politica", "/politica-de-cambios"),
    ("admin-login", "/admin/login"),
]


def check_horizontal_overflow(page) -> dict:
    """Detect elements that cause horizontal scroll."""
    return page.evaluate(
        """() => {
          const vw = document.documentElement.clientWidth;
          const docW = document.documentElement.scrollWidth;
          const offending = [];
          if (docW > vw) {
            document.querySelectorAll('*').forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.right > vw + 1 || r.left < -1) {
                const tag = el.tagName.toLowerCase();
                const cls = (el.className || '').toString().slice(0, 60);
                const id = el.id ? `#${el.id}` : '';
                offending.push({
                  tag, id, cls,
                  left: Math.round(r.left),
                  right: Math.round(r.right),
                  width: Math.round(r.width)
                });
              }
            });
          }
          return { vw, docW, overflow: docW > vw, offenders: offending.slice(0, 10) };
        }"""
    )


def check_tap_targets(page) -> list:
    """Find interactive elements that are too small (<32x32)."""
    return page.evaluate(
        """() => {
          const small = [];
          document.querySelectorAll('a, button, input, select').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.height > 0 && (r.width < 32 || r.height < 32)) {
              small.push({
                tag: el.tagName.toLowerCase(),
                w: Math.round(r.width),
                h: Math.round(r.height),
                text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40)
              });
            }
          });
          return small.slice(0, 15);
        }"""
    )


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=2,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        )
        page = ctx.new_page()
        console_errors: list[str] = []
        page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)

        print(f"{'PAGE':<22} {'STATUS':<8} {'VW':<4} {'DOCW':<5} {'OVFL':<5} {'SMALL_TAPS'}")
        print("=" * 70)
        issues: list[str] = []
        for name, path in PAGES:
            url = f"{BASE}{path}"
            try:
                resp = page.goto(url, wait_until="networkidle", timeout=30000)
                status = resp.status if resp else "?"
                page.wait_for_timeout(800)
            except Exception as e:
                print(f"  ✗ {name}: {e}")
                continue

            ovfl = check_horizontal_overflow(page)
            small = check_tap_targets(page)
            ovfl_mark = "❌" if ovfl["overflow"] else "✓"
            print(f"  {name:<20} {status:<8} {ovfl['vw']:<4} {ovfl['docW']:<5} {ovfl_mark:<5} {len(small)}")

            if ovfl["overflow"]:
                issues.append(f"{path}: overflow {ovfl['docW']}>{ovfl['vw']}")
                for o in ovfl["offenders"][:5]:
                    print(f"      offender: <{o['tag']}> .{o['cls']} → right={o['right']} (w={o['width']})")
            if small:
                for s in small[:3]:
                    print(f"      small-tap: <{s['tag']}> {s['w']}x{s['h']} {s['text']!r}")
                issues.append(f"{path}: {len(small)} small tap targets")

            page.screenshot(path=str(OUT / f"{name}.png"), full_page=True)

        # Test the hamburger menu drawer
        print("\n=== HAMBURGER DRAWER ===")
        page.goto(f"{BASE}/", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(500)
        try:
            hamburger = page.get_by_role("button", name="Abrir menú")
            if hamburger.count() > 0:
                hamburger.click()
                page.wait_for_timeout(700)
                page.screenshot(path=str(OUT / "drawer-open.png"))
                ovfl_drawer = check_horizontal_overflow(page)
                print(f"  drawer overflow: {ovfl_drawer['overflow']}")
                print("  drawer screenshot saved")
            else:
                print("  ❌ hamburger button NOT found")
                issues.append("hamburger button missing on mobile")
        except Exception as e:
            print(f"  ✗ hamburger error: {e}")
            issues.append(f"hamburger error: {e}")

        # Cart drawer on mobile
        print("\n=== CART DRAWER MOBILE ===")
        page.goto(f"{BASE}/producto/black-ritual-e7n3w", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(500)
        try:
            add_btn = page.get_by_role("button", name="Agregar al carrito")
            add_btn.click()
            page.wait_for_timeout(1500)
            page.screenshot(path=str(OUT / "cart-drawer-mobile.png"), full_page=False)
            ovfl_cart = check_horizontal_overflow(page)
            print(f"  cart drawer overflow: {ovfl_cart['overflow']}")
            print("  saved cart-drawer-mobile.png")
        except Exception as e:
            print(f"  ✗ cart error: {e}")

        print(f"\n=== CONSOLE ERRORS ({len(console_errors)}) ===")
        for e in console_errors[:8]:
            print(f"  {e[:140]}")

        print(f"\n=== ISSUES SUMMARY ({len(issues)}) ===")
        for i in issues:
            print(f"  - {i}")
        if not issues:
            print("  none! ✓")

        browser.close()


if __name__ == "__main__":
    main()
