<?php
/**
 * Builder data model: defaults, sanitization and helpers.
 *
 * @package SimpleHeaderFooterBuilder
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class SHFB_Builder
 *
 * Pure data class. No side effects on load.
 */
class SHFB_Builder {

	/**
	 * Allowed element types for the header/footer.
	 *
	 * @return array
	 */
	public static function allowed_elements() {
		return array( 'logo', 'menu', 'text', 'social' );
	}

	/**
	 * Default header settings.
	 *
	 * @return array
	 */
	public static function default_header_settings() {
		return array(
			'enabled'    => 1,
			'bg_color'   => '#ffffff',
			'text_color' => '#222222',
			'link_color' => '#0073aa',
			'font_family'=> 'system',
			'font_size'  => 16,
			'padding_y'  => 20,
			'padding_x'  => 24,
			'align'      => 'space-between',
			'elements'   => array(
				array(
					'type' => 'logo',
					'text' => get_bloginfo( 'name' ),
					'url'  => '',
				),
				array(
					'type'     => 'menu',
					'menu_id'  => 0,
				),
			),
		);
	}

	/**
	 * Default footer settings.
	 *
	 * @return array
	 */
	public static function default_footer_settings() {
		return array(
			'enabled'    => 1,
			'bg_color'   => '#111111',
			'text_color' => '#dddddd',
			'link_color' => '#ffffff',
			'font_family'=> 'system',
			'font_size'  => 14,
			'padding_y'  => 30,
			'padding_x'  => 24,
			'align'      => 'center',
			'elements'   => array(
				array(
					'type' => 'text',
					'text' => '&copy; ' . gmdate( 'Y' ) . ' ' . get_bloginfo( 'name' ) . '. All rights reserved.',
				),
				array(
					'type'     => 'social',
					'networks' => array(
						array( 'name' => 'twitter',  'url' => '' ),
						array( 'name' => 'facebook', 'url' => '' ),
					),
				),
			),
		);
	}

	/**
	 * Allowed font families. Keys are stored values; values are CSS stacks.
	 *
	 * @return array
	 */
	public static function font_stacks() {
		return array(
			'system'    => '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
			'serif'     => 'Georgia, "Times New Roman", Times, serif',
			'sans'      => 'Helvetica, Arial, sans-serif',
			'mono'      => 'Menlo, Consolas, "Courier New", monospace',
		);
	}

	/**
	 * Allowed alignment values.
	 *
	 * @return array
	 */
	public static function align_options() {
		return array( 'flex-start', 'center', 'flex-end', 'space-between', 'space-around' );
	}

	/**
	 * Allowed social networks (key => label).
	 *
	 * @return array
	 */
	public static function social_networks() {
		return array(
			'twitter'   => 'Twitter / X',
			'facebook'  => 'Facebook',
			'instagram' => 'Instagram',
			'linkedin'  => 'LinkedIn',
			'youtube'   => 'YouTube',
			'github'    => 'GitHub',
		);
	}

	/**
	 * Sanitize a full settings array (header or footer).
	 *
	 * @param array $input Raw input from $_POST.
	 * @return array Sanitized settings.
	 */
	public static function sanitize_settings( $input ) {
		$input = is_array( $input ) ? $input : array();

		$clean = array();

		$clean['enabled']     = empty( $input['enabled'] ) ? 0 : 1;
		$clean['bg_color']    = self::sanitize_hex( $input['bg_color']    ?? '#ffffff', '#ffffff' );
		$clean['text_color']  = self::sanitize_hex( $input['text_color']  ?? '#222222', '#222222' );
		$clean['link_color']  = self::sanitize_hex( $input['link_color']  ?? '#0073aa', '#0073aa' );

		$font_family = isset( $input['font_family'] ) ? sanitize_key( $input['font_family'] ) : 'system';
		if ( ! array_key_exists( $font_family, self::font_stacks() ) ) {
			$font_family = 'system';
		}
		$clean['font_family'] = $font_family;

		$clean['font_size']   = max( 10, min( 48, (int) ( $input['font_size'] ?? 16 ) ) );
		$clean['padding_y']   = max( 0,  min( 200, (int) ( $input['padding_y'] ?? 20 ) ) );
		$clean['padding_x']   = max( 0,  min( 200, (int) ( $input['padding_x'] ?? 24 ) ) );

		$align = isset( $input['align'] ) ? sanitize_key( $input['align'] ) : 'center';
		if ( ! in_array( $align, self::align_options(), true ) ) {
			$align = 'center';
		}
		$clean['align'] = $align;

		// Elements list.
		$clean['elements'] = array();
		$elements = isset( $input['elements'] ) && is_array( $input['elements'] ) ? $input['elements'] : array();

		foreach ( $elements as $el ) {
			$type = isset( $el['type'] ) ? sanitize_key( $el['type'] ) : '';
			if ( ! in_array( $type, self::allowed_elements(), true ) ) {
				continue;
			}

			switch ( $type ) {
				case 'logo':
					$clean['elements'][] = array(
						'type' => 'logo',
						'text' => isset( $el['text'] ) ? sanitize_text_field( $el['text'] ) : '',
						'url'  => isset( $el['url'] )  ? esc_url_raw( $el['url'] )         : '',
					);
					break;

				case 'menu':
					$clean['elements'][] = array(
						'type'    => 'menu',
						'menu_id' => isset( $el['menu_id'] ) ? (int) $el['menu_id'] : 0,
					);
					break;

				case 'text':
					$clean['elements'][] = array(
						'type' => 'text',
						'text' => isset( $el['text'] ) ? wp_kses_post( $el['text'] ) : '',
					);
					break;

				case 'social':
					$networks = array();
					$raw_nets = isset( $el['networks'] ) && is_array( $el['networks'] ) ? $el['networks'] : array();
					foreach ( $raw_nets as $net ) {
						$name = isset( $net['name'] ) ? sanitize_key( $net['name'] ) : '';
						if ( ! array_key_exists( $name, self::social_networks() ) ) {
							continue;
						}
						$networks[] = array(
							'name' => $name,
							'url'  => isset( $net['url'] ) ? esc_url_raw( $net['url'] ) : '',
						);
					}
					$clean['elements'][] = array(
						'type'     => 'social',
						'networks' => $networks,
					);
					break;
			}
		}

		return $clean;
	}

	/**
	 * Sanitize a hex color, falling back to a default.
	 *
	 * @param string $value   Raw value.
	 * @param string $default Default fallback.
	 * @return string
	 */
	public static function sanitize_hex( $value, $default = '#000000' ) {
		$value = is_string( $value ) ? trim( $value ) : '';
		if ( preg_match( '/^#([A-Fa-f0-9]{3}){1,2}$/', $value ) ) {
			return $value;
		}
		return $default;
	}

	/**
	 * Get header settings merged with defaults.
	 *
	 * @return array
	 */
	public static function get_header() {
		$saved = get_option( SHFB_OPT_HEADER, array() );
		return wp_parse_args( is_array( $saved ) ? $saved : array(), self::default_header_settings() );
	}

	/**
	 * Get footer settings merged with defaults.
	 *
	 * @return array
	 */
	public static function get_footer() {
		$saved = get_option( SHFB_OPT_FOOTER, array() );
		return wp_parse_args( is_array( $saved ) ? $saved : array(), self::default_footer_settings() );
	}
}
