/**
Core script to handle the entire theme and core functions
**/
var Frost = function(){
	/* Search Bar ============ */
	var screenWidth = $( window ).width();
	
	/* Website Launch Date */ 
	var WebsiteCurrentDate = new Date();
	monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	WebsiteCurrentDate.setMonth(WebsiteCurrentDate.getMonth() + 1);
	WebsiteLaunchDate =  WebsiteCurrentDate.getDate() + " " + monthNames[WebsiteCurrentDate.getMonth()] + " " + WebsiteCurrentDate.getFullYear(); 
	/* Website Launch Date END */ 
	
	
	/* Countdown Style 1 
	   - Put your launching date here and uncomment this line*/
	//var WebsiteLaunchDate = '2 February 2020 10:00';
	var handleCountDown = function(WebsiteLaunchDate){
		/* Time Countr Down Js */
		if($(".countdown").length)
		{
			$('.countdown').countdown({date: WebsiteLaunchDate}, function() {
				$('.countdown').text('we are live');
			});
		}
		/* Time Countr Down Js End */
	}
	
	
	/* Countdown Style 2 */
	var handleFinalCountDown = function(){
		if(jQuery('.countdown-timer').length > 0 )
		{
			var startTime = new Date( "Jan 25 2020 17:02:37" ); // Put your website start time here
			startTime = startTime.getTime();
			
			var currentTime = new Date();
			currentTime = currentTime.getTime();
			
			var endTime = new Date( "Dec 31 2020 17:02:37" ); // Put your website end time here
			endTime = endTime.getTime();
			
			$('.countdown-timer').final_countdown({
				
				'start': (startTime/1000),
				'end': (endTime/1000), 
				'now': (currentTime/1000), 
				selectors: {
					value_seconds:'.clock-seconds .val',
					canvas_seconds:'canvas-seconds',
					value_minutes:'.clock-minutes .val',
					canvas_minutes:'canvas-minutes',
					value_hours:'.clock-hours .val',
					canvas_hours:'canvas-hours',
					value_days:'.clock-days .val',
					canvas_days:'canvas-days'
				},
				seconds: {
					//borderColor:'#c90103',
					borderColor:$('.type-seconds').attr('data-border-color'),
					borderWidth:'5',
				},
				minutes: {
					//borderColor:'#c90103',
					borderColor:$('.type-minutes').attr('data-border-color'),
					borderWidth:'5'
				},
				hours: {
					//borderColor:'#c90103',
					borderColor:$('.type-hours').attr('data-border-color'),
					borderWidth:'5'
				},
				days: {
					//borderColor:'#c90103',
					borderColor:$('.type-days').attr('data-border-color'),
					borderWidth:'5'
				}
			});
		}	
	}
	
	
	var handleCustomScroll = function(){
		/* all available option parameters with their default values */
		if($(".content").length > 0)
		{ 
			if($(".content").hasClass('scroll-off'))
			{
				if(screenWidth > 900)
				{
					$(".content").mCustomScrollbar({
						setWidth:false,
						setHeight:false,
						axis:"y"
					});	
				}					
			}
			else
			{
				$(".content").mCustomScrollbar({
					setWidth:false,
					setHeight:false,
					axis:"y"
				});	
			}
			
			//screenWidth
			
		}
	}
	
	var kenburnSlider = function(){
		if($("#kenburn").length > 0)
		{ 
			$("#kenburn").slippry({
				 transition: 'kenburns',
				 useCSS: true,
				 speed: 8000,
				 pause: 3000,
				 auto: true,
				 preload: 'visible',
				 autoHover: false
			});
		}
	}
	
	var parallex = function(){
		if($(".parallax").length > 0)
		{ 
			var currentX = '';
			var currentY = '';
			var movementConstant = .015;
			$(document).on('mousemove',function(e) {
				  if(currentX == '') currentX = e.pageX;
				  var xdiff = e.pageX - currentX;
				  currentX = e.pageX;
				   if(currentY == '') currentY = e.pageY;
				  var ydiff = e.pageY - currentY;
				  currentY = e.pageY; 
				  $('.parallax div').each(function(i, el) {
					  var movement = (i + 1) * (xdiff * movementConstant);
					  var movementy = (i + 1) * (ydiff * movementConstant);
					  var newX = $(el).position().left + movement;
					  var newY = $(el).position().top + movementy;
					  $(el).css('left', newX + 'px');
					  $(el).css('top', newY + 'px');
				  });
			});
		}
	}
	
	var handleSideBarMenu = function(){
		
		jQuery('.openbtn').on('click',function(){
			jQuery('.about-sidebox').addClass('active');
			
		});
		jQuery('.closebtn').on('click',function(){
			jQuery('.about-sidebox').removeClass('active');
			
		});
		jQuery('.map-btn').on('click',function(){
			jQuery('.map-box').toggleClass('active');
		});
		
		jQuery('.menu-btn a').on('click',function(){
			jQuery('.menuleft').addClass('active');
			
		});
		jQuery('.menuleft .close-btn').on('click',function(){
			jQuery('.menuleft').removeClass('active');
			
		});
	}
	
	/* WOW ANIMATION ============ */
	var wow_animation = function(){
		if($('.wow').length > 0)
		{
			var wow = new WOW(
			{
			  boxClass:     'wow',      // animated element css class (default is wow)
			  animateClass: 'animated', // animation css class (default is animated)
			  offset:       -200,          // distance to the element when triggering the animation (default is 0)
			  mobile:       false       // trigger animations on mobile devices (true is default)
			});
			wow.init();	
		}	
	}
	
	
	var handlePlaceholderAnimation = function()
	{
		if(jQuery('.dezPlaceAni').length)
		{
		
			$('.dezPlaceAni input, .dezPlaceAni textarea').on('focus',function(){
			  $(this).parents('.form-group, .news-box').addClass('focused');
			});
			
			$('.dezPlaceAni input, .dezPlaceAni textarea').on('blur',function(){
			  var inputValue = $(this).val();
			  if ( inputValue == "" ) {
				$(this).removeClass('filled');
				$(this).parents('.form-group, .news-box').removeClass('focused');  
			  } else {
				$(this).addClass('filled');
			  }
			})
		}
	}
	
	/* Masonry Box ============ */
	var masonryBox = function(){
		'use strict';
		/* masonry by */
		if(jQuery('#masonry, .masonry').length)
		{
			var self = $("#masonry, .masonry");
			if(jQuery('.card-container').length)
		    {
				self.imagesLoaded(function () {
					self.masonry({
						gutterWidth: 15,
						isAnimated: true,
						itemSelector: ".card-container"
					});
				});
			}
		}
		/* masonry by end */
	}
	
	/* Light Gallery ============ */
	var lightGallery = function (){
		if(($('#lightgallery, .lightgallery').length > 0)){
			$('#lightgallery, .lightgallery').lightGallery({
				selector : '.check-km',
				loop:true,
				thumbnail:true,
				exThumbImage: 'data-exthumbimage'
			});
		}
	}
	
	var reposition = function (){
		'use strict';
		var modal = jQuery(this),
		dialog = modal.find('.modal-dialog');
		modal.css('display', 'block');
		
		/* Dividing by two centers the modal exactly, but dividing by three 
		 or four works better for larger screens.  */
		dialog.css("margin-top", Math.max(0, (jQuery(window).height() - dialog.height()) / 2));
	}
	
	var heartBlast = function (){
		$(".heart").on("click", function() {
			$(this).toggleClass("heart-blast");
		});
	}
	
	
	
	
	/* Function ============ */
	return {
		init:function(){
			heartBlast();
			masonryBox();
			wow_animation();
			handleCountDown(WebsiteLaunchDate);
			handleFinalCountDown();
			
			handleSideBarMenu();
			handlePlaceholderAnimation();
			lightGallery();
			kenburnSlider();
			parallex();
			jQuery('.modal').on('show.bs.modal', reposition);
		},
		load:function(){
			handleCustomScroll();
		},
		resize:function(){
			handleFinalCountDown();
			setTimeout(function(){
			  masonryBox();
			},2000);
		},
	}
	
}();

/* Document.ready Start */	
jQuery(document).ready(function() {
  Frost.init();
});
/* Document.ready END */
/* Window Load START */
jQuery(window).on("load", function (e) {
	Frost.load();
	setTimeout(function(){
		jQuery('#loading-area').remove();
	}, 0);
});
/*  Window Load END */
/* Window resize START */
jQuery(window).on("resize", function (e) {
	Frost.resize();
});
/*  Window resize END */