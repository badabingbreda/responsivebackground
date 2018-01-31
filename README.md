

Responsive background images on containers and hero-headers
===========================================================

Features
----------

 - Autofit best image
 - Breakpoints
 - Fallback size
 - Ratio imagewidth


----------
### Usage ###
#### Include the JS ####

    <script src="dist/jquery.responsivebackground.min.js"></script>

#### Wordpress bonus: Include the PHP ####
If using Wordpress you can also include class.responsivebackground.php in your project.
```
include_once( 'dist/class.responsivebackground.php' );
```
This file includes a function that will retrieve all intermediate sizes from the Wordpress theme and output their sizes available. An example will be provided later in this doc.

#### Options ####
```
img: 'img', // default finds first img element under container; use 'self' or selector
ratio: 1, // multiplier to use lesser/higher quality images
breakpoints: [], // array with breakpoint-object(s) e.g. { width: 300, imagesize: 300 }
fallbackbreakpoint: {}, // object with max-imagesize for higher resolutions
pause: false, // compute different imagesize of resize or not?

```

#### Methods ####
```
$('.item').responsiveBackground( 'setRatio' , 2 );
$('.item').responsiveBackground( 'setImg' , '.otheritem img' );
$('.item').responsiveBackground( 'redraw' );
$('.item').responsiveBackground( 'pause' );
$('.item').responsiveBackground( 'start' );
```
#### Hero area markup ####

    <div class="hero-image demo1">
    <img class="hidden" src="cat_and_mouse.jpg"
        srcset="cat_and_mouse-100.jpg 100w,
        cat_and_mouse-300.jpg 300w,
        cat_and_mouse-520.jpg 520w,
        cat_and_mouse-1024.jpg 1024w">
    <div class="hero-text">
        <h1>Here's a picture of a sleeping cat</h1>
        <p>You know you love it</p>
        <button>Pet me</button>
      </div>
  </div>



#### Initialize ####
```
<script>
  $(function() {
    $('.demo1').responsiveBackground();
  });
</script>
```

the uk-cover-background class should give the container some css settings

    .uk-cover-background {
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
    }


  The function takes the following option parameters:

  **img**
string, optional.  The element that holds the `data-srcset` and `data-src` attributes. defaults to the first instance of `img` found in the containing element.

**ratio**
integer, optional. You can provide a ratio to recalculate the imagedimensions. Defaults to 1.

example: if `{ ratio: 2 }` is used the imagesizes from the srcset will be multiplied by 2, resulting that a 150w image will be made to fit in a 300px wide container. If `{ ratio: 1 }` is used, it will match a srcset image of at least 300w.

**breakpoints**
array, optional. If NOT provided images will be made to fit according to srcset widths. A container with a dimension of 300px will match an image that is marked at least 300w. If none is available it will use the image-url provided in data-fullsize.

If breakpoints IS provided, they need to be in the following format:

    breakpoints: { [
        { width: 350, imagewidth: 640 },
        { width: 640, imagewidth: 1024 }
      ] }
Whenever window-width drops below given width-size, we will try to match an image of min-width imagewidth. If we go over the highest available width it will use the image-url found in data-fullsize.

**fallbackbreakpoint**
array, optional. If provided, if width of the image window grows beyond the breakpoint (is bigger than the provided width) it will use imagewidth of this size. This allows us to cap the download size if needed.

example:

    { fallbackbreakpoint: { width: 1024, imagewidth: 300 } }
With this value, when window width is over 1024 pixels, we will fallback to the image with a max of 300w.

#### Note on the breakpoints and fallbackbreakpoint objects ####
You can specify to use the largest available image by setting the imagewidth to a value of -1. This will default the image to the largest in the data-srcset, or - if specified - the data-src.
```
    $('.hero-image.demo2').responsiveBackground({
      breakpoints:  [
        {width:350, imagesize: 100},
        {width:800, imagesize: -1}
      ],
      fallbackbreakpoint: { width: 1024, imagesize: 400 }
    });

```
In this example we use images of at least 100 pixels wide for screens smaller than 350 pixels, use the largest available (data-src preferably) and screen is between 350-800 pixels wide, and use an image of at least 400 pixels for screens everything above 800 pixels.

BONUS: PHP function to output image info (Wordpress only)
----------------------------------
To make sure you can use ALL imagesizes at your disposal I've included a helper function, wrapped in a class.

make sure to include the class.responsivebackground.php file into your functions.php
```
include_once( 'dist/class.responsivebackground.php' );
```

The helper-function takes two parameters:
**id**
Integer, required. attachment_id for the image.

**image-sizes**
Array, optional. Array of image-sizes. Get all sizes if not specified or set to null.

example:

    array( 'thumbnail', 'medium' , 'large' )

Will get the image-urls for the thumbnail, medium, large imagesizes, if available.

Example php output
------------------

    <?php

    $id = get_post_thumbnail_id();

    echo '<div class="demo1img" data-srcset="'.
       esc_attr(
         responsivebackground::get_intermediate_sizes_srcset(
           $id ,
           array( 'thumbnail',
              'medium',
              'large'
            )
       )
     ) .
     '" data-src="' .
     wp_get_attachment_image_src( $id, 'full' )[0] . '"></div>';
  ?>


> Written with [StackEdit](https://stackedit.io/app).


