<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class SFN_Cache_API {
	public static function init(): void { add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) ); }
	public static function register_routes(): void {
		register_rest_route( 'spaceflight-news-cache/v1', '/articles', array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( __CLASS__, 'articles' ), 'permission_callback' => '__return_true' ) );
	}
	public static function articles(): WP_REST_Response { return rest_ensure_response( SFN_Cache_Store::get_articles() ); }
}
