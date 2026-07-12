<?php
/**
 * Plugin Name: Spaceflight News Cache
 * Description: Caches filtered Spaceflight News API articles for local WordPress use.
 * Version: 1.0.0
 * Requires at least: 6.4
 * Requires PHP: 8.0
 * Author: Developer Test
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SFN_CACHE_VERSION', '1.0.0' );
define( 'SFN_CACHE_FILE', __FILE__ );

require_once __DIR__ . '/includes/class-sfn-cache-settings.php';
require_once __DIR__ . '/includes/class-sfn-cache-store.php';
require_once __DIR__ . '/includes/class-sfn-cache-fetcher.php';
require_once __DIR__ . '/includes/class-sfn-cache-admin.php';
require_once __DIR__ . '/includes/class-sfn-cache-api.php';
require_once __DIR__ . '/includes/class-sfn-cache-graphql.php';
require_once __DIR__ . '/includes/class-sfn-cache-plugin.php';

/**
 * Return cached Spaceflight News articles without contacting the remote API.
 *
 * @return array<int, array<string, mixed>>
 */
function sfn_cache_get_articles(): array {
	return SFN_Cache_Store::get_articles();
}

register_activation_hook( __FILE__, array( 'SFN_Cache_Plugin', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'SFN_Cache_Plugin', 'deactivate' ) );
SFN_Cache_Plugin::init();
