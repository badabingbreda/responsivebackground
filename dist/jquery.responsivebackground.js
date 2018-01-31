/*!
 * Responsive Background Hero and Div v1.0.0
 * (c) 2018 Didou Schol
 * licensed under MIT
 */
;( function( $ , document , window ){
    /**
     * default settings
     * @type {Object}
     */
    var defaults = {
        img: 'img',
        ratio: 1,
        breakpoints: [],
        fallbackbreakpoint: {},
        pause: false,
        };

    var pluginName = 'responsiveBackground';

    function Plugin( element , options ) {

        var regex = /([a-zA-Z0-9_\-\.\:\/]{1,})\s(([0-9]{1,})w)/g;

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
            	if ( $this.settings.pause ) return false;

                var bp = $this.getBreakpoint();

                // if breakpoint hasn't changed we can just skip it
                if ( bp == $this.settings.currentBp && ( $this.settings.breakpoints && $this.settings.breakpoints.length ) ) return false;

                $this.settings.currentBp = bp;
                // process images
                $this.setResponsiveBackground();
            });
        },

        getData : function( element , get ) {

            var     srcset,
                    imagefull,
                    $getElement;

            if ( get == 'img' && $( element ).find( get ).first().length ) {
            	$getElement = $( element ).find( get ).first();
            }
            else if ( get == 'self'  && $( element ).data('srcset').length ) {
            	$getElement = $( element );
            }
            else {
            	$getElement = $( element ).find( get ).length ?$( element ).find( get ):$( get );
            }

        	dataProp = this.matchDataProp( $getElement );

            return dataProp;

        },

        /**
         * try to get the data element, if not set use properties instead
         * @param  {[type]} element [description]
         * @return {[type]}         [description]
         */
        matchDataProp : function( element ) {

            srcset      = $( element ).data('srcset')?$( element ).data('srcset'):$( element ).prop('srcset');
            imagefull   = $( element ).data('src')?$( element ).data('src'):$( element ).prop('src');

            return { srcset: srcset , imagefull: imagefull };
        },

        setResponsiveBackground : function() {

            var 		$this = this,
            			settings = $this.settings;

            return $( $this._element ).each( function () {

                var imageurl,       // imageurl to use as background-image
                    containerWidth, // get the width of the container so we can fit the best image
                    sizes = [];     // array of sizes from srcset

                // get corresponding srcset / imagefull / src
                var dataSet = $this.getData( this , settings.img );
                // if there is no image srcset found return early
                if ( dataSet.srcset == undefined || dataSet.srcset == '' ) return false;

                if ( settings.breakpoints && settings.breakpoints.length == 0 ) { containerWidth = $( this ).width() };


                sizes = $this.arrangeSizes( dataSet.srcset );

                // loop through the srcset in ascending order
                $.each( sizes ,  function( index , value ) {

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
                if ( imageurl == undefined ) imageurl = dataSet.imagefull;

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

            var arr = [],
                sizes = [];

            arr = srcset.split( ',' );

            $( arr ).each ( function ( index ) {

                var m;                                                      // matches

                while( (m = $this._regex.exec( this ) ) !== null ) {
                    if ( m.index == $this._regex.lastIndex ) {
                        $this._regex.lastIndex++;
                    }
                    sizes.push( [ parseInt( m[3] ) , m[1] ] ) ;      // push image to array
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
            this.settings.ratio = newValue;
        },

        setElement: function( newElement ) {
        	this.settings._element = $( newElement );
        },

        setImg: function( newSource ) {
        	this.settings.img = newSource;
        },

        redraw : function() {
            var bp = this.getBreakpoint();
            this.settings.currentBp = bp;
        	this.setResponsiveBackground();
        },

        pause : function() {
        	this.settings.pause = true;
        },

        start : function() {
        	this.settings.pause = false;
        }


    }

    $.fn[pluginName] = function ( options ) {
    	var args = arguments;

    	// if the first parameter is an object (options), or was omitted, instantiate a new instance
    	if (options === undefined || typeof options === 'object' ) {
    		return this.each(function() {

    			// Only allow the plugin to be instantiated once due to methods
		        if (!$.data( this, 'plugin_' + pluginName ) ){

		        	// if it has no instance, create a new one, pass options to our plugin constructor,
		        	// and store the plugin instance in the elements jQuery data object.
		            $.data( this, 'plugin_' + pluginName , new Plugin( this, options ) );
		        }

    		});

		// If is a string and doesn't start with an underscore or 'init' function, treat this as a call to a public method.
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

            // Cache the method call to make it possible to return a value
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);

                // Tests that there's already a plugin-instance and checks that the requested public method exists
                if (instance instanceof Plugin && typeof instance[options] === 'function') {

                    // Call the method of our plugin instance, and pass it the supplied arguments.
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }
            });

            // If the earlier cached method gives a value back return the value, otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };

}( jQuery , document , window ));

