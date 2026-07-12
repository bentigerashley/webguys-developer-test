<?php

function test_settings(): void {
	$clean = SFN_Cache_Settings::sanitize( array( 'search' => "  <b>Mars</b>\n", 'date_cutoff' => '2026-02-30', 'frequency' => 'weekly' ) );
	sfn_assert_same( 'Mars', $clean['search'], 'Search should be sanitized.' );
	sfn_assert_same( '', $clean['date_cutoff'], 'Invalid dates should be rejected.' );
	sfn_assert_same( 'hourly', $clean['frequency'], 'Unsupported schedules should fall back.' );
	$valid = SFN_Cache_Settings::sanitize( array( 'date_cutoff' => '2026-07-01', 'frequency' => 'daily' ) );
	sfn_assert_same( '2026-07-01', $valid['date_cutoff'], 'Valid cutoff should be retained.' );
	sfn_assert_same( 'daily', $valid['frequency'], 'Supported frequency should be retained.' );
}
