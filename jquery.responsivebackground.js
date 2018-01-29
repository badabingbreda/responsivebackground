/*!
 * Responsive Background Hero and Div
 * (c) 2018 Didou Schol
 * licensed under MIT
 */
( function( $ ){
    /**
     * default settings
     * @type {Object}
     */
    var defaults = {
        ratio: 1,
        breakpoints: [],                                        // [ { width:350 , imagesize:75 } , { width:768 , imagesize:1024 } ], // less than width uses this imagesize
        fallbackbreakpoint: {},                                 // { width:1024, imagesize:1024 } // anything over this width will use imagesize
        };

    var pluginName = 'responsiveBackground';

    function Plugin( element , options ) {

        // regex expression for getting the urls of the images in srcset
        const regex = /(http:\/\/|https:\/\/)([a-zA-Z0-9_\/\.-]{1,})(\s)(([0-9]{1,})w)/g;

        // merge default settings with options
        this.settings = $.extend( {} , defaults, options );

        this.settings.breakpoints.sort( this.sortFunction );

        this._defaults = defaults;
        this._element = $(element);
        this._regex = regex;

        this.init();

    }

    Plugin.prototype = {

        init : function() {

            var $this       = this,
                settings    = this.settings,
                currentBp   = this.getBreakpoint();

            $this.settings.currentBp = currentBp;

            $this.setResponsiveBackground();

            $( window ).resize( function() {

                var bp = $this.getBreakpoint();

                // if breakpoint hasn't changed we can just skip it
                if (bp === $this.settings.currentBP ) return false;

                $this.settings.currentBp = bp;
                // process images
                $this.setResponsiveBackground();
            });
        },

        setResponsiveBackground : function() {

            $this = this;
            var settings = $this.settings;

            return $( $this._element ).each( function () {

                let imageurl,       // imageurl to use as background-image
                    containerWidth, // get the width of the container so we can fit the best image
                    sizes = [];     // array of sizes from srcset

                if ( settings.breakpoints && settings.breakpoints.length == 0 ) { containerWidth = $( this ).width() };

                if ( settings.img == undefined ) {
                    var srcset = $( this ).data( 'srcset' );     // data-srcset and data-fullsize are set within element itself
                    var imagefull = $( this ).data('fullsize');
                } else {
                    var srcset = $( this ).find( settings.img ).first().data( 'srcset' );     // find the first image srcset information
                    var imagefull = $( this ).find( settings.img ).first().data('fullsize');
                }
                // if there is no image srcset found skip it
                if ( srcset === undefined || srcset == '' ) return true;

                sizes = $this.arrangeSizes( srcset );

                // loop through the srcset in ascending order
                $.each( sizes ,  function( index, value ) {

                    // if no breakpoint value is given just adjust src to match first positive containerWidth
                    if ( settings.breakpoints && settings.breakpoints.length == 0 ) {
                        if ( ( value[0] * settings.ratio ) > containerWidth  ) {
                            imageurl =  value[1] ;
                            return false;
                        }
                    // force to use full url
                    } else if ( settings.currentBp == -1 || settings.currentBp.imagesize == -1 ) {
                        imageurl = undefined;
                    // use nearest imagesize that will fit if we use breakpoints
                    } else {
                        if (  ( value[0]  * settings.ratio ) >= settings.currentBp.imagesize ) {
                            imageurl =  value[1] ;
                            return false;
                        }
                    }
                });

                // if srcset images does not match (too small) use src as fallback instead
                if ( imageurl == undefined ) imageurl = imagefull;

                $( this ).css('backgroundImage', "url( '" + imageurl + "' )" ) ; // use css because setting .prop sucks

            });
        },
        /**
         * Arrange the images in the srcset ASC
         * @param  STRING srcset
         * @return ARRAY
         */
        arrangeSizes : function ( srcset ) {

            $this = this;

            let arr = [],
                sizes = [];

            arr = srcset.split( ',' );

            $( arr ).each ( function ( index ) {

                let m;                                                      // matches

                while( (m = $this._regex.exec( this ) ) !== null ) {
                    if ( m.index == $this._regex.lastIndex ) {
                        $this._regex.lastIndex++;
                    }
                    sizes.push( [ parseInt( m[5] ) , m[1] + m[2] ] ) ;      // push image to array
                }

            });

            sizes.sort( $this.sortFunction );               // sort array based on imagewidth

            return sizes;
        },

        /**
         * check to see if current window-width falls within available breakpoints
         * @return {[type]} [description]
         */
        getBreakpoint : function() {

            var settings =  this.settings,
                            bp;             // breakpoint

            // there are breakpoints defined in the options
            if ( settings.breakpoints && settings.breakpoints.length ) {
                $.each( settings.breakpoints , function( index, breakpoint ) {
                    if ( breakpoint.width > $( window ).width() ) {
                        // store breakpoint break $.each
                        bp = breakpoint; return false;
                    }
                }) ;
            // NO breakpoints defined in options, use fullwidth image
            } else {
                return -1;
            }

            // breakpoints were set, but not within set range, return fallbackbreakpoint
            if (bp == null) return settings.fallbackbreakpoint;

            return bp;
        },

        sortFunction : function(a,b) {
            return a[0]-b[0];
        },

        setRatio : function ( newValue ) {
            return this.settings.ratio = newValue;
        }
    },

    $.fn[pluginName] = function ( options , param  ) {
        if (!$.data( this, 'plugin_' + pluginName ) ){
            $.data( this, 'plugin_' + pluginName , new Plugin( this, options ) );
        }
    }

})(jQuery);

