import asyncio
from playwright.async_api import async_playwright
from urllib.parse import urljoin, urldefrag
from collections import deque
import aiofiles

BASE_URL = "http://localhost:8000"
LOG_FILE = "visited.log"
BROKEN_FILE = "broken-links.txt"
CONTENTS_FILE = "contents.txt"


async def check_page(page, source_url):
    url = page.url
    html = await page.content()

    # Save page content
    async with aiofiles.open(CONTENTS_FILE, "a") as f:
        await f.write(html)

    # Check for 404
    if "<h1>404 - Not found</h1>" in html:
        async with aiofiles.open(BROKEN_FILE, "a") as f:
            await f.write(f"[404] {url} (linked from {source_url})\n")

    # Broken image sources
    bad_imgs = await page.eval_on_selector_all(
        "img[src]",
        """els => els
            .map(e => ({ src: e.src, complete: e.complete, naturalWidth: e.naturalWidth }))
            .filter(e => !e.complete || e.naturalWidth === 0)
            .map(e => e.src)""",
    )
    if bad_imgs:
        async with aiofiles.open(BROKEN_FILE, "a") as f:
            for img in bad_imgs:
                await f.write(f"[Broken IMG] {img} on {url}\n")

    # Check anchor hrefs
    anchors = await page.eval_on_selector_all("a[href]", "els => els.map(e => e.href)")
    for link in anchors:
        link_url, _ = urldefrag(urljoin(url, link))
        if not link_url.startswith(BASE_URL):
            continue
        try:
            res = await page.context.request.get(link_url)
            if res.status >= 400:
                async with aiofiles.open(BROKEN_FILE, "a") as f:
                    await f.write(
                        f"[Broken LINK] {link_url} on {url} (status {res.status})\n"
                    )
        except Exception as e:
            async with aiofiles.open(BROKEN_FILE, "a") as f:
                await f.write(f"[Broken LINK] {link_url} on {url} (error {e})\n")


async def crawl(base_url):
    visited = set()
    queue = deque([(base_url, "(start)")])

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()

        async with aiofiles.open(LOG_FILE, "w") as log_file:
            while queue:
                raw_url, source_url = queue.popleft()
                url, _ = urldefrag(raw_url)

                if url in visited or not url.startswith(base_url):
                    continue
                visited.add(url)

                try:
                    await page.goto(url)
                    await check_page(page, source_url)
                    await log_file.write(url + "\n")
                    await log_file.flush()

                    links = await page.eval_on_selector_all(
                        "a[href]", "els => els.map(e => e.href)"
                    )
                    for link in links:
                        abs_link, _ = urldefrag(urljoin(url, link))
                        if abs_link.startswith(base_url) and abs_link not in visited:
                            queue.append((abs_link, url))

                except Exception as e:
                    print(f"Error visiting {url}: {e}")

        await browser.close()


if __name__ == "__main__":
    asyncio.run(crawl(BASE_URL))
