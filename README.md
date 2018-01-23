

Responsive background images on containers and hero-headers
-----------------------------------------------------------

 - include provided jquery.responsivebackground.js in your site's header by using wordpress enqueue or including it.
 - If using Wordpress you can also include class.responsivebackground.php in your project.

Take a look at below html-output:

    <div class="uk-grid">
	    <div class="grid-element uk-cover-background">
		    <div class="img uk-hidden" data-srcset="https://www.domainname.net/wp-content/uploads/2018/01/image1-1024x1024.jpg 1024w,https://www.domainname.net/wp-content/uploads/2018/01/image1-640x640.jpg 640w,https://www.domainname.net/wp-content/uploads/2018/01/image1-300x300.jpg 300w,https://www.domainname.net/wp-content/uploads/2018/01/image1-150x150.jpg 150w" data-fullsize="https://www.domainname.net/wp-content/uploads/2018/01/image1.jpg"></div>
	    </div>
    </div>

> **Attention:** I am deliberately NOT using the <img> tag to insert the image-srcset data. I have found that it does impact download, loading  the src-url that is needed for this element. If none is provided it
results in errors, which we don't want. So for this method has proved
to work just as effectively.

Call responsiveBackgroundImage() from within the private function. Look at the following example:

    $(document).ready( function () {

        new responsiveBackgroundImage( {
                element: '.grid-element',
                img: '.img',
                ratio: 1,
                breakpoints: [
                  { width: 300, imagesize: 150 },
                  { width:350 , imagesize:300 }
                ],
                fallbackbreakpoint: { width:768 , imagesize:500 }
    } );

  The function takes the following option parameters:

  **element**
string, optional.  The element that functions as the container. Defaults to `.background-container`

  **img**
string, optional.  The element that holds the `data-srcset` and `data-fullsize` attributes. defaults to `.img`

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
> Written with [StackEdit](https://stackedit.io/).
