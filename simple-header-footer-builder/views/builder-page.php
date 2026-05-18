<?php
/**
 * Builder page (shared by Header and Footer).
 *
 * Available vars:
 *
 * @var string $type     'header' or 'footer'
 * @var array  $settings Sanitized settings.
 * @var bool   $updated  Whether to display the "Saved" notice.
 *
 * @package SimpleHeaderFooterBuilder
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$is_header  = ( 'header' === $type );
$page_title = $is_header
	? __( 'Header Builder', 'shfb' )
	: __( 'Footer Builder', 'shfb' );

$menus       = wp_get_nav_menus();
$font_stacks = SHFB_Builder::font_stacks();
$align_opts  = SHFB_Builder::align_options();
$social_opts = SHFB_Builder::social_networks();
?>
<div class="wrap shfb-wrap">
	<h1><?php echo esc_html( $page_title ); ?></h1>

	<?php if ( $updated ) : ?>
		<div class="notice notice-success is-dismissible">
			<p><?php esc_html_e( 'Settings saved.', 'shfb' ); ?></p>
		</div>
	<?php endif; ?>

	<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" id="shfb-form">
		<input type="hidden" name="action" value="shfb_save" />
		<input type="hidden" name="shfb_type" value="<?php echo esc_attr( $type ); ?>" />
		<?php wp_nonce_field( 'shfb_save_' . $type ); ?>

		<div class="shfb-grid">
			<!-- LEFT: Builder controls -->
			<div class="shfb-col shfb-col-builder">

				<div class="shfb-card">
					<h2><?php esc_html_e( 'Status', 'shfb' ); ?></h2>
					<label class="shfb-toggle">
						<input type="checkbox" name="shfb[enabled]" value="1" <?php checked( ! empty( $settings['enabled'] ) ); ?> />
						<?php
						echo esc_html(
							$is_header
								? __( 'Enable custom header on the front-end', 'shfb' )
								: __( 'Enable custom footer on the front-end', 'shfb' )
						);
						?>
					</label>
				</div>

				<div class="shfb-card">
					<h2><?php esc_html_e( 'Style', 'shfb' ); ?></h2>
					<div class="shfb-fields">
						<p>
							<label><?php esc_html_e( 'Background color', 'shfb' ); ?></label>
							<input type="text" class="shfb-color" name="shfb[bg_color]" value="<?php echo esc_attr( $settings['bg_color'] ); ?>" data-default-color="<?php echo esc_attr( $settings['bg_color'] ); ?>" />
						</p>
						<p>
							<label><?php esc_html_e( 'Text color', 'shfb' ); ?></label>
							<input type="text" class="shfb-color" name="shfb[text_color]" value="<?php echo esc_attr( $settings['text_color'] ); ?>" data-default-color="<?php echo esc_attr( $settings['text_color'] ); ?>" />
						</p>
						<p>
							<label><?php esc_html_e( 'Link color', 'shfb' ); ?></label>
							<input type="text" class="shfb-color" name="shfb[link_color]" value="<?php echo esc_attr( $settings['link_color'] ); ?>" data-default-color="<?php echo esc_attr( $settings['link_color'] ); ?>" />
						</p>
						<p>
							<label><?php esc_html_e( 'Font family', 'shfb' ); ?></label>
							<select name="shfb[font_family]" class="shfb-input">
								<?php foreach ( $font_stacks as $key => $stack ) : ?>
									<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $settings['font_family'], $key ); ?>>
										<?php echo esc_html( ucfirst( $key ) ); ?>
									</option>
								<?php endforeach; ?>
							</select>
						</p>
						<p>
							<label><?php esc_html_e( 'Font size (px)', 'shfb' ); ?></label>
							<input type="number" min="10" max="48" name="shfb[font_size]" value="<?php echo esc_attr( $settings['font_size'] ); ?>" class="shfb-input" />
						</p>
						<p>
							<label><?php esc_html_e( 'Vertical padding (px)', 'shfb' ); ?></label>
							<input type="number" min="0" max="200" name="shfb[padding_y]" value="<?php echo esc_attr( $settings['padding_y'] ); ?>" class="shfb-input" />
						</p>
						<p>
							<label><?php esc_html_e( 'Horizontal padding (px)', 'shfb' ); ?></label>
							<input type="number" min="0" max="200" name="shfb[padding_x]" value="<?php echo esc_attr( $settings['padding_x'] ); ?>" class="shfb-input" />
						</p>
						<p>
							<label><?php esc_html_e( 'Alignment', 'shfb' ); ?></label>
							<select name="shfb[align]" class="shfb-input">
								<?php foreach ( $align_opts as $opt ) : ?>
									<option value="<?php echo esc_attr( $opt ); ?>" <?php selected( $settings['align'], $opt ); ?>>
										<?php echo esc_html( $opt ); ?>
									</option>
								<?php endforeach; ?>
							</select>
						</p>
					</div>
				</div>

				<div class="shfb-card">
					<h2><?php esc_html_e( 'Elements', 'shfb' ); ?></h2>
					<p class="description">
						<?php esc_html_e( 'Drag elements to reorder. Click "Add element" to insert a new block.', 'shfb' ); ?>
					</p>

					<div class="shfb-add-bar">
						<button type="button" class="button shfb-add" data-add="logo"><?php esc_html_e( '+ Logo', 'shfb' ); ?></button>
						<button type="button" class="button shfb-add" data-add="menu"><?php esc_html_e( '+ Menu', 'shfb' ); ?></button>
						<button type="button" class="button shfb-add" data-add="text"><?php esc_html_e( '+ Text', 'shfb' ); ?></button>
						<button type="button" class="button shfb-add" data-add="social"><?php esc_html_e( '+ Social', 'shfb' ); ?></button>
					</div>

					<div id="shfb-elements" class="shfb-elements">
						<?php
						if ( ! empty( $settings['elements'] ) ) {
							$index = 0;
							foreach ( $settings['elements'] as $element ) {
								shfb_render_element_field( $element, $index, $menus, $social_opts );
								$index++;
							}
						}
						?>
					</div>

					<!-- Hidden templates used by JS to inject new rows -->
					<?php shfb_render_element_templates( $menus, $social_opts ); ?>
				</div>

				<p class="submit">
					<button type="submit" class="button button-primary button-large">
						<?php esc_html_e( 'Save changes', 'shfb' ); ?>
					</button>
				</p>
			</div>

			<!-- RIGHT: Live preview -->
			<div class="shfb-col shfb-col-preview">
				<div class="shfb-card shfb-preview-card">
					<h2><?php esc_html_e( 'Live preview', 'shfb' ); ?></h2>
					<p class="description"><?php esc_html_e( 'Updates instantly as you edit. Save to publish.', 'shfb' ); ?></p>
					<div id="shfb-preview" class="shfb-preview shfb-preview-<?php echo esc_attr( $type ); ?>"></div>
				</div>
			</div>
		</div>
	</form>
</div>

<?php
/**
 * Render a single element edit row.
 *
 * @param array $element     Element data.
 * @param int   $index       Numeric index used in field names.
 * @param array $menus       Available nav menus.
 * @param array $social_opts Allowed networks.
 */
function shfb_render_element_field( $element, $index, $menus, $social_opts ) {
	$type = isset( $element['type'] ) ? $element['type'] : '';
	if ( ! in_array( $type, SHFB_Builder::allowed_elements(), true ) ) {
		return;
	}
	$name_base = 'shfb[elements][' . (int) $index . ']';
	?>
	<div class="shfb-element shfb-element-<?php echo esc_attr( $type ); ?>" data-type="<?php echo esc_attr( $type ); ?>">
		<div class="shfb-element-head">
			<span class="shfb-handle dashicons dashicons-move" aria-hidden="true"></span>
			<strong><?php echo esc_html( ucfirst( $type ) ); ?></strong>
			<button type="button" class="button-link shfb-remove" aria-label="<?php esc_attr_e( 'Remove element', 'shfb' ); ?>">&times;</button>
		</div>
		<div class="shfb-element-body">
			<input type="hidden" name="<?php echo esc_attr( $name_base ); ?>[type]" value="<?php echo esc_attr( $type ); ?>" />

			<?php if ( 'logo' === $type ) : ?>
				<p>
					<label><?php esc_html_e( 'Logo text', 'shfb' ); ?></label>
					<input type="text" name="<?php echo esc_attr( $name_base ); ?>[text]" value="<?php echo esc_attr( $element['text'] ?? '' ); ?>" class="shfb-input" />
				</p>
				<p>
					<label><?php esc_html_e( 'Link URL', 'shfb' ); ?></label>
					<input type="url" name="<?php echo esc_attr( $name_base ); ?>[url]" value="<?php echo esc_attr( $element['url'] ?? '' ); ?>" class="shfb-input" placeholder="<?php echo esc_attr( home_url( '/' ) ); ?>" />
				</p>

			<?php elseif ( 'menu' === $type ) : ?>
				<p>
					<label><?php esc_html_e( 'Select menu', 'shfb' ); ?></label>
					<select name="<?php echo esc_attr( $name_base ); ?>[menu_id]" class="shfb-input">
						<option value="0">— <?php esc_html_e( 'Select menu', 'shfb' ); ?> —</option>
						<?php foreach ( $menus as $menu ) : ?>
							<option value="<?php echo (int) $menu->term_id; ?>" <?php selected( (int) ( $element['menu_id'] ?? 0 ), (int) $menu->term_id ); ?>>
								<?php echo esc_html( $menu->name ); ?>
							</option>
						<?php endforeach; ?>
					</select>
				</p>
				<?php if ( empty( $menus ) ) : ?>
					<p class="description">
						<?php
						printf(
							/* translators: %s: link to Menus admin */
							wp_kses_post( __( 'No menus exist yet. <a href="%s">Create one in Appearance &rsaquo; Menus</a>.', 'shfb' ) ),
							esc_url( admin_url( 'nav-menus.php' ) )
						);
						?>
					</p>
				<?php endif; ?>

			<?php elseif ( 'text' === $type ) : ?>
				<p>
					<label><?php esc_html_e( 'Content', 'shfb' ); ?></label>
					<textarea name="<?php echo esc_attr( $name_base ); ?>[text]" rows="3" class="shfb-input"><?php echo esc_textarea( $element['text'] ?? '' ); ?></textarea>
				</p>

			<?php elseif ( 'social' === $type ) : ?>
				<div class="shfb-social-list">
					<?php
					$nets = isset( $element['networks'] ) && is_array( $element['networks'] ) ? $element['networks'] : array();
					$ni   = 0;
					foreach ( $nets as $net ) :
						$net_base = $name_base . '[networks][' . (int) $ni . ']';
						?>
						<div class="shfb-social-row">
							<select name="<?php echo esc_attr( $net_base ); ?>[name]" class="shfb-input">
								<?php foreach ( $social_opts as $key => $label ) : ?>
									<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $net['name'] ?? '', $key ); ?>>
										<?php echo esc_html( $label ); ?>
									</option>
								<?php endforeach; ?>
							</select>
							<input type="url" name="<?php echo esc_attr( $net_base ); ?>[url]" value="<?php echo esc_attr( $net['url'] ?? '' ); ?>" placeholder="https://" class="shfb-input" />
							<button type="button" class="button-link shfb-remove-net">&times;</button>
						</div>
						<?php
						$ni++;
					endforeach;
					?>
				</div>
				<p>
					<button type="button" class="button shfb-add-net"><?php esc_html_e( '+ Add network', 'shfb' ); ?></button>
				</p>

			<?php endif; ?>
		</div>
	</div>
	<?php
}

/**
 * Hidden templates the JS uses to clone new element rows.
 *
 * @param array $menus       Available menus.
 * @param array $social_opts Allowed networks.
 */
function shfb_render_element_templates( $menus, $social_opts ) {
	?>
	<script type="text/html" id="shfb-tmpl-logo">
		<div class="shfb-element shfb-element-logo" data-type="logo">
			<div class="shfb-element-head">
				<span class="shfb-handle dashicons dashicons-move" aria-hidden="true"></span>
				<strong>Logo</strong>
				<button type="button" class="button-link shfb-remove">&times;</button>
			</div>
			<div class="shfb-element-body">
				<input type="hidden" name="__BASE__[type]" value="logo" />
				<p><label><?php esc_html_e( 'Logo text', 'shfb' ); ?></label>
					<input type="text" name="__BASE__[text]" value="" class="shfb-input" /></p>
				<p><label><?php esc_html_e( 'Link URL', 'shfb' ); ?></label>
					<input type="url" name="__BASE__[url]" value="" class="shfb-input" placeholder="<?php echo esc_attr( home_url( '/' ) ); ?>" /></p>
			</div>
		</div>
	</script>

	<script type="text/html" id="shfb-tmpl-menu">
		<div class="shfb-element shfb-element-menu" data-type="menu">
			<div class="shfb-element-head">
				<span class="shfb-handle dashicons dashicons-move" aria-hidden="true"></span>
				<strong>Menu</strong>
				<button type="button" class="button-link shfb-remove">&times;</button>
			</div>
			<div class="shfb-element-body">
				<input type="hidden" name="__BASE__[type]" value="menu" />
				<p><label><?php esc_html_e( 'Select menu', 'shfb' ); ?></label>
					<select name="__BASE__[menu_id]" class="shfb-input">
						<option value="0">— <?php esc_html_e( 'Select menu', 'shfb' ); ?> —</option>
						<?php foreach ( $menus as $menu ) : ?>
							<option value="<?php echo (int) $menu->term_id; ?>"><?php echo esc_html( $menu->name ); ?></option>
						<?php endforeach; ?>
					</select></p>
			</div>
		</div>
	</script>

	<script type="text/html" id="shfb-tmpl-text">
		<div class="shfb-element shfb-element-text" data-type="text">
			<div class="shfb-element-head">
				<span class="shfb-handle dashicons dashicons-move" aria-hidden="true"></span>
				<strong>Text</strong>
				<button type="button" class="button-link shfb-remove">&times;</button>
			</div>
			<div class="shfb-element-body">
				<input type="hidden" name="__BASE__[type]" value="text" />
				<p><label><?php esc_html_e( 'Content', 'shfb' ); ?></label>
					<textarea name="__BASE__[text]" rows="3" class="shfb-input"></textarea></p>
			</div>
		</div>
	</script>

	<script type="text/html" id="shfb-tmpl-social">
		<div class="shfb-element shfb-element-social" data-type="social">
			<div class="shfb-element-head">
				<span class="shfb-handle dashicons dashicons-move" aria-hidden="true"></span>
				<strong>Social</strong>
				<button type="button" class="button-link shfb-remove">&times;</button>
			</div>
			<div class="shfb-element-body">
				<input type="hidden" name="__BASE__[type]" value="social" />
				<div class="shfb-social-list"></div>
				<p><button type="button" class="button shfb-add-net"><?php esc_html_e( '+ Add network', 'shfb' ); ?></button></p>
			</div>
		</div>
	</script>

	<script type="text/html" id="shfb-tmpl-social-row">
		<div class="shfb-social-row">
			<select name="__BASE__[name]" class="shfb-input">
				<?php foreach ( $social_opts as $key => $label ) : ?>
					<option value="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $label ); ?></option>
				<?php endforeach; ?>
			</select>
			<input type="url" name="__BASE__[url]" value="" placeholder="https://" class="shfb-input" />
			<button type="button" class="button-link shfb-remove-net">&times;</button>
		</div>
	</script>
	<?php
}
