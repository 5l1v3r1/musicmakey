/**
 * The players array stores the list of Audio objects.
 * Note that Javascript arrays are different than arrays in
 * other languages. An array in javascript can have holes,
 * that is, you can set array[3] without setting array[2],
 * and you never have to specify the length of the array;
 * you can simply access whatever element you want!
 */ 
var players = new Array();

var extension = 'mp3'; // for compatibility. 'mp3' usually also works.

/**
 * This is a boolean object (boolean means true or false).
 * I set it up so when this is true, it plays every song for a key
 * once before playing it again, although it still randomizes the order.
 * If this is false, the song will be randomized each time.
 * Note: even with this =true, there can still be repeats
 * if the last song of one cycle is the first song of the next.
 */
var noRepeats = true;

/**
 * This is an array...in an array! The outer array
 * contains 8 objects, and each of these objects is an array!
 * The point is, the first array contains songs for A,
 * the next for B, etc.
 */
var songs = [
    ['aSongs/what_is_love', 
     'aSongs/Somebody_To_Love',
     'aSongs/Hold_Your_Hand',
     'aSongs/Lonliest_Number',
     'cSongs/Sugar_pie_honey_bunch'],
    ['bSongs/Friends',
     'bSongs/ALL_YOU_NEED_IS_LOVE',
     'bSongs/I_will_always_love_you',
     'bSongs/Ill_be_there_for_you_bon_jovi'],
    ['cSongs/Stand_By_Me',
     'cSongs/Happy_Together',
     'cSongs/Ill_Be_There_for_You',
     'aSongs/My_Love'],
    ['dSongs/Crazy_in_Love',
     'dSongs/Crazy_Little_Thing_Called_Love',
     'dSongs/Bleeding_Love',
     'dSongs/Lucky'],
    ['eSongs/Something',
     'eSongs/She_loves_you',
     'eSongs/More_Than_A_Feeling'],
    ['fSongs/Lean_On_Me_bridge',
     'fSongs/Lean_On_Me_Chorus'],
    ['gSongs/higher'],
    ['hSongs/Aint_no_Mountain_High_Enough']
];

/**
 * When using noRepeats=true, I use this to keep track
 * of which songs are left to be played before that letter
 * starts to replay songs.
 */
var songCopy = [];

/**
 * "$(function() {" is jQuery code that tells the browser
 * to run the code inside when the page has finished loading.
 */
$(function() {
    // An ordered list of keyCodes.
    // 'string'.charCodeAt(0) gets the ASCII code
    // for the first character of the string. This is
    // useful because keyCodes for letters are just the
    // ASCII values.
    var codeList = ['A'.charCodeAt(0),
                    38, // up
                    37, // left
                    'D'.charCodeAt(0),
                    40, // down
                    'F'.charCodeAt(0),
                    'G'.charCodeAt(0),
                    39 // right
                    ];
    
    // "$(object).keydown(function(e) {" is jQuery code which
    // tells the browser to run some code when a key is pressed
    // on the `object` in question. Since document.body is the entire
    // webpage, this event will trigger no matter what the user
    // has selected. The "function(e)" tells the browser that
    // it should store the event info in a variable called e, and
    // e.keyCode gives us the keyCode for the event.
    $(document.body).keydown(function(e) {
        // This next line gets the index in codeList where e.keyCode
        // can be found. If codeList doesn't contain e.keyCode
        // (i.e. they pressed an invalid key) then index will be -1.
        var index = codeList.indexOf(e.keyCode);
        if (index >= 0) playSongForIndex(index);
    }).keyup(function(e) { // note that jQuery allows you to chain events
        var index = codeList.indexOf(e.keyCode);
        if (index >= 0) stopSongForIndex(index);
    });
});

/**
 * Picks a random song for an index.
 * If noRepeats is true, extra logic is necessary.
 */
function randomSongForButton(index) {
    if (!noRepeats) {
        // Find the list of songs in our `songs` array.
        // Remember, the outer array has 8 elements for each
        // list of songs.
        var list = songs[index];
        // Generate a random number, similar to Processing
        var useIndex = Math.floor(Math.random() * list.length);
        // We use + to concatenate strings; E.g. we have something like
        // list[useIndex]="myfile" and extension="wav" and generate
        // a string "myfile.wav"
        return list[useIndex] + '.' + extension;
    } else {
        var list = songCopy[index]; // get our working list
        if (!list || list.length == 0) {
            // the working list is empty, so we have to reset
            // the list to the songs in the `songs` array
            songCopy[index] = songs[index].slice(); // copy the list
            list = songCopy[index];
        }
        var useIndex = Math.floor(Math.random() * list.length);
        var name = list[useIndex] + '.' + extension;
        // splice, in this case, will remove the item in the list
        // that is at index `useIndex`.
        list.splice(useIndex, 1);
        return name;
    }
}

function playSongForIndex(index) {
    if (players[index]) {
        // This backlog gets WAY too annoying.
        // backlog('Song already playing at #' + index);
        return;
    }
    // The Audio object can be created like this:
    // player = new Audio('my/file/name.mp3');
    var song = randomSongForButton(index);
    backlog('Playing ' + song + ' for #' + index);
    players[index] = new Audio(song);
    players[index].play();
}

function stopSongForIndex(index) {
    var player = players[index];
    // If we pass an object to an if statement, the object
    // is considered `true` if it is not 0, false, null,
    // undefined, or ""
    if (player) {
        backlog('Stopping song #' + index);
        // Pausing and then setting currentTime=0 is the suggested
        // way of stopping an Audio object.
        if (!player.paused) player.pause();
        player.currentTime = 0;
        players[index] = null; // set the slot back to null
    } else {
        backlog('No song #' + index);
    }
}

/**
 * Writes a message to the backlog, adding the date to the beginning.
 */
function backlog(msg) {
    postBacklog('<b>' + new Date() + '</b>: ' + msg);
}

/**
 * Writes a raw HTML string to the backlog.
 */
function postBacklog(msg) {
    var span = $('<span class="logmessage"></span>');
    span.html(msg);
    $('#backlog').append(span);
    $('html, body').scrollTop($(document).height());
}
