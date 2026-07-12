<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class FDI_Home_Fields {
	public static function init(): void {
		add_action( 'acf/init', array( __CLASS__, 'register' ) );
	}

	public static function register(): void {
		if ( ! function_exists( 'acf_add_local_field_group' ) ) {
			return;
		}

		acf_add_local_field_group(
			array(
				'key' => 'group_fdi_homepage_content',
				'title' => 'Homepage Content',
				'graphql_field_name' => 'homepageContent',
				'show_in_graphql' => 1,
				'map_graphql_types_from_location_rules' => 1,
				'fields' => array(
					array(
						'key' => 'field_fdi_homepage_sections',
						'label' => 'Sections',
						'name' => 'sections',
						'graphql_field_name' => 'sections',
						'type' => 'flexible_content',
						'button_label' => 'Add section',
						'layouts' => self::layouts(),
					),
				),
				'location' => array( array( array( 'param' => 'page_type', 'operator' => '==', 'value' => 'front_page' ) ) ),
				'position' => 'normal',
				'active' => true,
			)
		);
	}

	/** @return array<string, array<string, mixed>> */
	private static function layouts(): array {
		return array(
			'layout_fdi_hero' => self::layout( 'hero', 'Hero', array( self::field( 'hero_eyebrow', 'Eyebrow' ), self::field( 'hero_heading', 'Heading' ), self::field( 'hero_cta', 'CTA', 'link' ), self::field( 'hero_marquee_text', 'Marquee Text' ), self::field( 'hero_image', 'Image', 'image' ) ) ),
			'layout_fdi_about' => self::layout( 'about', 'About', array( self::field( 'about_heading', 'Heading' ), self::field( 'about_body', 'Body', 'textarea' ), self::field( 'about_cta', 'CTA', 'link' ), self::field( 'about_image', 'Image', 'image' ) ) ),
			'layout_fdi_services' => self::layout( 'services', 'Services', array( self::field( 'services_heading', 'Heading' ), self::field( 'services_intro', 'Intro', 'textarea' ), self::repeater( 'items', 'Items', array( self::field( 'service_title', 'Title' ), self::field( 'service_body', 'Body', 'textarea' ), self::field( 'service_image', 'Image', 'image' ) ) ) ) ),
			'layout_fdi_featured_cases' => self::layout( 'featured_cases', 'Featured Cases', array( self::field( 'cases_heading', 'Heading' ), self::repeater( 'cases', 'Cases', array( self::field( 'case_client', 'Client' ), self::field( 'case_title', 'Title' ), self::field( 'case_meta', 'Meta' ), self::field( 'case_image', 'Image', 'image' ), self::field( 'case_link', 'Link', 'link' ) ) ) ) ),
			'layout_fdi_partners' => self::layout( 'partners', 'Partners', array( self::field( 'partners_heading', 'Heading' ), self::field( 'partners_intro', 'Intro', 'textarea' ), self::repeater( 'partners', 'Partners', array( self::field( 'partner_name', 'Name' ), self::field( 'partner_logo', 'Logo', 'image' ), self::field( 'partner_url', 'URL', 'url' ) ) ) ) ),
			'layout_fdi_awards' => self::layout( 'awards', 'Awards', array( self::field( 'awards_heading', 'Heading' ), self::repeater( 'stats', 'Stats', array( self::field( 'stat_value', 'Value' ), self::field( 'stat_suffix', 'Suffix' ), self::field( 'stat_label', 'Label' ) ) ), self::repeater( 'awards', 'Awards', array( self::field( 'award_title', 'Title' ), self::field( 'award_issuer', 'Issuer' ), self::field( 'award_year', 'Year' ) ) ) ) ),
			'layout_fdi_latest_news' => self::layout( 'latest_news', 'Latest News', array( self::field( 'news_heading', 'Heading' ), self::field( 'news_article_count', 'Article Count', 'number', array( 'default_value' => 6, 'min' => 1, 'max' => 20 ) ) ) ),
			'layout_fdi_contact' => self::layout( 'contact', 'Contact', array( self::field( 'contact_eyebrow', 'Eyebrow' ), self::field( 'contact_heading', 'Heading' ), self::field( 'contact_email', 'Email', 'email' ), self::field( 'contact_cta_label', 'CTA Label' ) ) ),
		);
	}

	private static function layout( string $name, string $label, array $fields ): array {
		return array( 'key' => 'layout_fdi_' . $name, 'name' => $name, 'label' => $label, 'display' => 'block', 'sub_fields' => $fields );
	}

	private static function field( string $key, string $label, string $type = 'text', array $extra = array() ): array {
		$name = preg_replace( '/^[^_]+_/', '', $key );
		return array_merge( array( 'key' => 'field_fdi_' . $key, 'label' => $label, 'name' => $name, 'type' => $type ), $extra );
	}

	private static function repeater( string $key, string $label, array $fields ): array {
		return array( 'key' => 'field_fdi_' . $key, 'label' => $label, 'name' => $key, 'type' => 'repeater', 'layout' => 'block', 'button_label' => 'Add ' . rtrim( $label, 's' ), 'sub_fields' => $fields );
	}
}
