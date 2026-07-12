# Spaceflight News Cache

Install this directory in `wp-content/plugins/` and activate **Spaceflight News Cache**. Configure it under **Settings → Spaceflight News**.

The plugin refreshes up to 100 newest matching articles from Spaceflight News API v4. It retains the last successful cache if a request fails and prevents overlapping scheduled/manual refreshes.

Part 2 can read the cache without an upstream request:

```php
$articles = sfn_cache_get_articles();
```

Or request `GET /wp-json/spaceflight-news-cache/v1/articles`. Remote strings and URLs are normalized, but consumers must still escape for their output context (`esc_html()`, `esc_url()`, and so on).

Deactivation clears the scheduled event but intentionally preserves settings and cached articles.
