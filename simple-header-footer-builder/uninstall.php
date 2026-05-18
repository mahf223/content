<?php
/**
 * Uninstall handler: removes plugin options when the plugin is deleted.
 *
 * @package SimpleHeaderFooterBuilder
 */

// Bail if not called by WordPress.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

delete_option( 'shfb_header_settings' );
delete_option( 'shfb_footer_settings' );
