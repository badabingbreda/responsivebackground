<?php

class responsivebackground {

	/**
	 * create srcset string for select number of custom sizes, including custom sizes
	 * @param  int 			$id        		required
	 * @param  array/null  	$get_sizes 		array of image_sizes or null to get them all
	 * @return string 						srcset
	 */
	public static function get_intermediate_sizes_srcset( $id = null  , $get_sizes = array( 'thumbnail' , 'medium' , 'large' ) ) {

		// bail out if we don't have an $id
		if ( $id == null ) return false;

		// if none are given (explicitely) get them all! including the cropped ones....
		if ( $get_sizes == null ) $get_sizes = get_intermediate_image_sizes();

		$sizes = array();

	    foreach ( get_intermediate_image_sizes() as $s ) {
	        if (in_array( $s, $get_sizes ) ) {
	            $intermediate_width = get_option($s . '_size_w');
		        $image = wp_get_attachment_image_src( $id , $s );
		        if ($image[3]) $sizes[] = $image[0] . ' ' . $image[1] . 'w';
	        }

	    }

		return implode( ',' , $sizes );
	}

}
