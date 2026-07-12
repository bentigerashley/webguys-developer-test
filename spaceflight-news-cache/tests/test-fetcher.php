<?php

function test_fetcher(): void {
	$winning_article_url = 'https://spaceflightnow.com/2026/07/11/example-mission-update/';
	$rows = array(
		array( 'id' => 7, 'title' => '<script>x</script> New', 'summary' => '<b>Summary</b>', 'url' => 'https://spaceflightnow.com/2026/07/10/earlier-mission-report/', 'image_url' => 'javascript:alert(1)', 'published_at' => '2026-07-10T12:00:00Z', 'news_site' => '<i>Site</i>' ),
		array( 'id' => 7, 'title' => 'Updated', 'url' => $winning_article_url, 'published_at' => '2026-07-11T12:00:00Z' ),
		array( 'id' => 8, 'title' => 'Old', 'url' => 'https://example.com/old', 'published_at' => '2026-06-01T12:00:00Z' ),
		array( 'id' => 9, 'title' => 'Unsafe', 'url' => 'javascript:alert(1)', 'published_at' => '2026-07-09T12:00:00Z' ),
	);
	$clean = SFN_Cache_Fetcher::normalize_results( $rows, '2026-07-01' );
	sfn_assert_same( 1, count( $clean ), 'Cutoff, unsafe records, and duplicate IDs should be handled.' );
	sfn_assert_same( 'Updated', $clean[0]['title'], 'The last duplicate should win.' );
	sfn_assert_same( $winning_article_url, $clean[0]['url'], 'Normalization should preserve the winning duplicate\'s article-detail URL.' );
	sfn_assert_same( '', $clean[0]['image_url'], 'Missing image should normalize to empty.' );

	$GLOBALS['sfn_test_options'][ SFN_Cache_Store::STATE_OPTION ] = array( 'articles' => array( array( 'id' => 'old' ) ), 'status' => array( 'last_success' => 1, 'last_error' => '', 'count' => 1 ) );
	$GLOBALS['sfn_test_http'] = array( 'response' => array( 'code' => 503 ), 'body' => 'down' );
	$result = SFN_Cache_Fetcher::refresh();
	sfn_assert( ! $result['success'], 'HTTP failure should fail refresh.' );
	sfn_assert_same( 'old', SFN_Cache_Store::get_articles()[0]['id'], 'Failure must retain last-known-good cache.' );

	$GLOBALS['sfn_test_options']['sfn_cache_refresh_lock'] = array( 'owner' => 'other', 'expires' => time() + 60 );
	$calls = $GLOBALS['sfn_test_http_calls'];
	$busy = SFN_Cache_Fetcher::refresh();
	sfn_assert( ! empty( $busy['busy'] ), 'Concurrent refresh should return busy.' );
	sfn_assert_same( $calls, $GLOBALS['sfn_test_http_calls'], 'Busy refresh should not call upstream.' );
	unset( $GLOBALS['sfn_test_options']['sfn_cache_refresh_lock'] );

	$GLOBALS['sfn_test_http'] = array( 'response' => array( 'code' => 200 ), 'body' => '{"results":[{"id":1,"title":"Bad","url":"https://example.com","published_at":"tomorrow"}]}' );
	$malformed = SFN_Cache_Fetcher::refresh();
	sfn_assert( ! $malformed['success'], 'Non-empty wholly malformed results must fail.' );
	sfn_assert_same( 'old', SFN_Cache_Store::get_articles()[0]['id'], 'Malformed results must retain cache.' );

	$GLOBALS['sfn_test_http'] = array( 'response' => array( 'code' => 200 ), 'body' => '{"results":[]}' );
	$success = SFN_Cache_Fetcher::refresh();
	sfn_assert( $success['success'], 'Valid empty response should succeed.' );
	sfn_assert_same( array(), SFN_Cache_Store::get_articles(), 'Valid empty response should clear active cache.' );
}
