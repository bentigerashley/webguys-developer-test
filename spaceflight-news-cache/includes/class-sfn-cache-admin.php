<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class SFN_Cache_Admin {
	public const PAGE = 'spaceflight-news-cache';
	public static function init(): void {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_init', array( __CLASS__, 'register_settings' ) );
		add_action( 'admin_post_sfn_cache_refresh', array( __CLASS__, 'manual_refresh' ) );
	}
	public static function menu(): void { add_options_page( __( 'Spaceflight News', 'spaceflight-news-cache' ), __( 'Spaceflight News', 'spaceflight-news-cache' ), 'manage_options', self::PAGE, array( __CLASS__, 'render' ) ); }
	public static function register_settings(): void { register_setting( 'sfn_cache_group', SFN_Cache_Settings::OPTION, array( 'sanitize_callback' => array( 'SFN_Cache_Settings', 'sanitize' ), 'type' => 'array' ) ); }
	public static function manual_refresh(): void {
		if ( ! current_user_can( 'manage_options' ) ) { wp_die( esc_html__( 'You are not allowed to refresh this cache.', 'spaceflight-news-cache' ), '', array( 'response' => 403 ) ); }
		check_admin_referer( 'sfn_cache_refresh' );
		$result = SFN_Cache_Fetcher::refresh();
		$state = ! empty( $result['success'] ) ? 'success' : ( ! empty( $result['busy'] ) ? 'busy' : 'error' );
		wp_safe_redirect( add_query_arg( array( 'page' => self::PAGE, 'sfn_refresh' => $state ), admin_url( 'options-general.php' ) ) );
		exit;
	}
	public static function render(): void {
		if ( ! current_user_can( 'manage_options' ) ) { return; }
		$settings = SFN_Cache_Settings::get(); $status = SFN_Cache_Store::get_status(); $next = wp_next_scheduled( SFN_Cache_Plugin::CRON_HOOK );
		?>
		<div class="wrap"><h1><?php echo esc_html__( 'Spaceflight News Cache', 'spaceflight-news-cache' ); ?></h1>
		<?php settings_errors(); ?>
		<?php if ( isset( $_GET['sfn_refresh'] ) ) : ?><div class="notice notice-<?php echo 'success' === $_GET['sfn_refresh'] ? 'success' : 'warning'; ?> is-dismissible"><p><?php echo esc_html( 'success' === $_GET['sfn_refresh'] ? __( 'News cache refreshed.', 'spaceflight-news-cache' ) : __( 'The refresh did not complete. See status below.', 'spaceflight-news-cache' ) ); ?></p></div><?php endif; ?>
		<form action="options.php" method="post"><?php settings_fields( 'sfn_cache_group' ); ?><table class="form-table" role="presentation">
		<tr><th scope="row"><label for="sfn-search"><?php esc_html_e( 'Search phrase', 'spaceflight-news-cache' ); ?></label></th><td><input class="regular-text" id="sfn-search" name="<?php echo esc_attr( SFN_Cache_Settings::OPTION ); ?>[search]" value="<?php echo esc_attr( $settings['search'] ); ?>"></td></tr>
		<tr><th scope="row"><label for="sfn-cutoff"><?php esc_html_e( 'Date cutoff', 'spaceflight-news-cache' ); ?></label></th><td><input type="date" id="sfn-cutoff" name="<?php echo esc_attr( SFN_Cache_Settings::OPTION ); ?>[date_cutoff]" value="<?php echo esc_attr( $settings['date_cutoff'] ); ?>"></td></tr>
		<tr><th scope="row"><label for="sfn-frequency"><?php esc_html_e( 'Update frequency', 'spaceflight-news-cache' ); ?></label></th><td><select id="sfn-frequency" name="<?php echo esc_attr( SFN_Cache_Settings::OPTION ); ?>[frequency]"><?php foreach ( SFN_Cache_Settings::frequencies() as $value => $label ) : ?><option value="<?php echo esc_attr( $value ); ?>" <?php selected( $settings['frequency'], $value ); ?>><?php echo esc_html( $label ); ?></option><?php endforeach; ?></select></td></tr>
		</table><?php submit_button(); ?></form>
		<h2><?php esc_html_e( 'Cache status', 'spaceflight-news-cache' ); ?></h2><dl>
		<dt><?php esc_html_e( 'Cached articles', 'spaceflight-news-cache' ); ?></dt><dd><?php echo esc_html( (string) $status['count'] ); ?></dd>
		<dt><?php esc_html_e( 'Last successful refresh', 'spaceflight-news-cache' ); ?></dt><dd><?php echo esc_html( $status['last_success'] ? wp_date( 'Y-m-d H:i:s T', $status['last_success'] ) : __( 'Never', 'spaceflight-news-cache' ) ); ?></dd>
		<dt><?php esc_html_e( 'Next scheduled refresh', 'spaceflight-news-cache' ); ?></dt><dd><?php echo esc_html( $next ? wp_date( 'Y-m-d H:i:s T', $next ) : __( 'Not scheduled', 'spaceflight-news-cache' ) ); ?></dd>
		<?php if ( $status['last_error'] ) : ?><dt><?php esc_html_e( 'Latest error', 'spaceflight-news-cache' ); ?></dt><dd><?php echo esc_html( $status['last_error'] ); ?></dd><?php endif; ?></dl>
		<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post"><input type="hidden" name="action" value="sfn_cache_refresh"><?php wp_nonce_field( 'sfn_cache_refresh' ); ?><?php submit_button( __( 'Refresh now', 'spaceflight-news-cache' ), 'secondary' ); ?></form></div>
		<?php
	}
}
