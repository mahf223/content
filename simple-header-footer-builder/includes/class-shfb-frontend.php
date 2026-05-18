<?php
/**
 * Frontend rendering: hooks into wp_head / wp_body_open / wp_footer.
 *
 * @package SimpleHeaderFooterBuilder
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class SHFB_Frontend
 */
class SHFB_Frontend {

	/**
	 * Singleton.
	 *
	 * @var SHFB_Frontend|null
	 */
	private static $instance = null;

	/**
	 * Singleton accessor.
	 *
	 * @return SHFB_Frontend
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Hook registration.
	 */
	private function __construct() {
		// Inline styles + enqueue main stylesheet via wp_head.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'wp_head',            array( $this, 'inline_dynamic_css' ), 20 );

		// Render header at the top of <body> (theme must support wp_body_open, WP 5.2+).
		add_action( 'wp_body_open',       array( $this, 'render_header' ) );

		// Render footer just before </body>.
		add_action( 'wp_footer',          array( $this, 'render_footer' ), 5 );
	}

	/**
	 * Enqueue the small frontend stylesheet.
	 */
	public function enqueue_assets() {
		wp_enqueue_style(
			'shfb-frontend',
			SHFB_URL . 'assets/css/frontend.css',
			array(),
			SHFB_VERSION
		);
	}

	/**
	 * Inject dynamic CSS variables based on saved settings (no extra HTTP request).
	 */
	public function inline_dynamic_css() {
		$h = SHFB_Builder::get_header();
		$f = SHFB_Builder::get_footer();
		$stacks = SHFB_Builder::font_stacks();

		$h_font = isset( $stacks[ $h['font_family'] ] ) ? $stacks[ $h['font_family'] ] : $stacks['system'];
		$f_font = isset( $stacks[ $f['font_family'] ] ) ? $stacks[ $f['font_family'] ] : $stacks['system'];

		$css  = ':root{';
		$css .= '--shfb-h-bg:'   . esc_attr( $h['bg_color'] )   . ';';
		$css .= '--shfb-h-fg:'   . esc_attr( $h['text_color'] ) . ';';
		$css .= '--shfb-h-link:' . esc_attr( $h['link_color'] ) . ';';
		$css .= '--shfb-h-font:' . $h_font . ';';
		$css .= '--shfb-h-fs:'   . (int) $h['font_size'] . 'px;';
		$css .= '--shfb-h-py:'   . (int) $h['padding_y'] . 'px;';
		$css .= '--shfb-h-px:'   . (int) $h['padding_x'] . 'px;';
		$css .= '--shfb-h-align:' . esc_attr( $h['align'] ) . ';';

		$css .= '--shfb-f-bg:'   . esc_attr( $f['bg_color'] )   . ';';
		$css .= '--shfb-f-fg:'   . esc_attr( $f['text_color'] ) . ';';
		$css .= '--shfb-f-link:' . esc_attr( $f['link_color'] ) . ';';
		$css .= '--shfb-f-font:' . $f_font . ';';
		$css .= '--shfb-f-fs:'   . (int) $f['font_size'] . 'px;';
		$css .= '--shfb-f-py:'   . (int) $f['padding_y'] . 'px;';
		$css .= '--shfb-f-px:'   . (int) $f['padding_x'] . 'px;';
		$css .= '--shfb-f-align:' . esc_attr( $f['align'] ) . ';';
		$css .= '}';

		echo "<style id='shfb-vars'>" . $css . "</style>\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- vars are already sanitized/escaped.
	}

	/**
	 * Render the header (wp_body_open).
	 */
	public function render_header() {
		$settings = SHFB_Builder::get_header();
		if ( empty( $settings['enabled'] ) ) {
			return;
		}
		$this->render_region( 'header', $settings );
	}

	/**
	 * Render the footer (wp_footer).
	 */
	public function render_footer() {
		$settings = SHFB_Builder::get_footer();
		if ( empty( $settings['enabled'] ) ) {
			return;
		}
		$this->render_region( 'footer', $settings );
	}

	/**
	 * Render a region (header/footer) wrapper plus its elements.
	 *
	 * @param string $type     'header' or 'footer'.
	 * @param array  $settings Settings array.
	 */
	private function render_region( $type, $settings ) {
		$tag    = ( 'header' === $type ) ? 'header' : 'footer';
		$class  = 'shfb shfb-' . $type;
		?>
		<<?php echo esc_attr( $tag ); ?> class="<?php echo esc_attr( $class ); ?>" role="<?php echo 'header' === $type ? 'banner' : 'contentinfo'; ?>">
			<div class="shfb-inner">
				<?php
				if ( ! empty( $settings['elements'] ) && is_array( $settings['elements'] ) ) {
					foreach ( $settings['elements'] as $element ) {
						$this->render_element( $element );
					}
				}
				?>
			</div>
		</<?php echo esc_attr( $tag ); ?>>
		<?php
	}

	/**
	 * Render a single element.
	 *
	 * @param array $element Sanitized element.
	 */
	private function render_element( $element ) {
		$type = isset( $element['type'] ) ? $element['type'] : '';
		switch ( $type ) {
			case 'logo':
				$this->render_logo( $element );
				break;
			case 'menu':
				$this->render_menu( $element );
				break;
			case 'text':
				$this->render_text( $element );
				break;
			case 'social':
				$this->render_social( $element );
				break;
		}
	}

	/**
	 * Logo (text + optional link). Falls back to site name.
	 *
	 * @param array $el Element.
	 */
	private function render_logo( $el ) {
		$text = isset( $el['text'] ) && '' !== $el['text'] ? $el['text'] : get_bloginfo( 'name' );
		$url  = isset( $el['url'] ) && '' !== $el['url'] ? $el['url'] : home_url( '/' );
		?>
		<div class="shfb-el shfb-logo">
			<a href="<?php echo esc_url( $url ); ?>"><?php echo esc_html( $text ); ?></a>
		</div>
		<?php
	}

	/**
	 * Menu element: renders a registered nav menu by ID.
	 *
	 * @param array $el Element.
	 */
	private function render_menu( $el ) {
		$menu_id = isset( $el['menu_id'] ) ? (int) $el['menu_id'] : 0;
		if ( ! $menu_id ) {
			return;
		}
		?>
		<nav class="shfb-el shfb-menu" aria-label="<?php esc_attr_e( 'Primary', 'shfb' ); ?>">
			<?php
			wp_nav_menu(
				array(
					'menu'        => $menu_id,
					'container'   => false,
					'menu_class'  => 'shfb-menu-list',
					'fallback_cb' => '__return_empty_string',
					'depth'       => 1,
				)
			);
			?>
		</nav>
		<?php
	}

	/**
	 * Text/HTML block.
	 *
	 * @param array $el Element.
	 */
	private function render_text( $el ) {
		$text = isset( $el['text'] ) ? $el['text'] : '';
		if ( '' === $text ) {
			return;
		}
		echo '<div class="shfb-el shfb-text">' . wp_kses_post( $text ) . '</div>';
	}

	/**
	 * Social icons (text-label fallback if no SVG, very small CSS-driven set).
	 *
	 * @param array $el Element.
	 */
	private function render_social( $el ) {
		$networks = isset( $el['networks'] ) && is_array( $el['networks'] ) ? $el['networks'] : array();
		if ( empty( $networks ) ) {
			return;
		}
		$labels = SHFB_Builder::social_networks();
		?>
		<ul class="shfb-el shfb-social">
			<?php foreach ( $networks as $net ) :
				$name = isset( $net['name'] ) ? $net['name'] : '';
				$url  = isset( $net['url'] )  ? $net['url']  : '';
				if ( '' === $name || '' === $url || ! isset( $labels[ $name ] ) ) {
					continue;
				}
				?>
				<li class="shfb-social-item shfb-social-<?php echo esc_attr( $name ); ?>">
					<a href="<?php echo esc_url( $url ); ?>" rel="noopener noreferrer" target="_blank" aria-label="<?php echo esc_attr( $labels[ $name ] ); ?>">
						<span class="shfb-social-label"><?php echo esc_html( $labels[ $name ] ); ?></span>
					</a>
				</li>
			<?php endforeach; ?>
		</ul>
		<?php
	}
}
