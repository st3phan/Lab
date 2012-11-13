$(document).ready(function() {
	
	$('.carousel').each(function() {
		new Carousel($(this));
	});


});

Carousel = function(context, options) {

	var defaults = {
		autoplay: true,
		animationSpeed: 750,
		delay: 3000
	};
	
    /**
     * Reference to the carousel element
     */
	this._$carousel = $(context);
    /**
     * Reference to the item container
     */
	this._$container = $(context).find('.carousel_section');
    /**
     * Reference to the control element
     */
	this._$controls = this.addControls();
	
    htmlOptions = {
        autoplay : this._$carousel.data('autoplay'),
        animationSpeed : this._$carousel.data('speed'),
        delay : this._$carousel.data('delay')
    };
    
	options = $.extend(defaults, htmlOptions, options);

    /**
     * If the carousel should automatically start playing
     */
	this.autoplay = options.autoplay;
    /**
     * The delay between slides in milliseconds
     */
	this.delay = parseInt(options.delay);
    /**
     * The speed in millisecond to animate between items
     */
	this.animationSpeed = parseInt(options.animationSpeed);
	/**
	 * The timeout for the autoplay
	 */	
	this._autoplayTimeout = 0;
	/**
	 * If all images are loaded
	 */	
	this._loaded = false;
	/**
	 * 0-based index of the current item
	 */	
	this._current = 0;
	/**
	 * Number of items in the carousel
	 */	
	this._items = this._$container.children().length;
	
	this.init();
};

/**
 * Starts the carousel when the images are loaded
 */

Carousel.prototype.init = function() {
	var self = this;

	this._$carousel.on('click', 'label', function() {
		self.stop();
		self.goto($(this).index());
	});
	
	 // a single element is no carousel, so don't don't autoplay
    if (this.items == 1) {
        this.autoplay = false;
    } else {		
		// .one instead of .on so that the function only fire once
	    this._$carousel.find('img').one('load', function () {
	        if (!self._loaded) {
	            self._loaded = true;
	            // starts the autoplay if the variable is true
	            if (self.autoplay) {
	                self.start();
	            }
	        }
	    }).each(function() {
		    //fire even when images are cached in IEx
	        if (this.complete) { 
	            $(this).load();
	        }
	    });
	}
};

/**
 * Starts the autoplay
 */

Carousel.prototype.start = function() {
	var self = this;

	this.autoplay = true;
	this._autoplayTimeout = setTimeout(function() {
		self.next();
	}, this.delay);
	return true;
};

/**
 * Stops the autoplay
 */

Carousel.prototype.stop = function() {
	this.autoplay = false;
	clearTimeout(this._autoplayTimeout);
	return false;
};

/**
 * Moves the carousel one step forwards
 */

Carousel.prototype.next = function() {
	this.move(1);
};

/**
 * Moves the carousel one step backwards
 */

Carousel.prototype.previous = function() {
	this.move(-1);
};

/**
 * Goes to the item with the give index (only when index exist)
 */

Carousel.prototype.goto = function(index) {
    if (index !== undefined && index >= 0 && index <= this._items && index !== this._current) {
        this.move(index - this._current);
    }
};

/**
 * Moves the carousel
 */

Carousel.prototype.move = function(steps) {
	var self = this;
	
	//steps defaults to 1
    if (steps === undefined) {
        steps = 1;
	 // make sure the steps can't be higher then the number of items
    } else if (steps > this.items) {
        steps = this.items;
    }

	if (steps && this._$container.filter(':animated').length === 0) {
		// forward
		if (steps > 0) {
			self.setCurrent(steps);
			// appends the extra elements
			this._$container.append(this._$container.children().slice(0, steps).clone());
	        this._$container.animate({
	            'left': -steps * 100 + '%'
	        }, self.animationSpeed, function () {
	        	// removes the old items from the front
	            self._$container.children().slice(0, steps).remove(); 
	            // sets the left to 0% because the old items are removed
	            self._$container.css('left', '0%');
	            
				if (self.autoplay) self.start();
	        });
		//backward
		} else if (steps < 0) {
		    self.setCurrent(steps);
			//prepends the extra elements
		    this._$container.prepend(this._$container.children().slice(steps).clone());
		    // sets the left so it aligns with the current item (the number of items added at the front)
		    this._$container.css('left', steps * 100 + '%');
		    this._$container.animate({
		        'left': '0%'
		    }, self.animationSpeed, function () {
		    	// removes the old items from the back
		        self._$container.children().slice(steps).remove();
		        
				if (self.autoplay) self.start();
		    });
		}
	}
};

/**
 * Activates the controls
 */

Carousel.prototype.addControls = function() {
	var $controls = this._$carousel.find('.carousel_nav');
	$controls.find('label').first().addClass('active');
	return $controls;
};

/**
 * Sets the current
 */

Carousel.prototype.setCurrent = function(steps) {
	this._current = (this._current + steps + this._items) % this._items;
	if (this._current == this._items) {
	    this._current = 0;
	}
	this._$controls.find('label').removeClass('active').eq(this._current).addClass('active');
}