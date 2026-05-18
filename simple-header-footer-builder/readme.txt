=== Simple Header Footer Builder ===
Contributors:      yourname
Tags:              header, footer, builder, customizer, lightweight
Requires at least: 5.5
Tested up to:      6.5
Requires PHP:      7.2
Stable tag:        1.0.0
License:           GPLv2 or later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A focused, lightweight builder for customizing only your site's Header and Footer. No bloat. No page builder. No analytics.

== Description ==

Simple Header Footer Builder lets you visually compose a custom Header and Footer for your WordPress site. Add a logo, a registered nav menu, free-text/HTML and social icons, then drag to reorder. Tweak background color, font, text/link colors, padding and alignment from a clean admin panel with a live preview.

Designed to stay tiny:

* Pure PHP + a single small CSS file + ~6 KB of JavaScript on the admin side only.
* No frontend JS at all.
* No external services, fonts, or trackers.
* Uses WordPress' built-in `wp_body_open` and `wp_footer` hooks.

= Features =

* Custom Header builder (logo, menu, text, social).
* Custom Footer builder (same elements).
* Drag-and-drop reorder.
* Background color, text color, link color.
* Font family, font size, padding, alignment controls.
* Fully responsive layout out of the box.
* Live preview while editing.
* Sanitized & escaped — passes WP coding standards review.

= Not included (by design) =

* No page builder, blocks, or templates.
* No SEO tools, analytics, or trackers.
* No third-party fonts or icon libraries.

== Installation ==

1. Upload the `simple-header-footer-builder` folder to `/wp-content/plugins/`, **or** install the ZIP through *Plugins → Add New → Upload Plugin*.
2. Activate it in *Plugins*.
3. Go to **Header / Footer** in your WordPress admin sidebar.
4. Configure the **Header** and **Footer** subpages, then click *Save changes*.
5. (Optional) If your theme does not output `do_action( 'wp_body_open' );` directly after `<body>`, the header may not appear. Most modern themes (WP 5.2+) include it automatically.

== Frequently Asked Questions ==

= Will this replace my theme's header? =

It adds its own header/footer markup near the top of `<body>` and just before `</body>`. Some themes already render their own header/footer, in which case you may want to disable the theme's via your theme's settings, or hide them with custom CSS.

= Does it support custom menus? =

Yes. Create menus under *Appearance → Menus*, then choose one in the Menu element.

= Does it load any tracker, font, or external file? =

No. Zero external requests.

== Changelog ==

= 1.0.0 =
* Initial release.

== Upgrade Notice ==

= 1.0.0 =
First release.
