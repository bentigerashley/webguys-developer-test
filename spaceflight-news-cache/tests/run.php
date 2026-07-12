<?php

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/test-settings.php';
require __DIR__ . '/test-fetcher.php';
require __DIR__ . '/test-admin.php';
require __DIR__ . '/test-api.php';
require __DIR__ . '/test-graphql.php';

$tests = array( 'test_settings', 'test_fetcher', 'test_admin', 'test_api', 'test_graphql' );
$failures = 0;
foreach ( $tests as $test ) {
	try { $test(); echo "PASS {$test}\n"; } catch ( Throwable $error ) { ++$failures; fwrite( STDERR, "FAIL {$test}: {$error->getMessage()}\n" ); }
}
if ( $failures ) { exit( 1 ); }
echo 'All ' . count( $tests ) . " test groups passed.\n";
