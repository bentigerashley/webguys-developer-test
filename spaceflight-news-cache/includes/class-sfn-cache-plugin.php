<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class SFN_Cache_Plugin {
	public const CRON_HOOK = 'sfn_cache_refresh_event';

	public static function init(): void {
		add_action( 'init', array( __CLASS__, 'ensure_schedule' ) );
		add_action( self::CRON_HOOK, array( 'SFN_Cache_Fetcher', 'refresh' ) );
		SFN_Cache_Admin::init();
		SFN_Cache_API::init();
	}

	public static function activate(): void {
		if ( false === get_option( SFN_Cache_Settings::OPTION, false ) ) { add_option( SFN_Cache_Settings::OPTION, SFN_Cache_Settings::defaults() ); }
		if ( false === get_option( SFN_Cache_Store::STATE_OPTION, false ) ) { add_option( SFN_Cache_Store::STATE_OPTION, array( 'articles' => array(), 'status' => array( 'last_success' => 0, 'last_error' => '', 'count' => 0 ) ), '', false ); }
		self::ensure_schedule();
	}

	public static function deactivate(): void {
		wp_clear_scheduled_hook( self::CRON_HOOK );
	}

	public static function ensure_schedule(): void {
		$frequency = SFN_Cache_Settings::get()['frequency'];
		$event = wp_get_scheduled_event( self::CRON_HOOK );
		if ( $event && $event->schedule === $frequency ) { return; }
		$previous_schedule = $event ? $event->schedule : '';
		wp_clear_scheduled_hook( self::CRON_HOOK );
		$scheduled = wp_schedule_event( time() + 60, $frequency, self::CRON_HOOK, array(), true );
		if ( is_wp_error( $scheduled ) || false === $scheduled ) {
			if ( $previous_schedule ) { wp_schedule_event( time() + 60, $previous_schedule, self::CRON_HOOK ); }
			SFN_Cache_Store::record_error( __( 'WordPress could not schedule the news refresh.', 'spaceflight-news-cache' ) );
		}
	}
}
