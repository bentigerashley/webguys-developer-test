<?php
/**
 * Plugin Name: FDI Headless CMS
 * Description: Portable ACF content model for the headless FDI homepage.
 * Version: 1.0.0
 * Requires PHP: 8.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/includes/class-fdi-home-fields.php';

FDI_Home_Fields::init();
