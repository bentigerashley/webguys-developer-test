<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class SFN_Cache_GraphQL {
	private const DEFAULT_LIMIT = 7;
	private const MAX_LIMIT = 20;

	public static function init(): void {
		add_action( 'graphql_register_types', array( __CLASS__, 'register' ) );
	}

	public static function register(): void {
		if ( ! function_exists( 'register_graphql_object_type' ) || ! function_exists( 'register_graphql_field' ) ) {
			return;
		}
		register_graphql_object_type(
			'SpaceflightNewsArticle',
			array(
				'description' => __( 'A locally cached Spaceflight News article.', 'spaceflight-news-cache' ),
				'fields' => array(
					'id' => array( 'type' => 'String' ),
					'title' => array( 'type' => 'String' ),
					'summary' => array( 'type' => 'String' ),
					'imageUrl' => array( 'type' => 'String' ),
					'publishedAt' => array( 'type' => 'String' ),
					'newsSite' => array( 'type' => 'String' ),
					'url' => array( 'type' => 'String' ),
				),
			)
		);
		register_graphql_field(
			'RootQuery',
			'spaceflightNews',
			array(
				'type' => array( 'list_of' => 'SpaceflightNewsArticle' ),
				'args' => array( 'limit' => array( 'type' => 'Int', 'defaultValue' => self::DEFAULT_LIMIT ) ),
				'description' => __( 'Newest articles from the local Spaceflight News cache.', 'spaceflight-news-cache' ),
				'resolve' => array( __CLASS__, 'resolve' ),
			)
		);
	}

	/** @return array<int, array<string, string>> */
	public static function resolve( mixed $root = null, array $args = array() ): array {
		$limit = max( 1, min( self::MAX_LIMIT, (int) ( $args['limit'] ?? self::DEFAULT_LIMIT ) ) );
		$articles = SFN_Cache_Store::get_articles();
		usort( $articles, static fn( array $a, array $b ): int => strcmp( (string) ( $b['published_at'] ?? '' ), (string) ( $a['published_at'] ?? '' ) ) );
		return array_map(
			static fn( array $article ): array => array(
				'id' => (string) ( $article['id'] ?? '' ),
				'title' => (string) ( $article['title'] ?? '' ),
				'summary' => (string) ( $article['summary'] ?? '' ),
				'imageUrl' => (string) ( $article['image_url'] ?? '' ),
				'publishedAt' => (string) ( $article['published_at'] ?? '' ),
				'newsSite' => (string) ( $article['news_site'] ?? '' ),
				'url' => (string) ( $article['url'] ?? '' ),
			),
			array_slice( $articles, 0, $limit )
		);
	}
}
