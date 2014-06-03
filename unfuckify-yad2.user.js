// ==UserScript==
// @name       Unfuckify yad2
// @namespace  http://www.pavius.net
// @version    0.0.1
// @description  Make using yad2 not want to make you kill yourself
// @match      www.yad2.co.il/Nadlan/rent.php?*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// ==/UserScript==


// remove piece of shit distractions
[
    ".bannerBetweenTables_main",
    ".search_banners",
    ".main_table_wrap:eq(1)",
    "#Hotpics",
    "#lastsearch_block",
    "iframe",
    ".walla_strip",
    ".articles_block",
    "#footer",
    ".intro_block"
    
].forEach(function(elementName)
          {
              $(elementName).remove();
          });


function getBackgroundColorBySeen(seen)
{
    if 			(seen == 1) return '#FCF3D7';
    else		return '#E2E3E8';
}

function loadAdState(aid)
{
	// read from local storage, deserialize
    var adState = JSON.parse(localStorage.getItem(aid));
	
    // if not found, shove defaults
    if (adState === null)
    {
        adState = 
        {
        	seen: 0,
            interest: true
        };
    }
    
    return adState;
}

function saveAdState(aid, state)
{
	// just save
    localStorage.setItem(aid, JSON.stringify(state));
}

function renderRowInterest(rowElement, aid, interest)
{
    var lastTdText, rowTextColor;
    
    if (interest === true)
    {
        lastTdText = '-';
        rowTextColor = '#000000';
    }
    else
    {
        lastTdText = '+';
        rowTextColor = '#BBBBBB';
    }
    
    // change "details" to "dont give a fuck"
    rowElement.find('td:last-child').html(lastTdText).click({aid: aid, interest: !interest}, setAdInterest);
    rowElement.find('td').css('color', rowTextColor);
}

function setAdInterest(event)
{
	// update interest
    adState = loadAdState(event.data.aid);
    adState.interest = event.data.interest;
    saveAdState(event.data.aid, adState);
    
    // re-render row
    renderRowInterest($(this).parent(), event.data.aid, event.data.interest);
}

// find all displayed ad IDs and render each row according to what we know about it
$("tr[id^='tr_Ad_2_2_']").each(function(index)
                               {
                                   // get the ad identifier
                                   var aid = $(this).attr('id').replace('tr_Ad_2_2_', '');
                                   
                                   // get the attributes for this ad, use default
                                   var adState = loadAdState(aid);
                                   
                                   // increment # of times we've seen this ad
                                   adState.seen += 1;
                                   
                                   // indicate how many times we've seen it
                                   $(this).find('td:eq(1)').html(adState.seen);
                                   
                                   // set background color
                                   $(this).find('td')
                                       .css('background', getBackgroundColorBySeen(adState.seen))
                                   	   .css('font-weight', 'normal');

                                   // change the row to reflect if we've expressed disgust at it yet
                                   renderRowInterest($(this), aid, adState.interest);
                                   
                                   // save what we know about this item
                                   saveAdState(aid, adState);
                               });