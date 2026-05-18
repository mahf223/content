<?php
/**
 * Plugin Name:       Simple Header Footer Builder
 * Plugin URI:        https://example.com/simple-header-footer-builder
 * Description:       A lightweight, focused plugin to build and customize a Header and Footer (logo, menu, text, social icons) with drag-and-drop ordering, color, font and spacing controls. Mobile responsive.
 * Version:           1.0.0
 * Requires at least: 5.5
 * Requires PHP:      7.2
 * Author:            Your Name
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       shfb
 *
 * @package SimpleHeaderFooterBuilder
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * -----------------------------------------------------------------------------
 * Plugin Constants
 * -----------------------------------------------------------------------------
 */
define( 'SHFB_VERSION', '1.0.0' );
define( 'SHFB_FILE', __FILE__ );
define( 'SHFB_DIR', plugin_dir_path( __FILE__ ) );
define( 'SHFB_URL', plugin_dir_url( __FILE__ ) );
define( 'SHFB_BASENAME', plugin_basename( __FILE__ ) );

// Option keys used to store builder data.
define( 'SHFB_OPT_HEADER', 'shfb_header_settings' );
define( 'SHFB_OPT_FOOTER', 'shfb_footer_settings' );

/**
 * -----------------------------------------------------------------------------
 * Bootstrap
 * -----------------------------------------------------------------------------
 */
require_once SHFB_DIR . 'includes/class-shfb-builder.php';
require_once SHFB_DIR . 'includes/class-shfb-admin.php';
require_once SHFB_DIR . 'includes/class-shfb-frontend.php';

/**
 * Initialize the plugin.
 *
 * @return void
 */
function shfb_init() {
	// Load translations (optional).
	load_plugin_textdomain( 'shfb', false, dirname( SHFB_BASENAME ) . '/languages' );

	// Boot admin only inside wp-admin.
	if ( is_admin() ) {
		SHFB_Admin::instance();
	}

	// Frontend rendering is always loaded so wp_head / wp_footer fire correctly.
	SHFB_Frontend::instance();
}
add_action( 'plugins_loaded', 'shfb_init' );

/**
 * Activation hook: seed default settings if missing.
 */
function shfb_activate() {
	if ( false === get_option( SHFB_OPT_HEADER ) ) {
		add_option( SHFB_OPT_HEADER, SHFB_Builder::default_header_settings() );
	}
	if ( false === get_option( SHFB_OPT_FOOTER ) ) {
		add_option( SHFB_OPT_FOOTER, SHFB_Builder::default_footer_settings() );
	}
}
register_activation_hook( __FILE__, 'shfb_activate' );

/**
 * Deactivation hook: nothing destructive (cleanup happens on uninstall).
 */
function shfb_deactivate() {
	// Intentionally empty.
}
register_deactivation_hook( __FILE__, 'shfb_deactivate' );

/**
 * Convenience link on the Plugins screen.
 *
 * @param array $links Existing links.
 * @return array
 */
function shfb_plugin_action_links( $links ) {
	$settings_url = admin_url( 'admin.php?page=shfb-header' );
	$settings     = '<a href="' . esc_url( $settings_url ) . '">' . esc_html__( 'Settings', 'shfb' ) . '</a>';
	array_unshift( $links, $settings );
	return $links;
}
add_filter( 'plugin_action_links_' . SHFB_BASENAME, 'shfb_plugin_action_links' );
