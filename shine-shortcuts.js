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
	//console.log(t);
	this.animate({
		scrollTop: $('.comment-'+t).offset().top - $(this).offset().top + $(this).scrollTop() - 10
	}, 200);
	//console.log(scrollAmount);
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
	$('.comment').scrollParent().scrollTo(commentNumber);
}


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