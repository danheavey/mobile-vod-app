
var c4 = c4 || {};

c4.globalProperties = {};

c4.deviceDetection = function () {
	
	var init = function () {
	
		var userAgent = navigator.userAgent;
	
		if (userAgent.indexOf("HTC") > 0 && userAgent.indexOf("Desire S") > 0) {
			
			//alert('is Desire');
			c4.globalProperties.device = "HTC DesireS";
			
		} else if (userAgent.indexOf("HTC") > 0 && userAgent.indexOf("Desire") > 0) {
			
			c4.globalProperties.device = "HTC Desire";
			
		} else if (userAgent.indexOf("MZ60") > 0) {
			
			c4.globalProperties.device = "Motorola Xoom";
			$('body').addClass('xoom');
			
		} else if (userAgent.indexOf("LG-P990") > 0) {

				c4.globalProperties.device = "LG Optimus";
				$('body').addClass('optimus');
				alert('optimus');
		};/* else {
			//alert(userAgent);
			
			$('body').addClass('xoom');
		}*/

	};
	
	return {init: init};
	
}();

//set the height of the large carousel items			
c4.smallCarousel = function () {

	var counter				= 1,
		carouselAnimating	= false,
		timerDuration		= 5000,
		touchObjX			= {},
		$carousel			= $('#carousel'),
		$otherThanFirstLis 	= $('li.slide', $carousel).not(':first'),
		itemsInCarousel		= $('ul.stage li.slide', $carousel).length,
		carouselTimer,
		renderedLiWidth;

	var init = function (windowWidth, resize) {
					
			/* 	
				To dos:
				--------		
				* Change the events from click to touchdown
				* Add gestures (nice to have)
				* Review for performance & optimise
			*/
			
			$carousel.css('width', '100%').find('li').die();
			
			/*
			$carousel.find('.slideListener').swipe({
			 swipeLeft: function() { alert('swipeLeft') },
			 swipeRight: function() { alert('swipeRight') }
			})
			*/
			
			/*
						
			$carousel.find('.slideListener').live('touchstart mouseenter', function (e) {
				//console.log(e);
				//touchObjX.start = e.pageX;
				//alert(e.pageX);
			});
			
			$carousel.find('.slideListener').live('touchmove mousemove', function (e) {
				//subtract current from start:
				touchObjX.diff = e.pageX - touchObjX.start;
				if (touchObjX.diff > 200) {
					alert('swipedRight');
				} else if (touchObjX.diff < -200) {
					alert('swipedLeft');
				}
				alert(e.pageX)
				//touchObjX.pos = 1
			});
			
			$carousel.find('.slideListener').live('touchend mouseleave', function (e) {
				console.log(e);
				//touchObjX.end = 0;				
			});
			
			*/
			
			if (resize) {
				
				//Stop the timer
				clearTimeout(carouselTimer);
				//Reset to default
				removeSpecificDimensions();
				constructTheCarouselNav();
				addTheTitle();
				
				measureAndFixDimensions();
				
				//reset the counter
				counter = 1;
				//Update the active indicator
				$('ul.indicatorUL li.active', $carousel).removeClass('active');
				$('ul.indicatorUL li:eq(0)', $carousel).addClass('active');
				
				//console.log("hello resize");
				
			} else {
				
				//console.log("hello virgin");
				
				//DOM setup:
				constructTheCarouselNav();
				addTheTitle();
				measureAndFixDimensions();
				
				//Events:
				rightButtonEvent();
				leftButtonEvent();
				clickOnLiElement();
				transitionEndEvent();
				
			}
			
			
			//Everything's ready, start the timer:
			startTimer();
		
	};
	
	var constructTheCarouselNav = function () {
		
		// building the components of the navigation region 
		var $navigatorRegion 	= $('<div>', {'class': "navigatorRegion clearfix"}),
			$leftButton 		= $('<button>', {'class': 'leftButton', 'style': 'display: none'}),
			$rightButton 		= $('<button>', {'class': 'rightButton'}),			
			$indicatorUL 		= $('<ul>', {'class': 'indicatorUL'}),
			$slideListener 		= $('<div>', {'class': "slideListener clearfix"});
			liString 			= "";
		
		// For each slide add an indicator li
		$.each($('li.slide', $carousel), function (index) { 
				
				if(index !== 0){
					liString += "<li></li>";
				} else {
					liString += "<li class='active'></li>";						
				}
				
				//Also store data on the li indicating it's index - used for the indicator
				$(this).data('index', index);
				
			 } );
			
		// Add the LIs we just constructed	
		$indicatorUL.prepend(liString);
		
		// Put all the bits together
		$navigatorRegion.prepend($indicatorUL).prepend($leftButton).append($rightButton);
		
		//Prepend the navigator region to the carousel	
		$carousel.prepend($navigatorRegion).append($slideListener);
		
		if (c4.globalProperties.device !== "LG Optimus") {
			
		
			var gnStartX = 0;
			var gnEndX = 0;
			var diff = 0;
			var touchMove = false;

			//var slideListener = document.getElementsByClassName('slideListener');
			var slideListener = $('.slideListener').each(function () {	
			
				this.addEventListener('touchstart',function(event) {
					event.preventDefault();
				  	gnStartX = event.touches[0].pageX;
				  	//gnStartY = event.touches[0].pageY;
					//alert('ts');
				},false);

				this.addEventListener('touchmove',function(event) {
					event.preventDefault();
					//alert(event.touches[0].pageX)
				  	gnEndX = event.touches[0].pageX;
					touchMove = true;
					//subtract current from start:
			
				
				},false);
			
				this.addEventListener('touchend',function() {
			
					diff = gnStartX - gnEndX;				
					
						if (!touchMove) {
						
							//alert("was a click")
							$('li.slide:eq('+(counter - 1)+')', $carousel).trigger('click');
						
						} else if (diff > 40) {
							clearTimeout(carouselTimer);
							touchMove = false;
							$('.rightButton:visible').trigger('click');
					
						
						} else if (diff < -40) {
							clearTimeout(carouselTimer);
							touchMove = false;
							$('.leftButton:visible').trigger('click');
						
						} else {

						}
				
					event.preventDefault();
				
				},false);
			
			
			});		
		
		};// end if LG Optimus
		
	};
	
	// Adds the title region to the stage
	var addTheTitle = function () {
		var firstCollectionTitle 	= $('ul.stage li.slide:eq(0) a', $carousel).data('title');
		
		//Add the fixed title
		var firstTitle 				= $('ul.stage li.slide:eq(0) a', $carousel).html();
		var titleRegion 			= "<div class='texts'><h2>" + firstCollectionTitle + "</h2><h3>"+ firstTitle +"</h3></div>";
		
		$carousel.prepend(titleRegion);
	};
	
	// We need to 'redraw' the carousel with calculated dimensions
	var measureAndFixDimensions = function () {
			
		renderedLiWidth 			= $('ul.stage li:eq(0)', $carousel).innerWidth();
		var renderedLiHeight 		= $('ul.stage li:eq(0)', $carousel).innerHeight();			
		
		//Fix the height of each LI
		$('ul.stage, ul.stage li.slide', $carousel).css('height', renderedLiHeight);
		$carousel.css('height', renderedLiHeight);
		$('div#navigatorRegion').css('height', renderedLiHeight);
		$('ul.stage li.slide', $carousel).css('width', renderedLiWidth);
		$('ul.stage', $carousel).css('width', renderedLiWidth * itemsInCarousel);	
		$('div.slideListener', $carousel).css({'width': renderedLiWidth, 'height': renderedLiHeight - 30});	
		
		
		
		//Add a class to carousel stage now that the height is fixed
		$carousel.addClass('ready');
			
	};
	
	// Fires on resize, returns the carousel to it's default state
	var removeSpecificDimensions = function () {
		
		//Reset to the page load settings
		$('ul.stage, ul.stage li.slide', $carousel).css('height', 'auto');
		$('ul.stage').css('left', 'auto');
		$carousel.css('height', 'auto');
		$('ul.stage li.slide', $carousel).css('width', '100%');
		$('ul.stage', $carousel).css('width', 'auto');
				
		//Remove the navigator
		$('div.navigatorRegion').remove();
		$('div.texts').remove();
		$('div.slideListener', $carousel).remove();		
		
		//Remove the ready class
		$carousel.removeClass('ready');
		
	};
	
	// Starts the carousel timer
	var startTimer = function () {
		
		clearTimeout(carouselTimer);
		
		carouselTimer = setTimeout( function () {

			$('button.rightButton', $carousel).trigger('click');

		}, timerDuration);
		
		c4.globalProperties.smallCarouselTimer = carouselTimer;
		
	};
	
	
	
	// Create the event for the right button 
	var rightButtonEvent = function () {
		
		//Add events for the right button
		$('button.rightButton', $carousel).die().live('click', function () {
				
			//alert(counter);	
				
			if (!carouselAnimating){
					
					//Stop the timer
					clearTimeout(carouselTimer);
			
					if (counter !== itemsInCarousel) {
						
						//Animate the carousel
						$('ul.stage', $carousel).css({'left': '-' + counter * renderedLiWidth + "px"});
						
						carouselAnimating = true;
						
						if ($('body').hasClass('xoom')) {
							$('ul.stage', $carousel).trigger('psudoTransitionEnd');
						}
						
						//Update the show text
						$('div.texts h3', $carousel).html($('li.slide:eq('+counter+') a', $carousel).html());
						$('div.texts h2', $carousel).html($('li.slide:eq('+counter+') a', $carousel).data('title'));
				
						//Update the active indicator
						$('ul.indicatorUL li.active', $carousel).removeClass('active');
						$('ul.indicatorUL li:eq('+counter+')', $carousel).addClass('active');
				
						counter++;
						
						if (counter === itemsInCarousel) {
							$(this).hide();
						}
						
					} else {
				
						//Slide all the way back to the right
						$('ul.stage', $carousel).css({'left': 0});
						carouselAnimating = true;
						$('button.leftButton', $carousel).hide();
						$(this).show();
						
						//Update the show text
						$('div.texts h3', $carousel).html($('li.slide:eq(0) a', $carousel).html());
						$('div.texts h2', $carousel).html($('li.slide:eq(0) a', $carousel).data('title'));						
				
						//Update the active indicator
						$('ul.indicatorUL li.active', $carousel).removeClass('active');
						$('ul.indicatorUL li:eq(0)', $carousel).addClass('active');
				
						counter = 1;
					}
					
					//Start the timer
					startTimer();
					
					if (counter > 1) {
						// Hide the left button
						$('button.leftButton', $carousel).show();
					}
					
				} else {
					
					//Carousel is animating
					return false;
					
				}
			
			return this;
			
		}); // End right button event
		
		
		
	};
	
	//Create the event for the left button
	var leftButtonEvent = function () {
		
		//Add events for the left button
		$('button.leftButton', $carousel).die().live('click', function () {
			
			if (!carouselAnimating){
			
				if (counter !== 1) {
					
					//Stop the timer
					clearTimeout(carouselTimer);
				
					//Animate the carousel
					$('ul.stage', $carousel).css({'left': '-' + (counter - 2) * renderedLiWidth + "px"});				
					
					carouselAnimating = true;
				
					if ($('body').hasClass('xoom')) {
						$('ul.stage', $carousel).trigger('psudoTransitionEnd');
					}
				
					//Update the show text
					$('div.texts h3', $carousel).html($('li.slide:eq('+(counter - 2)+') a', $carousel).html());
					$('div.texts h2', $carousel).html($('li.slide:eq('+(counter - 2)+') a', $carousel).data('title'));				
				
					//Update the active indicator
					$('ul.indicatorUL li.active', $carousel).removeClass('active');
					$('ul.indicatorUL li:eq('+(counter - 2)+')', $carousel).addClass('active');
				
					counter--;
				
					//Start the timer
					startTimer();
					
					if (counter === 1) {
						// Hide the left button
						$(this).hide();
					} else if (counter < itemsInCarousel) {
						$('button.rightButton', $carousel).show();
					}
					
					
					
				} 
				
			} else {
				
				//Carousel is animating
				return false;
				
			}
			
			return this;			
			
		}); // End left button event
		
	};
	
	// Event for when the active slide is clicked on
	var clickOnLiElement = function () {
		
		$('li.slide', $carousel).live('click', function () {
			
			var $this = $(this);
			//Go to the link
			window.location = $('a', $this).attr('href');
			return false;
			
		}); 
		
	};
	
	// Event for when the transition ends
	var transitionEndEvent = function () {
		
		//Transition end event - the carousel has finished animating
		$('ul.stage', $carousel).live('webkitTransitionEnd psudoTransitionEnd', function () {
			
			carouselAnimating = false;
			
		});
		
	};
	
	
	return {
				init:init
			};
	
	
}();

c4.bigCarousel = function () {
	
	/*
	To dos:
	
		* Blue overlay [ Done ]
		* Manage the resize [ Done ]
		* Check how the text should appear & animation behaviour [ Done ]
		* add the timer [ Done ]
		* change the text animation [ Done ]
		* add the links to episode page [ Done ]
		
		* Change the events from click to touchdown
		* Add gestures (nice to have)
		* Review for performance & optimise
		
	*/
	
	
	var leftOffset,
		smallWidth,
		firstItemWidth,
		carouselTimer = "2",
		targetHeight,
		timerDuration = 5000;
	
	var init = function (windowWidth, resize) {
		
		var $carousel 			= $('#carousel'),
			$carouselLis 		= $('ul.stage li.slide', $carousel),
			itemsInCarousel 	= $carouselLis.length,
			$firstItem 			= $('li:first', $carousel);
		
		$('ul.stage', $carousel).removeClass('stageReady').parent().removeClass('ready');
		clearTimeout(carouselTimer);
		$('li.slide', $carousel).die();
		
		if (resize){
		
			resetTheCarousel($carouselLis, $carousel, itemsInCarousel);
			
			targetHeight = $firstItem.innerHeight();
			firstItemWidth = $firstItem.innerWidth();

			smallWidth = Math.ceil(((windowWidth - firstItemWidth) / (itemsInCarousel - 1)) + 3);

			$.each($carouselLis, function () {	

				eachSlideLogic(this, targetHeight, $carousel);

			});

			clickOnSlide($carousel, itemsInCarousel);
			animationEnds($carousel, itemsInCarousel);
			startTimer($carousel);		
		
		} else {
			
			
			targetHeight = $firstItem.innerHeight();
			firstItemWidth = $firstItem.innerWidth();

			smallWidth = Math.ceil(((windowWidth - firstItemWidth) / (itemsInCarousel - 1)) + 3);

			$.each($carouselLis, function () {	

				eachSlideLogic(this, targetHeight, "carouselTitle", $carousel);
		
			});

			clickOnSlide($carousel, itemsInCarousel);
			animationEnds($carousel, itemsInCarousel);
			startTimer($carousel);
		}
		
		$carousel.addClass('ready');
	};
	
	var eachSlideLogic = function (that, targetHeight, $carousel) {
		
		var $this				= $(that),
			$thisImg			= $('img', $this),
			thisTitle			= $('a', $this).html(),
			thisCollectionTitle	= $('a', $this).data('title');
			
			titleRegion			= "<div class='texts'><h2>" + thisCollectionTitle + "</h2><h3>"+ thisTitle +"</h3></div>";
		
		$thisImg.css({'height' : targetHeight, "width" : firstItemWidth});
		$this.append('<div class="imgOverlay" style="height: '+targetHeight+'px; width:'+firstItemWidth+'px"></div>' + titleRegion);
		
		if ($this.index() !== 0) {
			
			$this.css({'height' : targetHeight, "position" : 'relative', 'width':smallWidth});

			var liWidth = $this.width(),
				imgWidth = $thisImg.width();
			
			leftOffset = -1 * Math.floor((imgWidth / 2) - (liWidth /2 ));
			
			$thisImg.css({"right" : leftOffset , "position" : "absolute"});
						
		} else {
			$this.addClass('active').css('width', firstItemWidth);
			$this.css({'height' : targetHeight, "position" : 'relative'});
			$thisImg.css({"right" : 0 , "position" : "absolute"});
		}
		
	};
	
	var startTimer = function ($carousel) {

		clearTimeout(carouselTimer);
		
		carouselTimer = setTimeout( function () {
	
			if ($('li.slide.active', $carousel).next().length > 0) {
				$('li.slide.active', $carousel).next().trigger('click');				
			} else {
				$('li.slide:eq(0)', $carousel).trigger('click');
			}	


		}, timerDuration);
		
		c4.globalProperties.bigCarouselTimer = carouselTimer;
		
	};
	
	var resetTheCarousel = function ($carouselLis, $carousel, itemsInCarousel) {
		
		$carouselLis.css({'height': 'auto', 'width': '12.5%', 'position' : 'static'})
			.removeClass('active')
			.filter(':first-child').css({'width': '50%'});
		
		$('.imgOverlay, .texts', $carouselLis).remove();
		$('.texts', $carouselLis).remove();
		$('img', $carouselLis).css({'height': 'auto', 'width': '100%','position' : 'static', 'right': 'auto'});
		
		//Remove events
		$('li', $carousel).die();
	};
	
	var clickOnSlide = function ($carousel, itemsInCarousel) {
		
		$('li', $carousel).live('click', function () {
			
			if (!$('ul.stage', $carousel).hasClass('stageReady')) {
				$('ul.stage', $carousel).addClass('stageReady');
			}
						
			var $this = $(this);
			
			if (!$this.hasClass('active')) {
				
				clearTimeout(carouselTimer);
				
				//Fix the position of anything greater than the clicked or active
				var currentlyActiveIndex = $('li.active', $carousel).index(),
					clickedIndex = $(this).index(),
					greterIndex = returnGreater(currentlyActiveIndex, clickedIndex);
				
				for (i=itemsInCarousel-1;i>greterIndex;i--) {
					var $that = $('li:eq('+i+')', $carousel);
					$that.css({"left":  $that.position().left, 'position': 'absolute'});
				}
				
			
				$this.siblings().removeClass('active').css({'width': smallWidth}).find('img').css({"right" : leftOffset});
				$this.addClass('active').css('width', firstItemWidth).find('img').css('right', '0');
				
				if ($('body').hasClass('xoom')){
					$this.trigger('psudoTransitionEnd');
				}
				
				startTimer($carousel);
				
			} else {
				
				//Go to the link
				window.location = $('a', $this).attr('href');
				return false;
				
			}
			
			return true;
			
		});
		
	};

		
	var returnGreater = function (A, B) {
		if (A > B) {
			return A;
		} else {
			return B;
		}
	};
	

	var animationEnds = function ($carousel) {

		$('li.slide.active', $carousel).live('webkitTransitionEnd', function (e) {
			
			if (e.originalEvent.propertyName === "width") {
				$this = $(this);
				$('li', $carousel).css({'position': 'relative', 'left': 'auto'});
			};
			
		});
		
		$('li.slide.active', $carousel).live('psudoTransitionEnd', function () {
			
				$this = $(this);
				$('li', $carousel).css({'position': 'relative', 'left': 'auto'});
			
		});
		

		return true;
		
	};
	
	return {init:init, returnGreater: returnGreater};
	
}();


c4.whichCarousel = function () {
	
	var virgin = true,
		lastSize,
		virginCarouselStage;
	
	
	var init = function () {

		var $carousel = $('#carousel');
		
		$.each($('.imagePlaceholder', $carousel), function () {

			var $this = $(this);
			var replacementImage = "<img src=\""+returnImageSize($this.data('src'))+"\" alt=\""+$this.data('alt')+"\">";
			$this.before(replacementImage);

		} );
		
		//Store the carousel as loaded - in memory, as a string
		if (virgin) {
			virginCarouselStage = $('#carousel').html() || "";
			virgin = false;
		}
		
		startStopCarousel($carousel);

	};
	
	var returnImageSize = function (imageURL) {
		
		var windowWidth = $(window).width(),
			windowHeight = $(window).height(),
			newUrl = "";
			
		var biggest = c4.bigCarousel.returnGreater(windowWidth, windowHeight);
		
		if (biggest <= 496) {
			newUrl = imageURL;
			//Added this as the smaller images are not always available...
			newUrl = imageURL.replace('496x279', '625x352');			
		} else {
			//Specify the bigger image
			newUrl = imageURL.replace('496x279', '625x352');
		}
		
		return newUrl;
		
	};
	
	var startStopCarousel = function ($carousel) {
		
		$carousel.live('stop', function () {
			
			if ($carousel.length > 0) {
				
				
				$carousel.addClass('stopped');
				clearTimeout(c4.globalProperties.smallCarouselTimer);
				clearTimeout(c4.globalProperties.bigCarouselTimer);
			
			}
			
		});
		
		$carousel.live('start', function () {
		
			if ($carousel.length > 0) {
				
				var delay;
				
				if ($carousel.find('.navigatorRegion').length > 0) {
					
					delay = setTimeout(function () {
					
						// if the right buttons not visible
						if ($carousel.find('.navigatorRegion button.rightButton:visible').length > 0) {
							$carousel.find('.navigatorRegion button.rightButton').trigger('click');
						} else {
							//else click the first one
							$carousel.find('.navigatorRegion button.leftButton').trigger('click');						
						}
					
					
					}, 1000);
					
				} else {
					
					delay = setTimeout(function () {
						//$carousel.find('.navigatorRegion a.rightButton').trigger('click');
						var elementsInCarousel = $('li', $carousel).length;
						var activeItem = $('li', $carousel).index($('li.active', $carousel)) + 1;
					
						if (elementsInCarousel != activeItem) {
						
							$('li:eq(' + activeItem + ')', $carousel).trigger('click');
						
						} else {
							$('li:eq(0)', $carousel).trigger('click');						
						}
					
					}, 1000);
				}
				
			}
			
		});
		
	};
	
	var renderCarousel = function (resize) {
		
		//If there is no carousel:
		if (virginCarouselStage.length === 0) {
			return false;
		}
		
		
		var windowWidth = $(window).width(),
			windowHeight = $(window).height(),
			$carousel = $('#carousel'),
			allLoaded = true;
			
		
		//Are all the images loaded?
		$.each($('ul li img', $carousel), function () {
			if (this.naturalWidth === 0){
				allLoaded = false;
			}
		});
		
		if (!allLoaded) {
			//console.log('initing');
			var waitAndreInit = setTimeout(function () {
				c4.whichCarousel.renderCarousel(resize);
			}, 500);
			return true;
		}
		
		
		if (windowWidth > 480) {
			
			//Carousel resize - Small to big	
			if (lastSize === "small") {
				
				$('*', $carousel).remove().die();
				$carousel.css({'width': '100%', 'height': ''}).prepend(virginCarouselStage);
				$('ul.stage', $carousel).css({'position': 'relative'});
				clearTimeout(c4.globalProperties.smallCarouselTimer);
				c4.bigCarousel.init(windowWidth, false);
				
			} else{
				c4.bigCarousel.init(windowWidth, resize);
			}
			
			//$carousel.removeClass('small').addClass('big');
			
			lastSize = 'big';
			
		} else {
			
			//Carousel resize - Big to small
			if (lastSize === "big") {

				$('*', $carousel).remove().die();
				$carousel.prepend(virginCarouselStage);
				clearTimeout(c4.globalProperties.bigCarouselTimer);							
				c4.smallCarousel.init(windowWidth, false);	
				
			} else {
				c4.smallCarousel.init(windowWidth, resize);			
			}
			
			//$carousel.removeClass('big').addClass('small');
			lastSize = 'small';
			
		}
		
		return this;
		
	};
	
	return {renderCarousel:renderCarousel, init: init};
	
}();

/*
c4.backToTop = function () {
	
	var init = function () {
		
		var $topLink = $('a#topLink');

		$topLink.live('click', function () {
			
				$("html,body").animate({ scrollTop: 0 }, "slow");
				return false;
			
			}	
			
		)
		
	}
	
	return {init: init}
	
}();
*/

c4.showMore = function () {

	var MAX_ITEMS_PER_REQUEST = 50, // max number of items returned per request to back-end service
		MAX_ITEMS_PER_PAGE = 50, // max number of items displayed per page (every time load more pressed)
		inProgress = false, // is the loader currently in progress?
		currentPage = 1, // current page number
		resultsCount = 0, // number of items in the cache
		serviceBaseUrl = "", 
		nextPageCount = 0, // number of items in the next page
		resultsCache = [], // results cache
		currentResults = [];	

	// DOM references
	var $showMoreContainer = $('div.episodeGroup #showMoreContainer'),
		$moreButton = $('button', $showMoreContainer),
		$articleContainer = $('div.episodeGroup div.episodeCont');

	var init = function () {
		
		// get out if no show more on the page
		if($showMoreContainer.length === 0) {
			return false;
		}

		$moreButton.live('click', function () {

			if(!!inProgress) {
				return false;
			} else {
				inProgress = true;
				updateButton();

				// if response count is 0 or 50 need to go back to server to retreive results
				if(resultsCount === 50 || resultsCount === 0) {		
					getResultsFromService();	
				// else get results from cache
				} else {			
					getResultsFromCache();
				}
				return true;
			}

		});

		return true;
	};

	var getResultsFromService = function () {
		
		var serviceUrl = serviceBaseUrl + '/page-' + (currentPage + 1);

		// Do XHR call to service
		$.ajax({
			type : 'GET',
			url : serviceUrl,
			dataType : 'text',
			success: function (data){

				if( !data || data === ""){
					// error
					displayError();
					return false;
				}
				var json;

				try {
					json = jQuery.parseJSON(data);
				} catch (e) {
					// error
					displayError();
					return false;
				}

				var results = json.results;
				
				nextPageCount = json.nextPageCount;

				// empty cache
				resultsCache = [];

				var liString;				

				// put the html strings in the cache
				$.each(results, function () {
					liString = '<article class="episode clearfix"><a href="' + this.url + '"><img src="' + this.img + '" width="160" height="91" alt="' + this.title + '"></a><h1><a href="' + this.url + '">' + this.title + '</a></h1></article>';
					resultsCache.push(liString);
				});

				currentResults = resultsCache;
				resultsCount = resultsCache.length;
				getResultsFromCache();
				currentPage ++;
				
				return this;
				
			},
			error: function () {
				displayError();
			},
			timeout: function () {
				// do we want to do something different here?
				displayError();
			}
		});
	};

	var getResultsFromCache = function () {

		// get first <MAX_ITEMS_PER_PAGE> items from cache
		currentResults = resultsCache.splice(0, MAX_ITEMS_PER_PAGE);	
		resultsCount = resultsCache.length;

		// now display the result on the page
		displayResults();
	};

	var displayResults = function () {

		// add items to the list
		$articleContainer.append(currentResults.join(''));
		inProgress = false;

		// update button text;
		updateButton();
	};

	var displayError = function () {
		$showMoreContainer.removeClass('loading');
		$showMoreContainer.prepend('<p>An error has occured. Please try again later</p>');
	};

	var updateButton = function () {
		
		$showMoreContainer.toggleClass('loading', inProgress);
		var text = inProgress ? 'Loading...' : 'Show More';
		$('span', $moreButton).text(text);

		// must be last page so remove button
		if(!inProgress && (nextPageCount === 0)) {
			$showMoreContainer.remove();
		}
	};

	var setServiceBaseUrl = function (url) {
		serviceBaseUrl = url;
	};

	return {
		init: init,
		setServiceBaseUrl: setServiceBaseUrl
	};
}();

c4.toggleSynopsis = function () {

	$('#seriesSynopsis h2').click(function() {
	  $(this).parent().toggleClass('open');
	});

}();

c4.search = function () {
	
	var $searchRegion = $('#searchRegion'),
		$searchInput = $('input#search', $searchRegion),
		$header = $('header'),
		$container = $('#container'),
		LETTERCOUNT = 1,
		TYPE_DELAY = 800,
		LIstring = "",
		checkHeightsTimer = "",
		timeoutValue = 0;
	
	var init = function () {
		searchKeypressEvent();
		clearSearchEvent();
		searchLinkClicked();
		
		//Maybe move this to the results ajax event when there is another page
		showMoreButton();	
	};
	
	//Keypress event
	var searchKeypressEvent = function () {
		
		/*
			To dos
			* performance, too much DOM querying
			* tidy up logic
			* test cross device
			* needs a loader and error status/message
		
		*/
		
		$searchInput.live('keyup', function (e) {
			
			/*
			if (e.keyCode === 13) {
				return false;
			}
			
			alert(e.keyCode);
			*/
			
			var $this = $(this);
			var myVal = $this.val();
			
			/*	
			if (e.keyCode === 13) {
				$this.focus().trigger('touchdown');
			}
			*/
				if (!$searchRegion.hasClass('active') && $this.attr('value').length > 0) {
					$searchRegion.addClass('active');
				}
			
				if ($this.attr('value').length >= LETTERCOUNT ) {
						
						
						//Add the loading indicator
						addLoader();
						
						
						if (c4.globalProperties.device !== "HTC Desire") {
						
							clearTimeout(timeoutValue);
						
							//Need to set a timeout delay
							timeoutValue = setTimeout(function () {
							
								getResults(myVal);
							
							}, TYPE_DELAY);
						
						} else {
							
							getResults(myVal);
							
						}
					
				
				} else {
				
					resetSearch();
				
				}
			
			
			
		});
		
	};
	
	var getResults = function (myVal) {
		
			//Stop the carousel
			if ($('#carousel').length > 0 && !$('#carousel').hasClass('stopped')) {
				$('#carousel').trigger('stop');
			}
			
			if (myVal.length === 1) {
			
				displayError1("1 letter");
			
			} else {							
				
				myVal = escape(myVal);

				//Do ajax
				$.ajax({
					type : 'GET',
					//url : 'mock-json3.txt?z=' + Math.floor(Math.random()*11),
					url : '/4od/search/ajax/' + encodeURI(myVal) + "#sdf",
					dataType : 'json',
					beforeSend : function () {
						//console.log('loader');							
						//addLoader();
					},
					success: function (data){
						//console.log('success');							
						successLogic(data, myVal);
					},
					error: function () {
						//console.log('error');														
						displayError1();
					},
					timeout: function () {
						// do we want to do something different here?
						//console.log('error');																					
						displayError1();
					}
				});
				
			}	
		
	};
	
	var addLoader = function () {
		if (!$searchRegion.hasClass('loading')) {
			$searchRegion.addClass('loading');
		}
	};
	
	var resetSearch = function (repopulate) {
		
		//console.log(paramObj);
		
		//Remove existing results
		$('ul.searchResults').remove();
		
		if (!repopulate) { 
			$('div.overlay').remove();
		};
		
		$('div.searchError').remove();
		$searchRegion.removeClass('loading');			
		$container.css('height','auto');
		
	};
	
	var successLogic = function (data, myVal) {
		
		//http://www.channel4.com/pmlsd/search/th/page-2.atom?apikey=56teq7vj2y94tx953n2d4epd
		///4od/search/ajax/STRING/page-2
		
		if( !data || data === ""){
			// error
			displayError();
			return false;
		}
		
		var $searchResultsUL = $('<ul>', {'class': 'searchResults'}),
		json,
		nextCount;
		
		LIstring = "";
		
		resetSearch(true);
		
		var numberOfresults = data.results.length;
		
		if (numberOfresults > 0) {
			
			$.each(data.results, function () {
			
				LIstring += "<li>" +
					"<article class=\"episode clearfix\">" +
						"<a href=\"" + this.url + "\"><img src=\"" + this.img + "\" alt=\"" + this.title + "\"></a>" +
						"<h1><a href=\"" + this.url + "\">" + this.title + "</a></h1>" +
						//"<p>" + this.episodes + "</p>" +
					"</article>" +
				"</li>";
			
			});
		
			
			if (data.nextPageCount > 0) {
				
				//Is there an existing showMore button?
				if ($('ul.searchResults div#showMoreContainer').length > 0) {
					//What's it's data-count
					//console.log($('div#showMoreContainer button').data('nextpage'));
					//nextPage = "CC";
				} else {
					nextPage = 2;
				}
				
				// We need to add the button
				LIstring += "<li class=\"showMoreList\"><div id=\"showMoreContainer\"><div><button data-showmore=\"" + myVal + "\" data-nextpage=\"" + nextPage + "\" type=\"button\"><span>Show more</span></button></div></div></li>";
			}
			
		
			var headerHeight = $header.innerHeight();
			var containerHeight = $container.innerHeight();
			
			if ($('div.overlay').length < 1) {
				$('body').append('<div class="overlay" style="top: '+headerHeight+'px; height: '+ (containerHeight - headerHeight) +'px"></div>');
			}
									
			$searchResultsUL.prepend(LIstring).css('top', headerHeight);
			
			$('div.highlight', $header).append($searchResultsUL);
			
			
			//check if the search results + headerHeight are taller than the page-container
			// * loop as each image loads as the height will be changing
									
			checkHeights();
			
		} else {
			displayError1("0 results");
		}
		
		return this;
		
	};
	
	var displayError1 = function (type) {
		
		var $errorRegion = $('<div>', {'class': 'searchError'});
		var errorText;
		
		resetSearch(true);
		
		var headerHeight = $header.innerHeight();
		var containerHeight = $container.innerHeight();
		
		if ($('div.overlay').length < 1) {
			$('body').append('<div class="overlay" style="top: '+headerHeight+'px; height: '+ (containerHeight - headerHeight) +'px"></div>');
		}
		
		if (type === "0 results") {
		
			errorText = "<div class=\"noResults\"><p>Your search did not match any results.</p>" + 
						"<p>Please make sure you have spelt all words correctly.</br>" +
						"Alternatively, try browsing our <a href=\"" + $('nav.primary li.a-z a').attr('href') + "\">A-Z</a>" +
						" or <a href=\"" + $('nav.primary li.categories a').attr('href') + "\">Category</a> sections.</p><br />" +
						"<p>It is possible this content is not available on the Mobile 4oD service. You can access our Desktop 4oD, which holds more content, through the link at the bottom of the page.</p>" +
						"</div>";
		} else if (type === "1 letter") {
			
			errorText = "<p class=\"error\">Please enter a minimum of two or more characters to search for programmes</p>";
			
		} else {
			errorText = "<p class=\"error\">An error has occured.</p>";
		}
		
		$errorRegion.css('top', headerHeight).prepend(errorText);
		
		$('div.highlight', $header).append($errorRegion);
		

		
	};
	
	var checkHeights = function () {
		
		var $searchResultsUL = $('ul.searchResults'),
		$searchResultsIMGS = $('img', $searchResultsUL),
		contHeight = $container.innerHeight(),
		searchHeight = $('.searchResults', $header).innerHeight();
		headerHeight = $header.innerHeight();
		allLoaded = true;
			
		clearTimeout(checkHeightsTimer);
			
		$.each($searchResultsIMGS, function () {
			if (this.naturalWidth === 0){
				allLoaded = false;
				return;
			}
		});
		
		//Equalise the heights - fix required as the results are positioned absolutely 
		if (contHeight < (searchHeight + headerHeight)){
			$container.css('height', searchHeight + headerHeight + 300);
		}
		
		//If all the images are not yet loaded:
		if (!allLoaded) { 
			
			checkHeightsTimer = setTimeout(function () {
				checkHeights();			
			}, 250);
			//console.log('not all Loaded' + checkHeightsTimer);
			
		}
			
		
		
	};
	
	//CLick on the 'X'- clear search icon
	var clearSearchEvent = function () {
		
		var clearLogic = function () {
			
			if($searchRegion.hasClass('active')) {
			
					//Empty the searchbox
					$searchInput.attr('value', '');//.trigger('change');
					$searchRegion.removeClass('active');
					
					resetSearch();				
					
					if ($('#carousel').length > 0 && !$('#carousel').hasClass('stopped')) {
						$('#carousel').trigger('start');
					}
					
				} else {
					
					return false;
					
				}
			
			return this;
			
		};
		
		$('#clearSearch', $searchRegion).live('click', clearLogic);
		
		$('div.overlay').live('click', clearLogic);
		
	};
	
	//Live clik event for search - analytics;
	var searchLinkClicked = function () {
		
		//Click on a search link - tracking:
		$('ul.searchResults li a').live('click', function () {
			
		//var s = s || {};
			
			
			var $this = $(this),
				clickedLinkURI = $this.attr('href');
			
			
			//s.prop65 = s.eVar65 = "4oD pre search_" + clickedLinkURI;
			
			/*
			// These are set on page load - do we need these here?
			s.prop1 = s.prop1;
			s.eVar1 = s.eVar1;
			s.prop70 = s.prop70
			*/			
			
			//var date = new Date();
			//s.prop29 = s.eVar29 = padNumber(date.getDay()) + '/' + padNumber(date.getDate()) + "/" + padNumber(date.getFullYear()) + "_" + padNumber(date.getHours()) + ":" + padNumber(date.getMinutes());	
			//s.prop8 = s.eVar8 = $searchInput.val();
			
			//console.log(s.prop8);
			
			//not sure this is correct:
			//window.event7 = "";
			//window.event64  = "";
			//window.event34 = "";
			
			//s.events = "event7, event64, event34";
			
			//console.log(s.prop29);
			
			//alert(s.events = "event");
			
			s.linkTrackVars		= "events,prop65,eVar65,prop8,eVar8,prop26,eVar26,prop34";
			s.linkTrackEvents	= s.events = s.eVar26 = s.prop26 = "event64,event34"; //additional event may need to be appended if other events also happen on this event
			//s.prop34			= login_status;
			s.eVar65			= s.prop65	= "4oD pre search_" + clickedLinkURI;
			s.eVar8				= s.prop8 	= $searchInput.val();
			
			s.tl(clickedLinkURI, "o", "SearchClicked");
			
			//console.log(s.tl(clickedLinkURI, "o", clickedLinkURI));
			
			//alert(s.linkTrackVars);
			
			return true;
			
		});
		
	};
	
	var padNumber = function (numberX) {
		
		if (numberX < 10) {
			numberX = "0" + numberX;
		}
		
		return numberX;
		
	};
	
	
	var showMoreButton = function () {
		
		$('ul.searchResults #showMoreContainer button').live('click', function () {
			
			var $this = $(this);
			var searchString = escape($this.data('showmore'));
			var pageNumber = $this.data('nextpage');
					
			//Do ajax
			$.ajax({
				type : 'GET',
				//url : 'mock-json3.txt?s=' + searchString + pageNumber + Math.floor(Math.random()*11),
				url : '/4od/search/ajax/' + searchString + '/page-' + pageNumber,
				dataType : 'json',
				beforeSend : function () {
					$this.parent().parent().addClass('loading');
				},
				success: function (data){
					//successLogic(data, myVal);
					processShowMore(data);
				},
				error: function () {
					//displayError();
					//console.log('error');					
					displayError2();
				},
				timeout: function () {
					// do we want to do something different here?
					//displayError();
					//console.log('timeout');
					displayError2();
				}
			});
			
			
			
		});
		
	};
	
	var processShowMore = function (data) {
		
		var LIstring = "";
		var numberOfresults = data.results.length;
		var moreCount = data.nextPageCount;
		var $button = $('ul.searchResults div#showMoreContainer button');
		
		//console.log(data);
		
		if (numberOfresults > 0) {
			
			$.each(data.results, function () {
			
				LIstring += "<li>" +
					"<article class=\"episode clearfix\">" +
						"<a href=\"" + this.url + "\"><img src=\"" + this.img + "\" alt=\"" + this.title + "\"></a>" +
						"<h1><a href=\"" + this.url + "\">" + this.title + "</a></h1>" +
						//"<p>" + this.episodes + "</p>" +
					"</article>" +
				"</li>";
			
			});
			
		} else {
			
			//There are no results - show the error
			
		}
		
		// If there is another page we need to update the button data, 
		// otherwise remove the button
		if (moreCount === 0) {
			
			$('li.showMoreList').remove();
			
		} else {
			
			$button.data('nextpage', $button.data('nextpage') + 1)
			.parent().parent().removeClass('loading');
			
		}
		

		//Add to existing results
		$('ul.searchResults li:last-child').before(LIstring);
		checkHeights();
	};
	
	var displayError2 = function () {
		
		var $showMoreContainer = $('ul.searchResults div#showMoreContainer');
		$showMoreContainer.removeClass('loading');
		$showMoreContainer.prepend('<p class="error">An error has occured. Please try again later</p>');
		
		$('button', $showMoreContainer).remove();
		
	};
	
	return {init: init};
	
}();


c4.player = function() {

    var options,
    	$episodeGroup,
    	$episodeDetail,
    	$article,
    	$modal,
    	$container,
    	REQUIRED_FLASH_VERSION = "10.2";

    var init = function() {
    	$episodeGroup = $('div.episodeGroup');
    	$episodeDetail = $('#episodeDetail');

		var $context = ($episodeDetail.length > 0) ? $episodeDetail : $episodeGroup;

		// get out if no context
		if ($context.length === 0) {
			return false;
		}

		// list for clicks on episode thumbnails and play button
		$context.delegate("div.screenshotCont a, div.playBut a", "click", function() {
			$article = $(this).parents('article');
			show();

			return false;	
		 });
		
		return this;
		
    };

    var setOptions = function() {

		options = {};
		options.flashvars = {};
		options.params = {};
		options.attributes = {};

        options.swfPath = "/swf/mobileplayer-10.2.0-1.0-SNAPSHOT.swf";
        options.playerId = "catchupPlayer";
        options.version = REQUIRED_FLASH_VERSION;
        options.width = "100%";
        options.height = "100%";

        options.replacementId = "playerCont";

        options.flashvars.mimri = "false";
		//cdn to use akamai = ak  ll = limelight
		options.flashvars.overRideCDN = "ll";
		// debug on or off
		options.flashvars.debug = "false";
		
		options.flashvars.primaryColor = "0xCC0000"; 
		
		options.flashvars.rating = $article.data('rating') || "";
		options.flashvars.wsBrandTitle = $article.data('wsbrandtitle') || "";
		
		options.flashvars.useStaticStartScreen = "true";

		// callback function name for player state change
		options.flashvars.jsEventHandlerMethod = "c4.player.onPlayerStateChange";
		
		options.flashvars.mobile = "true";
		
		// TODO: NEED TO REMOVE THIS LINE WHEN C4 CAN PROVIDE END VIDEO ASSETS
		options.flashvars.preSelectAssetURL = "http://ais.int.channel4.com/asset/2922793";
		//options.flashvars.preSelectAssetURL = $article.data('preselectasseturl') || "";
		options.flashvars.preSelectAssetGuidance = $article.data('preselectassetguidance') || "";
		// go into full screen mode when player clicked
		options.flashvars.autoFS = "true";
		// force they player to render in software mode rather than stagevideo
        // flashvars.forceSoftwareMode = "false";

        options.params.quality = "high";
        options.params.bgcolor = "#000000";
        options.params.allowscriptaccess = "sameDomain";
        options.params.allowfullscreen = "true";
        // wmode must be set to direct for StageVideo to work on mobile.
        options.params.wmode = "direct";

        options.attributes.id = "MobileVideoPlayer";
        options.attributes.name = "MobileVideoPlayer";
        options.attributes.align = "middle";

    };

    var embedFlashPlayer = function() {
        swfobject.embedSWF(
            options.swfPath, 
        	options.replacementId, 
        	options.width, 
        	options.height, 
        	options.version, 
        	options.expressSwfPath, 
        	options.flashvars, 
        	options.params, 
        	options.attributes
        );
    };

    var createModal = function() {

    	var flashPlayerDownloadUrl = "http://www.macromedia.com/go/getflashplayer";

    	// hide the container div
    	$container = $('div#container');
    	$container.hide();

    	$modal = $('<div>', {'id': 'playerModal'});
    	var $playerCont = $('<div>', {'id': 'playerCont'});  	
    	$playerCont.append($('<h1>Please Update Your Flash Player</h1><div class="close"><a href="#">Close</a></div><p>It seems you do not have the most up to date Flash Player. Please click below to update.</p><div class="downloadBut"><a href="' + flashPlayerDownloadUrl + '">Download latest Flash Player</a></div>'));

    	$modal.append($playerCont);  
    	$('body').append($modal);

    	$('div.close', $playerCont).bind('click', function() {
    		remove();
    	});

    };

    var addHashValue = function() {
    	window.location = "#player";
    };

    var removeHashValue = function() {
    	window.location = "#";
    };

    // show the player
    var show = function() {

		// Stop the carousel if there
		if ($('#carousel').length > 0) {
			$('#carousel').trigger('stop');			
		}

    	createModal();

    	// only embed flash if required flash version is present
    	if (swfobject.hasFlashPlayerVersion(REQUIRED_FLASH_VERSION)) {

	    	// add hash to url to use to get back button to appear to close the 
	    	// player rather than going back a page
	    	addHashValue();

			window.onhashchange = function() {
	   			// remove the player on hash change (but not if #player is present)
	   			if (location.href.indexOf("#player") < 1) {
					remove();
				}
			 };

	    	setOptions();
	    	embedFlashPlayer();
	    }
    };
   
    // remove the player
    var remove = function() {
		
		var currentLocation = (window.location + "").split('#', 1);
		
		setTimeout( function () { window.location = currentLocation }, 100 );
		
		// remove the  modal
    	//$modal.remove();
    	//$container.show();

    	//removeHashValue();

		// Start the carousel if exists
		//if ($('#carousel').length > 0) {
		//	$('#carousel').trigger('start');
		//}

    };

    // Callback for player state change event
	var onPlayerStateChange = function(type,assetID){

		switch (type) {
			case "0":
				//play
				break;
			case "1":
				//pause
				break;
			case "2":
				//stop
				break;
			case "3":
				//fullscreen click
				break;
			case "4":
				//fullscreen exit
				remove();
				break;
		}
	};    


    return {
    	init: init,
    	onPlayerStateChange: onPlayerStateChange
    };

}();



c4.parentalControl = function () {
	
	var init = function () {
		
		clickEnablePin();
		clickDisablePin();		
		keyUpPinInput();
		
	};
	
	var keyUpPinInput = function () {
	
		var $pinForm = $('form#pinForm');
		
		$('input[type="number"]', $pinForm).live('keyup', function (e) {
			
			$this = $(this);
			thisVal = $this.val();
			
			//Rewrite the value if length > 1;

			if (thisVal.length > 1) {
				$this.val(thisVal.charAt(thisVal.length - 1));
			}
			
			
			if (!isNaN(thisVal) && thisVal != "" ) {
				if (((e.keyCode > 47) && (e.keyCode < 91)) || ((e.keyCode > 95) && (e.keyCode < 106))) {
					$this.next('input').focus();
				}
			}

		} );
		
	};
	
	var clickEnablePin = function () {
		
		var $pinForm = $('form#pinForm.enable');
		
		$('input.enablePin', $pinForm).live('click', function () {
			
			//Get all the values
			var selectedRadioValue = $('input[name="pControl"]:checked', $pinForm).val();
			var tsncs = $('input#confirmation', $pinForm).is(':checked');
			var pin = "";
			// This is ugly - sorry
			var userPin = function () {
																		
										for (i=1;i<=4;i++){
											
											var thisPin = $('input#pinInput' + i).val();
											
											if (!isNaN(thisPin) && thisPin != "") {
												pin += $('input#pinInput' + i).val();
											} else {
												return false;
											}

										}
										
										return pin;
										
									}();
			
			if (!selectedRadioValue || !userPin || !tsncs) {
				
				//what's not valid
				$('#errorSpace, #tsncsErrorSpace').html("");
				
				
				if (!tsncs){
					$('#tsncsErrorSpace').prepend("<p class=\"pinError\">Please confirm that you accept the Terms and Conditions</p>");
				}
				
				if (!userPin) {
					$('#errorSpace').append("<p class=\"pinError\">Incorrect PIN entered</p>");					
				}
				
				return false;
				
			} else {

				$('#pinEncrypted', $pinForm).val($.md5(userPin));
				
				$('#errorSpace').html("");
				
				return true;
			}
			
			
		});
	
	};
	
	var clickDisablePin = function () {
		
		var $pinForm = $('form#pinForm.disable');
		
		$('input.disablePin', $pinForm).live('click', function () {
			
			//Get all the values
			var pin = "";
			// This is ugly - sorry
			var userPin = function () {
																		
										for (i=1;i<=4;i++){
											
											var thisPin = $('input#pinInput' + i).val();
											
											if (!isNaN(thisPin) && thisPin != "") {
												pin += $('input#pinInput' + i).val();
											} else {
												return false;
											}

										}
										
										return pin;
										
									}();
			
			if (!userPin) {
				
				//what's not valid
				$('#errorSpace').html("");								
				
				$('#errorSpace').append("<p class=\"pinError\">Incorrect PIN entered</p>");					
				
				return false;
				
			} else {			
				
				$('#pinEncrypted', $pinForm).val($.md5(userPin));
				
				$('#errorSpace').html("");
				return true;
			}
			
			
		});
	
	};
	
	return {init: init};
	
}();

c4.desktopCookie = function() {
	
	var init = function () {
		
		$('footer a#desktop').live('click', function () {
			
			document.cookie="dontgotomobile=1; expires=Session; path=/; domain=.channel4.com;";
			return true;
			
		});
		
	};
	
	return {init: init};
	
}();


// needs to be uppercase - as the object method is expected from the SWF
C4 = {};

//C4.PinController.getEvents().triggerEventFromFlash("FORGOTTEN_PIN");
//C4.PinController.getEvents().triggerEventFromFlash("CHANGE_PIN");
//C4.PinController.getEvents().triggerEventFromFlash("SETUP_PIN");

C4.PinController = (function ($) {

    var Events = {
        triggerEventFromFlash: function (eventType) {
			
			//console.log(eventType);
			
            switch (eventType) {
			case "FORGOTTEN_PIN":
				setTimeout( function () { window.location ='/help/#forgotten-pin'; }, 100 );
			  	break;
			case "CHANGE_PIN":
				setTimeout( function () { window.location = $('footer a#parentalControl').attr('href'); }, 100 );				
			  	break;
			case "SETUP_PIN":
				setTimeout( function () { window.location = $('footer a#parentalControl').attr('href'); }, 100 );								
				break;
			}
			
			return true;
			
        }
    };

    return {
        getEvents: function getEvents() {
            return Events
        }
    }

})(jQuery);


/*
c4.PinController = function (event) {

	
	getEvents = function (param) {
		
		switch(param){
			
		case "FORGOTTEN_PIN":
			//console.log("go to forgot pin");
			//trigger click
			window.location ='/help/#forgotten-pin';
		  	break;
		case "CHANGE_PIN":
			window.location = $('footer a#parentalControl').attr('href');
		  	break;
		case "SETUP_PIN":
			window.location = $('footer a#parentalControl').attr('href');
			break;
		}		
		
	}
	
	return {getEvents:getEvents};
	
}();
*/

// window load - when all resources are ready
$(document).ready(function () {
	c4.deviceDetection.init();
	c4.whichCarousel.init();
	c4.search.init();
	c4.player.init();
	c4.parentalControl.init();
	c4.desktopCookie.init();	
	c4.whichCarousel.renderCarousel(false);
	
	//alert(c4.globalProperties.device);
	//alert($(window).width());
	//c4.enableSearch.init();
});

// resize events
$(window).resize(function () {
	
	//We need to slow down the resize events:
	c4.whichCarousel.renderCarousel(true);
	//c4.carouselHeight.init();
});
