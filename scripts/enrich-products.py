"""
Enrich scripts/products.json by visiting each product page and reading JSON-LD.

Tiendanube embeds a clean Product schema with name, image, price, description
on every product detail page. Way more reliable than scraping rendered HTML.

Concurrency: 6 pages at a time via a context pool.
"""

import json
import sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from playwright.sync_api import sync_playwright

PRODUCTS_JSON = Path("scripts/products.json")

# Drop noisy slugs that aren't products
SKIP_SLUGS = {"productos", "", None}


def extract_product_jsonld(page) -> dict | None:
    """Return the first @type=Product JSON-LD object on the page, if any."""
    raw = page.evaluate(
        """() => Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
                    .map(s => s.textContent).filter(Boolean)"""
    )
    for s in raw:
        try:
            obj = json.loads(s)
        except Exception:
            continue
        if isinstance(obj, list):
            for o in obj:
                if isinstance(o, dict) and o.get("@type") == "Product":
                    return o
        elif isinstance(obj, dict):
            if obj.get("@type") == "Product":
                return obj
            inner = obj.get("mainEntity")
            if isinstance(inner, dict) and inner.get("@type") == "Product":
                return inner
    return None


def process_batch(urls_batch, worker_id):
    results = []
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        ctx = b.new_context(viewport={"width": 1280, "height": 800})
        page = ctx.new_page()
        for idx, prod in enumerate(urls_batch):
            try:
                page.goto(prod["url"], wait_until="networkidle", timeout=45000)
                # Wait for at least one JSON-LD script to appear (Tiendanube injects async)
                try:
                    page.wait_for_selector('script[type="application/ld+json"]', timeout=8000)
                except Exception:
                    pass
                page.wait_for_timeout(400)
                product_ld = extract_product_jsonld(page)
                if not product_ld:
                    print(f"  [w{worker_id}] {prod['slug']}: no JSON-LD", file=sys.stderr)
                    results.append({**prod, "_skip": True})
                    continue

                offer = product_ld.get("offers") or {}
                price_raw = offer.get("price") if isinstance(offer, dict) else None
                price = int(float(price_raw)) if price_raw else None

                enriched = {
                    **prod,
                    "name": product_ld.get("name") or prod["name"],
                    "image": product_ld.get("image") or prod["image"],
                    "description": product_ld.get("description", "").strip(),
                    "price": price,
                }
                results.append(enriched)
                if idx % 5 == 0:
                    print(f"  [w{worker_id}] {idx}/{len(urls_batch)} done", file=sys.stderr)
            except Exception as e:
                print(f"  [w{worker_id}] {prod['slug']}: error {e}", file=sys.stderr)
                results.append({**prod, "_skip": True})
        b.close()
    return results


def main():
    raw = json.loads(PRODUCTS_JSON.read_text())
    # Filter noise
    valid = [p for p in raw if p["slug"] not in SKIP_SLUGS and p["url"]]
    print(f"Enriching {len(valid)} products…", file=sys.stderr)

    # Split into 4 batches for parallel processing
    n_workers = 4
    batches = [valid[i::n_workers] for i in range(n_workers)]

    all_results = []
    with ThreadPoolExecutor(max_workers=n_workers) as ex:
        futures = {ex.submit(process_batch, batch, i): i for i, batch in enumerate(batches)}
        for fut in as_completed(futures):
            all_results.extend(fut.result())

    # Sort and filter
    final = [r for r in all_results if not r.get("_skip") and r.get("price")]
    final.sort(key=lambda x: x["slug"])
    print(f"\n{len(final)} products with price extracted", file=sys.stderr)

    Path("scripts/products-enriched.json").write_text(
        json.dumps(final, indent=2, ensure_ascii=False)
    )
    print("Saved scripts/products-enriched.json", file=sys.stderr)


if __name__ == "__main__":
    main()
