<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class SFN_Cache_Fetcher {
	public const ENDPOINT = 'https://api.spaceflightnewsapi.net/v4/articles/';
	private const LOCK_KEY = 'sfn_cache_refresh_lock';
	private const LOCK_TTL = 300;
	private const MAX_ITEMS = 100;
	private const MAX_TEXT = 5000;

	/** @return array{success:bool,message:string,count?:int,busy?:bool} */
	public static function refresh(): array {
		$lock_owner = wp_generate_uuid4();
		if ( ! self::acquire_lock( $lock_owner ) ) {
			return array( 'success' => false, 'busy' => true, 'message' => __( 'A news refresh is already in progress.', 'spaceflight-news-cache' ) );
		}
		try {
			$settings = SFN_Cache_Settings::get();
			$query = array( 'limit' => self::MAX_ITEMS, 'ordering' => '-published_at' );
			if ( '' !== $settings['search'] ) { $query['search'] = $settings['search']; }
			if ( '' !== $settings['date_cutoff'] ) { $query['published_at_gte'] = $settings['date_cutoff'] . 'T00:00:00Z'; }
			$url = add_query_arg( $query, apply_filters( 'sfn_cache_api_endpoint', self::ENDPOINT ) );
			$response = wp_safe_remote_get( $url, array( 'timeout' => 10, 'redirection' => 2, 'limit_response_size' => 1024 * 1024, 'headers' => array( 'Accept' => 'application/json' ) ) );
			if ( is_wp_error( $response ) ) { throw new RuntimeException( $response->get_error_message() ); }
			$code = wp_remote_retrieve_response_code( $response );
			if ( 200 !== $code ) { throw new RuntimeException( sprintf( 'Spaceflight News API returned HTTP %d.', $code ) ); }
			$data = json_decode( wp_remote_retrieve_body( $response ), true );
			if ( ! is_array( $data ) || ! isset( $data['results'] ) || ! is_array( $data['results'] ) ) { throw new RuntimeException( 'Spaceflight News API returned an invalid response.' ); }
			if ( ! empty( $data['results'] ) && empty( self::normalize_results( $data['results'] ) ) ) {
				throw new RuntimeException( 'Spaceflight News API returned no valid articles in a non-empty result set.' );
			}
			$articles = self::normalize_results( $data['results'], $settings['date_cutoff'] );
			SFN_Cache_Store::replace( $articles );
			return array( 'success' => true, 'message' => __( 'News cache refreshed.', 'spaceflight-news-cache' ), 'count' => count( $articles ) );
		} catch ( Throwable $error ) {
			try { SFN_Cache_Store::record_error( $error->getMessage() ); } catch ( Throwable $status_error ) { /* The original refresh failure remains authoritative. */ }
			return array( 'success' => false, 'message' => $error->getMessage() );
		} finally {
			self::release_lock( $lock_owner );
		}
	}

	/** @param array<int, mixed> $results @return array<int, array<string, mixed>> */
	public static function normalize_results( array $results, string $cutoff = '' ): array {
		$normalized = array();
		$minimum = '' === $cutoff ? 0 : strtotime( $cutoff . ' 00:00:00 UTC' );
		foreach ( $results as $item ) {
			if ( ! is_array( $item ) || ! isset( $item['id'], $item['title'], $item['url'], $item['published_at'] ) ) { continue; }
			$published_value = (string) $item['published_at'];
			if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})$/', $published_value ) ) { continue; }
			try { $published_date = new DateTimeImmutable( $published_value ); } catch ( Exception $error ) { continue; }
			$published = $published_date->getTimestamp();
			$url = esc_url_raw( (string) $item['url'], array( 'http', 'https' ) );
			$image = empty( $item['image_url'] ) ? '' : esc_url_raw( (string) $item['image_url'], array( 'http', 'https' ) );
			if ( false === $published || $published < $minimum || '' === $url ) { continue; }
			$id = sanitize_text_field( (string) $item['id'] );
			if ( '' === $id ) { continue; }
			$normalized[ $id ] = array(
				'id' => $id,
				'title' => self::text( (string) $item['title'], 500 ),
				'summary' => self::text( (string) ( $item['summary'] ?? '' ), self::MAX_TEXT ),
				'image_url' => $image,
				'published_at' => gmdate( 'c', $published ),
				'news_site' => self::text( (string) ( $item['news_site'] ?? '' ), 200 ),
				'url' => $url,
			);
		}
		$normalized = array_values( $normalized );
		usort( $normalized, static fn( array $a, array $b ): int => strcmp( $b['published_at'], $a['published_at'] ) );
		return array_slice( $normalized, 0, self::MAX_ITEMS );
	}

	private static function text( string $value, int $length ): string {
		$value = trim( wp_strip_all_tags( $value, true ) );
		return function_exists( 'mb_substr' ) ? mb_substr( $value, 0, $length ) : substr( $value, 0, $length );
	}

	private static function acquire_lock( string $owner ): bool {
		$expires = time() + self::LOCK_TTL;
		if ( add_option( self::LOCK_KEY, array( 'owner' => $owner, 'expires' => $expires ), '', false ) ) { return true; }
		$current = get_option( self::LOCK_KEY, array() );
		if ( is_array( $current ) && (int) ( $current['expires'] ?? 0 ) < time() ) {
			delete_option( self::LOCK_KEY );
			return add_option( self::LOCK_KEY, array( 'owner' => $owner, 'expires' => $expires ), '', false );
		}
		return false;
	}

	private static function release_lock( string $owner ): void {
		$current = get_option( self::LOCK_KEY, array() );
		if ( is_array( $current ) && hash_equals( (string) ( $current['owner'] ?? '' ), $owner ) ) { delete_option( self::LOCK_KEY ); }
	}
}
