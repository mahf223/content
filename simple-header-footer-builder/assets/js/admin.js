/**
 * Simple Header Footer Builder - Admin JS
 *
 * Provides:
 *  - Drag & drop reordering of elements (jQuery UI Sortable).
 *  - Add / remove elements and social network rows.
 *  - Live preview that mirrors the form state without a server roundtrip.
 *
 *  Field name re-indexing happens on submit so the server receives a clean,
 *  contiguous array under shfb[elements][N][...].
 */
(function ($) {
	'use strict';

	$(function () {
		var $form     = $('#shfb-form');
		if (!$form.length) { return; }

		var $list     = $('#shfb-elements');
		var $preview  = $('#shfb-preview');

		/* -------------------------------------------------------------- */
		/* Color picker                                                   */
		/* -------------------------------------------------------------- */
		$('.shfb-color').wpColorPicker({
			change: debounce(updatePreview, 50),
			clear:  updatePreview
		});

		/* -------------------------------------------------------------- */
		/* Sortable                                                       */
		/* -------------------------------------------------------------- */
		$list.sortable({
			handle: '.shfb-handle',
			placeholder: 'shfb-placeholder',
			forcePlaceholderSize: true,
			update: updatePreview
		});

		/* -------------------------------------------------------------- */
		/* Add / Remove elements                                          */
		/* -------------------------------------------------------------- */
		$('.shfb-add').on('click', function () {
			var type = $(this).data('add');
			var tmpl = $('#shfb-tmpl-' + type).html();
			if (!tmpl) { return; }
			var $node = $(injectIndex(tmpl, nextIndex()));
			$list.append($node);
			updatePreview();
		});

		$list.on('click', '.shfb-remove', function () {
			$(this).closest('.shfb-element').remove();
			updatePreview();
		});

		/* Social rows */
		$list.on('click', '.shfb-add-net', function () {
			var $el      = $(this).closest('.shfb-element-social');
			var $netList = $el.find('.shfb-social-list');
			var rowTmpl  = $('#shfb-tmpl-social-row').html();
			var elIndex  = $el.index();
			var netIndex = $netList.children().length;
			var base     = 'shfb[elements][' + elIndex + '][networks][' + netIndex + ']';
			$netList.append(rowTmpl.replace(/__BASE__/g, base));
			updatePreview();
		});

		$list.on('click', '.shfb-remove-net', function () {
			$(this).closest('.shfb-social-row').remove();
			updatePreview();
		});

		/* Live preview triggers on every input change. */
		$form.on('input change', 'input, select, textarea', debounce(updatePreview, 80));

		/* Re-index field names just before submit so the server array is clean. */
		$form.on('submit', reindexAll);

		/* Initial render. */
		updatePreview();

		/* -------------------------------------------------------------- */
		/* Helpers                                                         */
		/* -------------------------------------------------------------- */

		function nextIndex() {
			return $list.children().length;
		}

		function injectIndex(tmplHtml, index) {
			return tmplHtml.replace(/__BASE__/g, 'shfb[elements][' + index + ']');
		}

		/**
		 * Walk the elements list and re-index all input/select/textarea name
		 * attributes so they form a contiguous sequence.
		 */
		function reindexAll() {
			$list.children('.shfb-element').each(function (elIndex) {
				var $el = $(this);
				var newBase = 'shfb[elements][' + elIndex + ']';

				$el.find('[name]').each(function () {
					var $f = $(this);
					var name = $f.attr('name') || '';
					// Replace any "shfb[elements][<n>]" prefix with the new base.
					name = name.replace(/^shfb\[elements\]\[\d+\]/, newBase);
					$f.attr('name', name);
				});

				/* Re-index social network rows inside this element. */
				$el.find('.shfb-social-list .shfb-social-row').each(function (netIndex) {
					var netBase = newBase + '[networks][' + netIndex + ']';
					$(this).find('[name]').each(function () {
						var $f = $(this);
						var name = $f.attr('name') || '';
						name = name.replace(/networks\]\[\d+\]/, 'networks][' + netIndex + ']');
						// Also replace any leftover bracket prefix that didn't include the index above.
						name = name.replace(/^shfb\[elements\]\[\d+\]\[networks\]\[\d+\]/, netBase);
						$f.attr('name', name);
					});
				});
			});
		}

		function debounce(fn, ms) {
			var t;
			return function () {
				var ctx  = this;
				var args = arguments;
				clearTimeout(t);
				t = setTimeout(function () { fn.apply(ctx, args); }, ms);
			};
		}

		/* -------------------------------------------------------------- */
		/* Live Preview                                                    */
		/* -------------------------------------------------------------- */
		function updatePreview() {
			var fonts = (window.SHFB_ADMIN && window.SHFB_ADMIN.fontStacks) || {};
			var bg    = $('input[name="shfb[bg_color]"]').val()    || '#ffffff';
			var fg    = $('input[name="shfb[text_color]"]').val()  || '#222';
			var lk    = $('input[name="shfb[link_color]"]').val()  || '#0073aa';
			var ff    = fonts[$('select[name="shfb[font_family]"]').val()] || fonts.system || 'sans-serif';
			var fs    = parseInt($('input[name="shfb[font_size]"]').val(), 10) || 16;
			var py    = parseInt($('input[name="shfb[padding_y]"]').val(), 10) || 0;
			var px    = parseInt($('input[name="shfb[padding_x]"]').val(), 10) || 0;
			var align = $('select[name="shfb[align]"]').val() || 'center';

			$preview.css({
				background:    bg,
				color:         fg,
				fontFamily:    ff,
				fontSize:      fs + 'px',
				padding:       py + 'px ' + px + 'px'
			});

			var $inner = $('<div class="shfb-preview-inner"></div>').css({
				justifyContent: align,
				color: fg
			});

			$list.children('.shfb-element').each(function () {
				var $el = $(this);
				var type = $el.data('type');
				var $part;
				switch (type) {
					case 'logo':
						var logoText = $el.find('input[name$="[text]"]').val() || 'Site name';
						$part = $('<div class="shfb-prev-logo"></div>').append(
							$('<a href="#"></a>').text(logoText).css({ color: lk })
						);
						break;
					case 'menu':
						$part = $('<div class="shfb-prev-menu"></div>').append(
							$('<ul></ul>')
								.append($('<li><a href="#">Home</a></li>'))
								.append($('<li><a href="#">About</a></li>'))
								.append($('<li><a href="#">Contact</a></li>'))
						);
						$part.find('a').css({ color: lk });
						break;
					case 'text':
						var txt = $el.find('textarea[name$="[text]"]').val() || '';
						$part = $('<div class="shfb-prev-text"></div>').html(
							escapeHtml(txt)
						);
						break;
					case 'social':
						var $ul = $('<ul class="shfb-prev-social"></ul>');
						$el.find('.shfb-social-row').each(function () {
							var name = $(this).find('select').val();
							if (!name) { return; }
							$ul.append($('<li></li>').append(
								$('<a href="#"></a>').text(name).css({ color: lk })
							));
						});
						$part = $ul;
						break;
				}
				if ($part) { $inner.append($part); }
			});

			$preview.empty().append($inner);
		}

		function escapeHtml(s) {
			return String(s)
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
		}
	});
})(jQuery);
