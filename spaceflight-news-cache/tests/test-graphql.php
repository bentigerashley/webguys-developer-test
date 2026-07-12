<?php

function test_graphql(): void {
	SFN_Cache_GraphQL::init();
	sfn_assert_same( array( 'SFN_Cache_GraphQL', 'register' ), $GLOBALS['sfn_test_actions']['graphql_register_types'], 'GraphQL schema registration should use the WPGraphQL hook.' );
	SFN_Cache_GraphQL::register();
	sfn_assert( isset( $GLOBALS['sfn_test_graphql_types']['SpaceflightNewsArticle'] ), 'The typed article object should be registered.' );
	sfn_assert( isset( $GLOBALS['sfn_test_graphql_fields']['RootQuery']['spaceflightNews'] ), 'The root news field should be registered.' );

	$GLOBALS['sfn_test_options'][ SFN_Cache_Store::STATE_OPTION ] = array(
		'articles' => array(
			array( 'id' => 'old', 'title' => 'Old', 'published_at' => '2026-01-01T00:00:00+00:00', 'image_url' => 'https://example.com/old.jpg' ),
			array( 'id' => 'new', 'title' => 'New', 'published_at' => '2026-07-01T00:00:00+00:00', 'news_site' => 'Test' ),
		),
		'status' => array(),
	);
	$GLOBALS['sfn_test_http_calls'] = 0;
	$one = SFN_Cache_GraphQL::resolve( null, array( 'limit' => 1 ) );
	sfn_assert_same( 1, count( $one ), 'The requested limit should be applied.' );
	sfn_assert_same( 'new', $one[0]['id'], 'Cached articles should be returned newest first.' );
	sfn_assert_same( '', $one[0]['imageUrl'], 'Missing optional values should have stable string fields.' );
	sfn_assert_same( 0, $GLOBALS['sfn_test_http_calls'], 'Resolving GraphQL must never contact the upstream API.' );
	sfn_assert_same( 1, count( SFN_Cache_GraphQL::resolve( null, array( 'limit' => 0 ) ) ), 'Limits below one should clamp to one.' );
}
