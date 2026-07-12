<?php

function test_api(): void {
	$GLOBALS['sfn_test_options'][ SFN_Cache_Store::STATE_OPTION ] = array( 'articles' => array( array( 'id' => 'cached', 'published_at' => '2026-07-12T00:00:00+00:00' ) ), 'status' => array( 'last_success' => 1, 'last_error' => '', 'count' => 1 ) );
	$calls = $GLOBALS['sfn_test_http_calls'];
	SFN_Cache_API::register_routes();
	$route = $GLOBALS['sfn_test_routes']['spaceflight-news-cache/v1/articles'];
	sfn_assert_same( 'GET', $route['methods'], 'REST route should be read-only.' );
	$response = SFN_Cache_API::articles();
	sfn_assert_same( 'cached', $response->data[0]['id'], 'REST route should return cached records.' );
	sfn_assert_same( $calls, $GLOBALS['sfn_test_http_calls'], 'REST reads must not call upstream.' );
}
