<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class SFN_Cache_Store {
	public const STATE_OPTION = 'sfn_cache_state';

	/** @return array<int, array<string, mixed>> */
	public static function get_articles(): array {
		return array_values( self::get_state()['articles'] );
	}

	/** @param array<int, array<string, mixed>> $articles */
	public static function replace( array $articles ): void {
		self::persist( array( 'articles' => array_values( $articles ), 'status' => array( 'last_success' => time(), 'last_error' => '', 'count' => count( $articles ) ) ) );
	}

	public static function record_error( string $message ): void {
		$state = self::get_state();
		$state['status']['last_error'] = $message;
		self::persist( $state );
	}

	/** @return array{last_success:int,last_error:string,count:int} */
	public static function get_status(): array {
		return self::get_state()['status'];
	}

	private static function get_state(): array {
		$value = get_option( self::STATE_OPTION, array() );
		$value = is_array( $value ) ? $value : array();
		$articles = isset( $value['articles'] ) && is_array( $value['articles'] ) ? $value['articles'] : array();
		$status = isset( $value['status'] ) && is_array( $value['status'] ) ? $value['status'] : array();
		return array( 'articles' => $articles, 'status' => array_merge( array( 'last_success' => 0, 'last_error' => '', 'count' => count( $articles ) ), $status ) );
	}

	private static function persist( array $state ): void {
		update_option( self::STATE_OPTION, $state, false );
		if ( get_option( self::STATE_OPTION ) !== $state ) { throw new RuntimeException( 'WordPress could not persist the news cache.' ); }
	}
}
