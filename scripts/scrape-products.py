"""
Scrape rougeintime.ar product catalog and save to scripts/products.json.

Walks /productos pagination and each known category to collect:
  name, slug, price, transferPrice (if shown), image URL, category, sizes/colors (best-effort).
"""

import json
import re
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "https://rougeintime.ar"

CATEGORIES = [
    "sets/3-piezas",
    "sets/4-piezas",
    "baby-doll",
    "conjuntos",
    "body",
    "bata",
    "catsuit",
    "corsets",
    "pijamas",
    "disfraces",
    "sexshop",
    "perfume-feromonas",
    "panty-vedetina-culotte",
]


def parse_price(text: str) -> int | None:
    """Parse '$80.000' / '$80,000' / '$ 80.000 ARS' into integer ARS."""
    if not text:
        return None
    digits = re.sub(r"[^\d]", "", text)
    return int(digits) if digits else None


def slugify(url: str) -> str:
    """Extract slug from product URL: /productos/black-ritual → 'black-ritual'."""
    return url.rstrip("/").rsplit("/", 1)[-1]


def primary_category(url: str) -> str:
    """First path segment after BASE."""
    path = url.replace(BASE, "").lstrip("/")
    return path.split("/", 1)[0] if path else ""


def scrape():
    out: dict[str, dict] = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            viewport={"width": 1440, "height": 900},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        )
        page = ctx.new_page()

        for cat_path in CATEGORIES:
            cat_url = f"{BASE}/{cat_path}"
            print(f"  → {cat_url}", file=sys.stderr)
            try:
                page.goto(cat_url, wait_until="networkidle", timeout=30000)
            except Exception as e:
                print(f"    ! failed: {e}", file=sys.stderr)
                continue
            page.wait_for_timeout(800)

            # Scroll to trigger lazy-load
            for _ in range(6):
                page.evaluate("window.scrollBy(0, 1200)")
                page.wait_for_timeout(300)

            cards = page.query_selector_all("li.js-item-product, .js-product-card, .item-product")
            if not cards:
                cards = page.query_selector_all('a[href*="/productos/"]')
                # Wrap to a card-like interface
                items = []
                for a in cards:
                    href = a.get_attribute("href") or ""
                    if not href.startswith("/productos/") and BASE not in href:
                        continue
                    full = href if href.startswith("http") else BASE + href
                    items.append({"href": full, "el": a})
                # Dedupe by href
                seen = set()
                cards_list = []
                for it in items:
                    if it["href"] in seen:
                        continue
                    seen.add(it["href"])
                    cards_list.append(it)
                cards = cards_list

            print(f"    cards={len(cards)}", file=sys.stderr)

            for card in cards:
                try:
                    if isinstance(card, dict):
                        url = card["href"]
                        el = card["el"]
                    else:
                        a = card.query_selector('a[href*="/"]')
                        if not a:
                            continue
                        href = a.get_attribute("href") or ""
                        url = href if href.startswith("http") else BASE + href
                        el = card

                    if not url or "/productos/" not in url and "/" not in url:
                        continue
                    slug = slugify(url)
                    if not slug or slug in out:
                        continue

                    # name
                    name_el = el.query_selector(".js-item-name, .item-name, h3, h2") or el
                    name = (name_el.inner_text() or "").strip().split("\n")[0]

                    # image
                    img = el.query_selector("img")
                    img_url = ""
                    if img:
                        img_url = (
                            img.get_attribute("data-src")
                            or img.get_attribute("data-srcset")
                            or img.get_attribute("src")
                            or ""
                        )
                        if "," in img_url:  # srcset
                            img_url = img_url.split(",")[0].strip().split(" ")[0]

                    # price
                    price_el = el.query_selector(".js-price-display, .price, .item-price")
                    price = parse_price(price_el.inner_text()) if price_el else None

                    out[slug] = {
                        "slug": slug,
                        "name": name or slug.replace("-", " ").title(),
                        "category": cat_path.split("/")[0],
                        "price": price,
                        "image": img_url,
                        "url": url,
                    }
                except Exception as e:
                    print(f"    ! card parse error: {e}", file=sys.stderr)

        browser.close()

    return list(out.values())


if __name__ == "__main__":
    products = scrape()
    print(f"\nTotal unique products: {len(products)}", file=sys.stderr)
    Path("scripts").mkdir(exist_ok=True)
    Path("scripts/products.json").write_text(json.dumps(products, indent=2, ensure_ascii=False))
    print(f"Saved scripts/products.json", file=sys.stderr)
