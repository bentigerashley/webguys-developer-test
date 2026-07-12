<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class SFN_Cache_Settings {
	public const OPTION = 'sfn_cache_settings';
	public const DEFAULT_FREQUENCY = 'hourly';

	/** @return array{search:string,date_cutoff:string,frequency:string} */
	public static function defaults(): array {
		return array( 'search' => '', 'date_cutoff' => '', 'frequency' => self::DEFAULT_FREQUENCY );
	}

	/** @return array<string, string> */
	public static function frequencies(): array {
		return array( 'hourly' => __( 'Hourly', 'spaceflight-news-cache' ), 'twicedaily' => __( 'Twice daily', 'spaceflight-news-cache' ), 'daily' => __( 'Daily', 'spaceflight-news-cache' ) );
	}

	/** @return array{search:string,date_cutoff:string,frequency:string} */
	public static function get(): array {
		$value = get_option( self::OPTION, array() );
		return array_merge( self::defaults(), is_array( $value ) ? $value : array() );
	}

	/** @param mixed $input @return array{search:string,date_cutoff:string,frequency:string} */
	public static function sanitize( $input ): array {
		$input = is_array( $input ) ? $input : array();
		$search = sanitize_text_field( (string) ( $input['search'] ?? '' ) );
		$date = sanitize_text_field( (string) ( $input['date_cutoff'] ?? '' ) );
		if ( '' !== $date && ! self::valid_date( $date ) ) {
			$date = '';
			add_settings_error( self::OPTION, 'invalid_date', __( 'The date cutoff must be a valid date.', 'spaceflight-news-cache' ) );
		}
		$frequency = sanitize_key( (string) ( $input['frequency'] ?? self::DEFAULT_FREQUENCY ) );
		if ( ! array_key_exists( $frequency, self::frequencies() ) ) {
			$frequency = self::DEFAULT_FREQUENCY;
		}
		return array( 'search' => $search, 'date_cutoff' => $date, 'frequency' => $frequency );
	}

	private static function valid_date( string $date ): bool {
		$parsed = DateTimeImmutable::createFromFormat( '!Y-m-d', $date );
		return $parsed instanceof DateTimeImmutable && $parsed->format( 'Y-m-d' ) === $date;
	}
}
