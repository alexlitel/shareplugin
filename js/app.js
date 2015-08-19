//This application will execute functionality for the Simple Share Plugin. 

//declaration of universal variables for use throughout app
var fbCount, twCount, totalCount;
//url for testing the code with a page count
var urlDebug = 'http://www.google.com', 
//current url
    urlCurrent = window.location.href,
//url to retrieve JSON file /w Twitter share count
    twitterCountUrl = 'http://urls.api.twitter.com/1/urls/count.json?url=' + urlCurrent + '&callback=?',
//url to retrieve JSON file w/ Facebook share count
    facebookCountUrl = 'https://graph.facebook.com/fql?q=SELECT%20share_count,%20like_count,%20comment_count,%20total_count,commentsbox_count,%20comments_fbid,%20click_count%20FROM%20link_stat%20WHERE%20url=%27' + urlCurrent + '%27', fbShareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + urlCurrent + "&t=" + document.title, twShareUrl = "https://twitter.com/intent/tweet?text=" + document.title + "url=" + urlCurrent;

//listener event to open up new window with Twitter or Facebook share dialog 
$('#social li').on('click touchstart', '.sharelink', function(evt) {
  evt.preventDefault();
  //grab url inside 'shareclick' class
  window.open($(this).attr('href'), "_blank");

  return false;
});

//equivalent event for people using tab/alternate navigation
  //uses the whole li instead of generated sharelink to make it easier
$('#social li').on('keypress', function(e) {
  //checks if the input key is "enter/return" & 'sharelink' class exists
  if (e.which === 13 && $(this).children('.sharelink').length) {
    e.preventDefault();
    //grab url inside 'shareclick' class
    window.open($(this).children('.sharelink').attr('href'), "_blank");

    return false;
  }
});


//function to convert number to a string 
function getnumString(num) {
  var numString;
  //prints normal number if < 1000
  if (num < 1000) {
    numString = num;
  //prints number w/ comma if between 1000 and 9999
  } else if (num < 10000) {
    numString = num.charAt(0) + ',' + num.substring(1);
  //if between 10,000 and 999,999, prints number in format of # of thousands + k (ie 10k, 100k, etc)
  } else if (num < 1000000) {
    numString = (Math.round((num / 1000) * 10) / 10) + "k"
    //if # between 1 million & 1 billion, print number in format of # of millions + M (ie 1M, 10M, 100M)
  } else if (num < 1000000000){
    numString = (Math.round((num / 1000000) * 10) / 10) + "M"
    //if number greater tha 1 billion, print number in format of # of billions + B (ie 1B, 10B, 100B)
      //this probably will not be relevant in foreseeable future unless there is a hack or weird glitch
  } else if (num > 1000000000){
    numString = (Math.round((num / 1000000) * 10) / 10) + "B"
  }
  //return number in string format
  return numString.toString();
}

//when function to compute total share count after Twitter & FB share counts calculated
$.when(
  //$getJSON method to get Twitter count
  $.getJSON(twitterCountUrl, function twitterCount(data) {
    //set count from JSON equal to previously declared variable
    twCount = data.count;
    //append Twitter count to list
    $('.twitter').append('<p class="num">' + getnumString(twCount) + '</p>');
  }),

  //$getJSON method to get Facebook count
  $.getJSON(facebookCountUrl, function facebookCount(data) {
    //set count from JSON equal to previously declared variable
      fbCount = data.data[0].like_count;
      //append Twitter count to list
      $('.facebook').append('<p class="num">' + getnumString(fbCount) + '</p>');
      //if the Facebook count is done, execute the functiont to calculate total count
    })).done(function(response) {
  totalCount = fbCount + twCount;
  //append total count to initial element
  $('.share').append('<p class="num">' + getnumString(totalCount) + '</p>');
});

//event to reveal FB and Twitter count LIs upon interaction with the share UL
$('#social ul').on('mouseover touchstart focusin', function() {
  //slide down LI elements and change aria attribute
  $('.facebook, .twitter').slideDown("slow").attr("aria-hidden", "false");
//event to hide FB and Twitter counts upon stop interaction with the share UL
}).on('mouseleave focusout', function() {
  $('.facebook, .twitter').hide().attr("aria-hidden", "true");

});
//equivalent hide event for mobile devices
$('.share').on('touchend', function() {
  $('.facebook, .twitter').hide().$('.facebook, .twitter').attr("aria-hidden", "true");
})

//listener event to change Twitter LI to suggest sharing page upon interaction with LI
$('#social .twitter').on('mouseenter touchmove', function() {
  //change share count text to share link
  $(this).html('<a  class="sharelink" href="' + twShareUrl + '">TWEET<br>LINK</a>');
}).on('mouseleave touchcancel touchend', function() {
  //event to revert Twitter LI back to normal
  $(this).html('<p> tweets</p>').append('<p class="num">' + getnumString(twCount) + '</p>');
  //event to change Twitter LI for people using tab navigation
}).on('keyup', function(e) {
  if (e.which === 9) {
    e.preventDefault();
    $(this).html('<a  class="sharelink" href="' + twShareUrl + '">TWEET<br>LINK</a>');
  }
  //event to revert Twitter LI for people using tab navigation
}).on('keydown', function(e) {
  //check if user pressed tab and whether the previous LI change event was executed
  if (e.which === 9 && $(this).children('.sharelink').length) {

    $(this).html('<p> tweets</p>').append('<p class="num">' + getnumString(twCount) + '</p>');
  }
});

//listener event to change Facebook LI to suggest sharing page upon interaciton with LI
$('#social .facebook').on('mouseenter touchmove', function() {
  //change share count text to share link
  $(this).html('<a  class="sharelink"  href="' + fbShareUrl + '">SHARE<BR>ON FB</a>');
  //event to revert FB LI back to normal
}).on('mouseleave touchcancel touchend', function() {
  $(this).html('<p>likes</p>').append('<p class="num">' + getnumString(fbCount) + '</p>');
    //event to change FB LI for people using tab navigation
}).on('keyup', function(e) {
  if (e.which === 9) {
    e.preventDefault();
    $(this).html('<a  class="sharelink"  href="' + fbShareUrl + '">SHARE<BR>ON FB</a>');
  }
  //event to revert FB LI for people using tab navigation
}).on('keydown', function(e) {
  //check if user pressed tab and whether the previous LI change event was executed
  if (e.which === 9 && $(this).children('.sharelink').length) {
    $(this).html('<p>likes</p>').append('<p class="num">' + getnumString(fbCount) + '</p>');
  }
});