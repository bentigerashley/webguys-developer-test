<?php

function test_admin(): void {
	$GLOBALS['sfn_test_can_manage'] = false;
	$GLOBALS['sfn_nonce_checked'] = false;
	$blocked = false;
	try { SFN_Cache_Admin::manual_refresh(); } catch ( RuntimeException $error ) { $blocked = true; }
	sfn_assert( $blocked, 'Users without manage_options should be blocked.' );
	sfn_assert( ! $GLOBALS['sfn_nonce_checked'], 'Capability should be checked before nonce.' );
	sfn_assert_same( 403, $GLOBALS['sfn_wp_die_args']['response'], 'Unauthorized refresh should return HTTP 403.' );
	$GLOBALS['sfn_test_can_manage'] = true;
}
