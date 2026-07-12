<?php

define( 'ABSPATH', __DIR__ . '/' );
define( 'MINUTE_IN_SECONDS', 60 );

$GLOBALS['sfn_test_options'] = array();
$GLOBALS['sfn_test_transients'] = array();
$GLOBALS['sfn_test_http'] = array( 'response' => array( 'code' => 200 ), 'body' => '{"results":[]}' );
$GLOBALS['sfn_test_http_calls'] = 0;
$GLOBALS['sfn_test_can_manage'] = true;
$GLOBALS['sfn_test_actions'] = array();
$GLOBALS['sfn_test_routes'] = array();

function __( $text ) { return $text; }
function esc_html__( $text ) { return $text; }
function sanitize_text_field( $value ) { return trim( preg_replace( '/[\r\n\t]+/', ' ', strip_tags( (string) $value ) ) ); }
function sanitize_key( $value ) { return preg_replace( '/[^a-z0-9_\-]/', '', strtolower( (string) $value ) ); }
function add_settings_error() {}
function get_option( $key, $default = false ) { return $GLOBALS['sfn_test_options'][ $key ] ?? $default; }
function update_option( $key, $value ) { $GLOBALS['sfn_test_options'][ $key ] = $value; return true; }
function add_option( $key, $value ) { if ( array_key_exists( $key, $GLOBALS['sfn_test_options'] ) ) { return false; } $GLOBALS['sfn_test_options'][ $key ] = $value; return true; }
function delete_option( $key ) { unset( $GLOBALS['sfn_test_options'][ $key ] ); return true; }
function get_transient( $key ) { return $GLOBALS['sfn_test_transients'][ $key ] ?? false; }
function set_transient( $key, $value ) { $GLOBALS['sfn_test_transients'][ $key ] = $value; return true; }
function delete_transient( $key ) { unset( $GLOBALS['sfn_test_transients'][ $key ] ); return true; }
function add_query_arg( $query, $url ) { return $url . '?' . http_build_query( $query ); }
function apply_filters( $tag, $value ) { return $value; }
function wp_safe_remote_get() { ++$GLOBALS['sfn_test_http_calls']; return $GLOBALS['sfn_test_http']; }
function is_wp_error( $value ) { return $value instanceof WP_Error; }
function wp_remote_retrieve_response_code( $response ) { return $response['response']['code']; }
function wp_remote_retrieve_body( $response ) { return $response['body']; }
function wp_strip_all_tags( $value ) { return strip_tags( $value ); }
function esc_url_raw( $value ) { return preg_match( '#^https?://#i', $value ) ? $value : ''; }
function add_action( $hook, $callback ) { $GLOBALS['sfn_test_actions'][ $hook ] = $callback; }
function register_rest_route( $namespace, $route, $args ) { $GLOBALS['sfn_test_routes'][ $namespace . $route ] = $args; }
function rest_ensure_response( $value ) { return new WP_REST_Response( $value ); }
function current_user_can() { return $GLOBALS['sfn_test_can_manage']; }
function wp_generate_uuid4() { static $id = 0; return '00000000-0000-4000-8000-' . str_pad( (string) ++$id, 12, '0', STR_PAD_LEFT ); }
function check_admin_referer() { $GLOBALS['sfn_nonce_checked'] = true; }
function wp_die( $message, $title = '', $args = array() ) { $GLOBALS['sfn_wp_die_args'] = $args; throw new RuntimeException( $message ); }

class WP_Error {
	public function __construct( private string $message ) {}
	public function get_error_message(): string { return $this->message; }
}
class WP_REST_Response {
	public function __construct( public mixed $data ) {}
}
class WP_REST_Server { public const READABLE = 'GET'; }

function sfn_assert( bool $condition, string $message ): void {
	if ( ! $condition ) { throw new RuntimeException( $message ); }
}
function sfn_assert_same( $expected, $actual, string $message ): void {
	if ( $expected !== $actual ) { throw new RuntimeException( $message . '\nExpected: ' . var_export( $expected, true ) . '\nActual: ' . var_export( $actual, true ) ); }
}

require_once dirname( __DIR__ ) . '/includes/class-sfn-cache-settings.php';
require_once dirname( __DIR__ ) . '/includes/class-sfn-cache-store.php';
require_once dirname( __DIR__ ) . '/includes/class-sfn-cache-fetcher.php';
require_once dirname( __DIR__ ) . '/includes/class-sfn-cache-api.php';
require_once dirname( __DIR__ ) . '/includes/class-sfn-cache-admin.php';
