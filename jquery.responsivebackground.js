
jQuery( function( $ ){

    var responsiveBackgroundImage = function ( options ) {

        // regex expression for getting the urls of the images in srcset
        const regex = /(http:\/\/|https:\/\/)([a-zA-Z0-9_\/\.-]{1,})(\s)(([0-9]{1,})w)/g;

        /**
         * [settings description]
         * @type {Object}
         */
        var settings = {
            element: '.background-container',
            img: '.img',
            ratio: 1,
            breakpoints: [],                                        // [ { width:350 , imagesize:75 } , { width:768 , imagesize:1024 } ], // less than width uses this imagesize
            fallbackbreakpoint: {},                                 // { width:1024, imagesize:1024 } // anything over this width will use imagesize
            };

        /**
         * [root description]
         * @type {[type]}
         */
        var root = this;

        /**
         * Cunstructor
         * @param  {[type]} options [description]
         * @return {[type]}         [description]
         */
        this.construct = function ( options ) {
            // merge default settings with options
            $.extend( settings, options );
            root.changeImage();

            $(window).resize( function() { root.changeImage(); } );

        }

        /**
         * [changeImage description]
         * @return {[type]} [description]
         */
        this.changeImage = function () {
            let bp = [];
            if ( settings.breakpoints && settings.breakpoints.length ) {
                $.each( settings.breakpoints , function( index, breakpoint ) {
                    if ( breakpoint.width > $( window ).width() ) {
                        root.doIt( breakpoint );
                        bp = { breakpoint: breakpoint , hasbp: true };
                        return false;
                    }
                });
            } else {
                root.doIt();
                return false;
            }
            if ( bp.hasbp == undefined ) root.doIt( settings.fallbackbreakpoint );
            //root.doIt(-1);
        }

        /**
         * sort function to rearrange the srcset-results
         * @param  {[type]} a [description]
         * @param  {[type]} b [description]
         * @return {[type]}   [description]
         */
        this.sortFunction = function(a,b) { return a[0]-b[0];}

        /**
         * [doIt description]
         * @param  {[type]} breakpoint [description]
         * @return {[type]}            [description]
         */
        this.doIt = function ( breakpoint ) {

            $( settings.element ).each( function ( index ) {

                let imageurl,       // imageurl to use as background-image
                    sizes = [],     // array of sizes from srcset
                    containerWidth,
                    arr = [];

                if ( breakpoint == undefined ) { containerWidth = $( this ).width() };


                let image = $( this ).find( settings.img ).first().data( 'srcset' );     // find the first image srcset information
                let imagefull = $( this ).find( settings.img ).first().data('fullsize');
                // if there is no image srcset found skip it
                if ( image === undefined ) return true;

                arr = image.split( ',' );

                $( arr ).each ( function ( index ) {

                    let m;                                                      // matches

                    while( (m = regex.exec( this ) ) !== null ) {
                        if ( m.index == regex.lastIndex ) {
                            regex.lastIndex++;
                        }
                        sizes.push( [ parseInt( m[5] ) , m[1] + m[2] ] ) ;      // push image to array
                    }


                });

                sizes.sort( root.sortFunction );               // sort array based on imagewidth

                // now that we actually have the sizes
                $.each( sizes ,  function( index, value ) {

                    // if no breakpoint value is given just adjust src to match containerWidth
                    if ( breakpoint == undefined ) {
                        if ( (value[0] * settings.ratio) > containerWidth  ) {
                            imageurl =  value[1] ;
                            return false;
                        }
                    // force to use full url
                    } else if ( breakpoint == -1 || breakpoint.fb == true || breakpoint.imagesize == -1 ) {
                        imageurl = undefined;
                    // use nearest imagesize that will fit if we use breakpoints
                    } else {
                        if (  ( value[0]  * settings.ratio ) >= breakpoint.imagesize ) {
                            imageurl =  value[1] ;
                            return false;
                        }
                    }
                });

                // if srcset images does not match (too small) use src as fallback instead
                if ( imageurl == undefined ) imageurl = imagefull;

                $( this ).css('backgroundImage', "url( '" + imageurl + "' )" ) ; // use css because setting .prop sucks


            } );

        }

        /**
         * Init the instance
         */
        this.construct( options );

    }


    $(document).ready( function () {

        new responsiveBackgroundImage( {
                element: '.grid-element',
                img: '.img',
                ratio: 1,
                breakpoints: [ { width: 300, imagesize: 150 }, { width:350 , imagesize:300 } ],
                fallbackbreakpoint: { width:768 , imagesize:500 }
            } );

    });
});
