<?php
/**
 * Admin: menus, pages, asset loading and form handling.
 *
 * @package SimpleHeaderFooterBuilder
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class SHFB_Admin
 */
class SHFB_Admin {

	/**
	 * Singleton instance.
	 *
	 * @var SHFB_Admin|null
	 */
	private static $instance = null;

	/**
	 * Singleton accessor.
	 *
	 * @return SHFB_Admin
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor: register hooks.
	 */
	private function __construct() {
		add_action( 'admin_menu',            array( $this, 'register_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_post_shfb_save',  array( $this, 'handle_save' ) );
	}

	/**
	 * Register top-level admin menu and submenus.
	 */
	public function register_menu() {
		add_menu_page(
			__( 'Header / Footer', 'shfb' ),
			__( 'Header / Footer', 'shfb' ),
			'manage_options',
			'shfb-header',
			array( $this, 'render_header_page' ),
			'dashicons-editor-kitchensink',
			61
		);

		add_submenu_page(
			'shfb-header',
			__( 'Header Builder', 'shfb' ),
			__( 'Header', 'shfb' ),
			'manage_options',
			'shfb-header',
			array( $this, 'render_header_page' )
		);

		add_submenu_page(
			'shfb-header',
			__( 'Footer Builder', 'shfb' ),
			__( 'Footer', 'shfb' ),
			'manage_options',
			'shfb-footer',
			array( $this, 'render_footer_page' )
		);
	}

	/**
	 * Enqueue admin assets only on plugin pages.
	 *
	 * @param string $hook Current admin page hook.
	 */
	public function enqueue_assets( $hook ) {
		if ( false === strpos( (string) $hook, 'shfb-' ) ) {
			return;
		}

		// WordPress' built-in color picker (very lightweight already loaded in admin).
		wp_enqueue_style( 'wp-color-picker' );

		wp_enqueue_style(
			'shfb-admin',
			SHFB_URL . 'assets/css/admin.css',
			array(),
			SHFB_VERSION
		);

		wp_enqueue_script(
			'shfb-admin',
			SHFB_URL . 'assets/js/admin.js',
			array( 'jquery', 'jquery-ui-sortable', 'wp-color-picker' ),
			SHFB_VERSION,
			true
		);

		wp_localize_script(
			'shfb-admin',
			'SHFB_ADMIN',
			array(
				'i18n' => array(
					'remove'        => __( 'Remove', 'shfb' ),
					'confirmRemove' => __( 'Remove this element?', 'shfb' ),
					'addNetwork'    => __( 'Add network', 'shfb' ),
				),
				'fontStacks' => SHFB_Builder::font_stacks(),
			)
		);
	}

	/**
	 * Render the Header builder page.
	 */
	public function render_header_page() {
		$this->render_builder_page( 'header' );
	}

	/**
	 * Render the Footer builder page.
	 */
	public function render_footer_page() {
		$this->render_builder_page( 'footer' );
	}

	/**
	 * Shared render: header or footer.
	 *
	 * @param string $type 'header' or 'footer'.
	 */
	private function render_builder_page( $type ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have permission to access this page.', 'shfb' ) );
		}

		$type     = ( 'footer' === $type ) ? 'footer' : 'header';
		$settings = ( 'footer' === $type ) ? SHFB_Builder::get_footer() : SHFB_Builder::get_header();

		// Surface a saved notice (we redirect with ?updated=1 after save).
		$updated = isset( $_GET['updated'] ) && '1' === $_GET['updated']; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		include SHFB_DIR . 'views/builder-page.php';
	}

	/**
	 * Handle form submit (admin-post.php endpoint).
	 */
	public function handle_save() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have permission to perform this action.', 'shfb' ) );
		}

		$type = isset( $_POST['shfb_type'] ) ? sanitize_key( wp_unslash( $_POST['shfb_type'] ) ) : '';
		if ( ! in_array( $type, array( 'header', 'footer' ), true ) ) {
			wp_die( esc_html__( 'Invalid request.', 'shfb' ) );
		}

		check_admin_referer( 'shfb_save_' . $type );

		$raw      = isset( $_POST['shfb'] ) ? wp_unslash( $_POST['shfb'] ) : array(); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$clean    = SHFB_Builder::sanitize_settings( $raw );
		$opt_key  = ( 'footer' === $type ) ? SHFB_OPT_FOOTER : SHFB_OPT_HEADER;
		$page     = ( 'footer' === $type ) ? 'shfb-footer'   : 'shfb-header';

		update_option( $opt_key, $clean );

		wp_safe_redirect( add_query_arg(
			array(
				'page'    => $page,
				'updated' => '1',
			),
			admin_url( 'admin.php' )
		) );
		exit;
	}
}
