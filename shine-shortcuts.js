var isCommentPage = ($("body").hasClass("comments-page") ? true : false);

if(isCommentPage == true) {
	if (commentNumber == undefined) {
		var commentNumber = -1;
	}	
	$("body").find('.commentarea > .sitetable > .comment').each(function(i) {
	    $(this).addClass('comment-' + i);
	});
}

$.fn.scrollParent = function() {
  var position = this.css( "position" ),
  excludeStaticParent = position === "absolute",
  scrollParent = this.parents().filter( function() {
    var parent = $( this );
    if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
      return false;
    }
    return (/(auto|scroll)/).test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
  }).eq( 0 );

  return position === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
};

$.fn.scrollTo = function(t) {
	var fromTop	= (isCommentPage === false ? $('.comment-'+t).offset().top - $(this).offset().top + $(this).scrollTop() : $('.comment-'+t).offset().top - $('#header').height()) - 10;

	this.animate({ scrollTop: fromTop }, 200);
};

function commentScroller (direction) {
	var nextNumber;

	if (direction == 'prev') {
		nextNumber = commentNumber-1;		
		if($('.comment-'+ nextNumber).length){
    		commentNumber--;
		}
	} else {
		nextNumber = commentNumber+1;
		if($('.comment-'+ nextNumber).length){
    		commentNumber++;
		}
	}

	isCommentPage === false ? $('.comment').scrollParent().scrollTo(commentNumber) : $('html, body').scrollTo(commentNumber);
}

if ($('html').hasClass('show-comment-navigation')){
	var checkExist = setInterval(function() {
		if($(".comment").length) {
			$('.shine-nav-comment').addClass('visible');
		} else {
			$('.shine-nav-comment').removeClass('visible');
		}
	}, 100);
}

$('body').on('click','.shine-comment-next', function(){
		commentScroller('next');
});

$('body').on('click','.shine-comment-prev', function(){
		commentScroller('prev');
});


// KEY SHORTCUTS
$('body').keyup(function (e) {
	switch( e.keyCode ) {
	case 27:
     	resetInterfaces();
     	break;
	case 39:
		commentScroller('next');
		break;
	case 37:
		commentScroller('prev');
		break;
	}
});