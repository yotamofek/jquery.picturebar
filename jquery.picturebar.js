( function( $ ) {

    function createImageDeferred( src ) {
        var deferred = $.Deferred();

        if ( typeof( src ) == 'string' ) {
            var image = new Image();

            image.src = src;
            image.onload = function () {
                deferred.resolve( this );
            };
            image.onerror = function () {
                deferred.reject( this );
            };
            image.onabort = function () {
                deferred.reject( this );
            };
        }
        else {
            var canvas = null;

            if ( src instanceof jQuery) {
                src = src.get( 0 )
            }

            if ( src instanceof HTMLCanvasElement ) {
                canvas = src;
            }
            else {
                throw "Image parameter must be a string or a canvas object."
            }

            deferred.resolve( canvas );
        }

        return deferred.promise();
    }

    var methods = {
        init : function( options ) {

            return this.each( function( ) {

                var $this = $(this),
                    data = new Object();

                $this.data( 'picturebar', data );
                $this.picturebar( 'option', $.extend( {
                    'percentage': 0,
                    'editable': true,
                }, options ) );

                var deferreds = [];
                deferreds.push( data['unselected-deferred'] = createImageDeferred( data['unselected-image'] ) );
                deferreds.push( data['selected-deferred'] = createImageDeferred( data['selected-image'] ) );

                if ( data['editable'] ) {
                    $this.mousedown( function ( e ) {
                        if ( e.button != 0 ) {
                            return;
                        }

                        function mousemoveHandler( e ) {
                            var $this = $(this),
                                x = e.pageX - this.offsetLeft,
                                y = e.pageY - this.offsetTop,
                                totalWidth = $this.width(),
                                percentage = (x > 0 ? x : 0) / totalWidth * 100;

                            percentage = ( percentage > 100 ) ? 100 : percentage;

                            if ( percentage != $this.picturebar( 'percentage' ) )
                            {
                                $this.picturebar( 'percentage', percentage )
                                $this.trigger( 'change.picturebar', percentage );
                            }
                        }

                        var handlerCaller = function ( obj ) {
                            return function ( e ) {
                                mousemoveHandler.call( obj, e )
                            }
                        }( this );

                        handlerCaller( e );
                        $(window).mousemove( handlerCaller );
                        $(window).mouseup( function ( e ) {
                            $(this).off( 'mousemove', handlerCaller );
                        } );
                    } );
                }
                
                $.when.apply( this, deferreds ).done( function ( unselectedImage, selectedImage ) {
                    if ( !( unselectedImage.width == selectedImage.width &&
                            unselectedImage.height == selectedImage.height ) ) {
                        throw "Both images must have same dimensions."
                    }

                    var width = unselectedImage.width,
                        height = unselectedImage.height;

                    $this.css( {
                        'width': width,
                        'height': height,
                        'position': 'relative',
                    } )

                    var canvasCss = {
                        'position': 'absolute',
                        'top': 0,
                        'left': 0,
                    };

                    var unselectedCanvas = $('<canvas/>', {
                            'class': 'picturebar-unselected',
                        } )
                        .attr( {
                            'width': width,
                            'height': height,
                        } )
                        .css( canvasCss )
                        .appendTo( $this );

                    var selectedCanvas = $('<canvas/>', {
                            'class': 'picturebar-selected',
                        } )
                        .attr( {
                            'width': 0,
                            'height': height,
                        } )
                        .css( canvasCss )
                        .appendTo( $this );

                    unselectedCanvas.get(0).getContext('2d').drawImage( unselectedImage, 0, 0 );
                    $this.picturebar( 'refresh' );
                } );

                return this;

            } );

        },

        refresh : function() {

            return this.each( function () {
                var $this = $(this),
                    canvas = $('.picturebar-selected', $this),
                    percentage = $this.picturebar('percentage'),
                    totalWidth = $this.width(),
                    width = totalWidth / 100.0 * percentage;

                canvas.attr( 'width', width );

                $this.data('picturebar')['selected-deferred'].done( function ( image ) {
                    canvas.get(0).getContext('2d').drawImage( image, 0, 0 );
                } )

                return this;
            } )

        },

        percentage : function( value ) {

            if ( typeof(value) == 'number') {
                this.picturebar( 'option', 'percentage', value ).picturebar( 'refresh' );
                return this;
            }
            else {
                return this.picturebar( 'option', 'percentage' );
            }

        },

        option : function( name, value ) {

            return $.access( this, function( elem, name, value ) {
                var $this = $(elem),
                    data = $this.data('picturebar');

                if ( value !== undefined ) {
                    data[name] = value;
                } else {
                    return data[name];
                }
            }, name, value, arguments.length > 1 );

        },
    }

    $.fn.picturebar = function( method ) {

        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        }
        else {
            $.error( 'Method ' + method + ' does not exist on jQuery.picturebar' );
        }
    }

} )( jQuery );