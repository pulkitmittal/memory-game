var getCards = function() {
	var cards = [];
	for(var i=1; i<=no_of_cards; i++) {
		cards.push(i);
		cards.push(i);
	}
	//shuffle
	cards.sort(function() {return 0.5 - Math.random()});
	return cards;
};

var resetGame = function(interval) {

	$$('#game-board .card').each(function(element) {
		element.removeClassName('open');
		element.removeClassName('closed');
		element.removeClassName('selected');
		Element.setStyle(element, {'background-image': 'url("img/card_bg.gif")'});
	});
	$$('#game-board .card')[0].addClassName('selected');

	Element.store('current-score', 'value', 0);
	Element.store('total-moves', 'value', 0);
	Element.store('pairs-opened', 'value', 0);
	Element.store('time-lapsed', 'value', 0);
	Element.update('current-score', 0);
	Element.update('total-moves', 0);
	Element.update('pairs-opened', 0);
	Element.update('time-lapsed', '00:00');

	// get these values from server
	Element.store('games-played', 'value', 0);
	Element.store('best-score', 'value', 0);
	Element.update('games-played', 0);
	Element.update('best-score', 0);
	var userid = readCookie('memory-game-userid');
	if(userid) {
		new Ajax.Request('getUserStats.php', {
			method: 'get',
			parameters: {userid: userid},
			onSuccess: function(transport) {
				var response = transport.responseText || "no response text";
				console.log("Success! \n\n" + response);
				response = JSON.parse(response);
				if(response.success && response.obj) {
					Element.store('games-played', 'value', parseInt(response.obj.count));
					Element.store('best-score', 'value', parseInt(response.obj.max));
					Element.update('games-played', response.obj.count);
					Element.update('best-score', response.obj.max);
				}
			},
			onFailure: function() { alert('Something went wrong. Please try again.'); }
		});
	}

	if(interval)
		clearInterval(interval);
	return setInterval(setTimer, 1000);
};

var setTimer = function() {
	var time = Element.retrieve('time-lapsed', 'value') + 1;
	Element.store('time-lapsed', 'value', time);

	var h = Math.floor(time / 60);
	h = h<10 ? '0'+h : h;
	h = h>60 ? Math.floor(h/60) + ':' +  h%60 : h; 
	var m = time % 60;
	m = m<10 ? '0'+m : m;

	Element.update('time-lapsed', h+':'+m);
};

var closeModal = function(id) {
	Element.removeClassName('modal-backdrop', 'open');
	Element.removeClassName(id, 'open');
};

var openModal = function(id) {
	Element.addClassName('modal-backdrop', 'open');
	Element.addClassName(id, 'open');
};

var closeAllModals = function() {
	Element.removeClassName('modal-backdrop', 'open');
	$$('.modal').each(function(element) {
		Element.removeClassName(element, 'open');
	});
};

var gameOver = function(interval) {

	// increase total games played count
	var gamesPlayed = Element.retrieve('games-played', 'value') + 1;
	Element.store('games-played', 'value', gamesPlayed);
	Element.update('games-played', gamesPlayed);

	// update the best score
	var bestScore = Element.retrieve('best-score', 'value');
	bestScore = Math.max(bestScore, Element.retrieve('current-score', 'value'));
	Element.store('best-score', 'value', bestScore);
	Element.update('best-score', bestScore);

	clearInterval(interval);
	// show name and email boxes when user id is not found in cookie
	var userid = readCookie('memory-game-userid'),
		name = readCookie('memory-game-name'),
		email = readCookie('memory-game-email');
	if(readCookie('memory-game-userid')) {
		sendToServer(userid, name, email);
	} else {
		openModal('modal');
	}

};

var submitScore = function() {

	if(Element.hasClassName('submit-score', 'disabled')) {
		return;
	}

	Element.up('user-name').removeClassName('error');
	Element.next('user-name').update('');
	Element.up('user-email').removeClassName('error');
	Element.next('user-email').update('');

	var name = Form.Element.getValue('user-name');
	var email = Form.Element.getValue('user-email');
	
	var error = false;
	if(!name || name.strip().length == 0) {
		Element.up('user-name').addClassName('error');
		Element.next('user-name').update('Please enter your name.');
		error = true;
	}
	if(!email || email.strip().length == 0) {
		Element.up('user-email').addClassName('error');
		Element.next('user-email').update('Please enter your email address.');
		error = true;
	}
	if(email && !validateEmail(email.strip())) {
		Element.up('user-email').addClassName('error');
		Element.next('user-email').update('Please enter a valid email address.');
		error = true;
	}
	if(error) {
		return;
	} else {
		Element.addClassName('submit-score', 'disabled');
		sendToServer(0, name.strip(), email.strip());
	}
};

// send the data to server
var sendToServer = function(userid, name, email) {
	var obj = {
		appId: 'memory-game',
		userid: userid,
		user: name,
		email: email,
		score: Element.retrieve('current-score', 'value') || 0,
		moves: Element.retrieve('total-moves', 'value') || 0,
		time: Element.retrieve('time-lapsed', 'value') || 0
	}

	new Ajax.Request('saveScore.php', {
		method: 'post',
		parameters: {obj: JSON.stringify(obj)},
		onSuccess: function(transport) {
			var response = transport.responseText || "no response text";
			console.log("Success! \n\n" + response);
			var response = JSON.parse(response);
			if(response.success) {
				// update "welcome guest"
				Element.update('welcome-user-address', 'Hi');
				Element.update('welcome-user-name', response.name);
				Element.show('not-you');
				// set user id and name in cookie
				createCookie('memory-game-userid', response.userid, 10);
				createCookie('memory-game-name', response.name, 10);
				createCookie('memory-game-email', response.email, 10);
			} else {
				alert('Something went wrong. Please try again.');
			}
			Element.removeClassName('submit-score', 'disabled');
			closeAllModals();
			showScores(obj.score);
		},
		onFailure: function() { 
			alert('Something went wrong. Please try again.');
			Element.removeClassName('submit-score', 'disabled');
		}
	});
};

var showScores = function(currentScore) {
	openModal('modal1');

	new Ajax.Request('getScores.php', {
		method: 'get',
		onSuccess: function(transport) {
			var response = transport.responseText || "no response text";
			console.log("Success! \n\n" + response);
			response = JSON.parse(response);
			Element.update('ranking', ' ');
			if(response.success && response.rows && response.rows.length > 0) {
				var html = '';
				response.rows.map(function(r, i) {
					var isThis = readCookie('memory-game-userid')==r.id;
					if(isThis) {
						Element.update('ranking', (currentScore ? 'You scored '+currentScore+' in this game! ' : '') +
						 'You currently rank '+(i+1)+' in the leaderboard.');
					}
					html += '<tr '+(isThis ? 'class="highlight"' : '')+'>';
					html += '<td>'+(i+1)+'</td>';
					html += '<td>'+r.name+'</td>';
					html += '<td>'+r.email+'</td>';
					html += '<td>'+r.score+'</td>';
					html += '</tr>';
				});
				Element.update('table-body', html);
			} else {
				Element.update('table-body', '<tr><td colspan="4">No scores submitted yet.</td></tr>');
			}
		},
		onFailure: function() { alert('Something went wrong. Please try again.'); }
	});
};

document.observe('dom:loaded', function(){
	
	Element.update('welcome-user-address', readCookie('memory-game-userid') ? 'Hi' : 'Welcome');
	Element.update('welcome-user-name', readCookie('memory-game-userid') ? readCookie('memory-game-name') : 'Guest');
	Element.toggle('not-you', readCookie('memory-game-userid') ? true : false);

	var cardsSequence = getCards();
	var interval;

	Event.on(document, 'click', function(event) {
		var element = event.element();
		if(element.id == 'restart') {
			if(Element.retrieve('pairs-opened', 'value') != no_of_cards) {
				var answer = confirm('Restarting the game will loose your progress. Are you sure you want to restart?');
				if(answer) {
					cardsSequence = getCards();
					interval = resetGame(interval);
				}
			} else {
				cardsSequence = getCards();
				interval = resetGame(interval);
			}
		} if(Element.match(element, '.modal-backdrop')) {
			closeAllModals();
		} if(Element.match(element, '.close') || Element.match(element, '.cancel')) {
			closeModal(Element.up(element, '.modal').id);
		} if(element.id == 'submit-score') {
			submitScore();
		}  if(Element.match(element, '.play-again')) {
			closeModal(Element.up(element, '.modal').id);
			interval = resetGame(interval);
		} if(element.id == 'show-scores') {
			showScores();
		} if(element.id == 'not-you') {
			event.stop();
			eraseCookie('memory-game-userid');
			eraseCookie('memory-game-name');
			eraseCookie('memory-game-email');

			Element.update('welcome-user-address', readCookie('memory-game-userid') ? 'Hi' : 'Welcome');
			Element.update('welcome-user-name', readCookie('memory-game-userid') ? readCookie('memory-game-name') : 'Guest');
			Element.toggle('not-you', readCookie('memory-game-userid') ? true : false);
			interval = resetGame(interval);
		} else {
			//event.stop();
		}
	});

	Event.on(document, 'keydown', function(event) {
		if(Element.hasClassName('modal', 'open')) {
			return;
		}
		var currentCard = Selector.findElement($$('#game-board .card'), '.selected');
		var currentIndex = currentCard.previousSiblings().size();

		var noOfCards = no_of_cards || 8;
		var halfWayIndex = noOfCards/2; // 4 in the case of 8 cards
		var lastIndex = noOfCards*2-1; // 15 in the case of 8 cards
		switch (event.keyCode) {
	        case Event.KEY_LEFT:
	            event.stop(); // prevent the default action, like horizontal scroll
	            if(currentIndex != 0) {
					currentCard.removeClassName('selected');
		            currentCard.previous().addClassName('selected');
	            }
	            break;
	        case Event.KEY_RIGHT:
	            event.stop();
	            if(currentIndex != lastIndex) {
					currentCard.removeClassName('selected');
		            currentCard.next().addClassName('selected');
	            }
	            break;
	        case Event.KEY_DOWN:
	            event.stop();
	            if(currentIndex+halfWayIndex <= lastIndex) {
					currentCard.removeClassName('selected');
		            currentCard.next(halfWayIndex-1).addClassName('selected');
	            }
	            break;
	        case Event.KEY_UP:
	            event.stop();
	            if(currentIndex-halfWayIndex >= 0) {
					currentCard.removeClassName('selected');
		            currentCard.previous(halfWayIndex-1).addClassName('selected');
	            }
	            break;
	        case Event.KEY_RETURN:
	        	event.stop();
	        	var openedCard = Selector.findElement($$('#game-board .card'), '.open');
	        	if(currentCard.hasClassName('closed')) {
	        		// do nothing
	        	}
	        	else if(!openedCard) { // no other card is open
	        		currentCard.addClassName('open');
	        		Element.setStyle(currentCard, {'background-image': 'url("img/colour'+cardsSequence[currentIndex]+'.gif")'});
	        	} else if (openedCard == currentCard) { // this card is open
	        		openedCard.removeClassName('open');
	        	} else { // one other cell is open
	        		currentCard.addClassName('open');
	        		Element.setStyle(currentCard, {'background-image': 'url("img/colour'+cardsSequence[currentIndex]+'.gif")'});

	        		// increase total moves
	        		var totalMoves = Element.retrieve('total-moves', 'value') + 1;
        			Element.store('total-moves', 'value', totalMoves);
        			Element.update('total-moves', totalMoves);

	        		// add more logic
	        		setTimeout(function() { // delay because we want to show the user the pair matching
	        			var openedColor = Element.getStyle(openedCard, 'background-image');
		        		var currentColor = Element.getStyle(currentCard, 'background-image');
		        		if(openedColor == currentColor) {

		        			// increase current score
		        			var currentScore = Element.retrieve('current-score', 'value') + 1;
		        			Element.store('current-score', 'value', currentScore);
		        			Element.update('current-score', currentScore);

		        			// increase pairs opened
			        		var pairsOpened = Element.retrieve('pairs-opened', 'value') + 1;
		        			Element.store('pairs-opened', 'value', pairsOpened);
		        			Element.update('pairs-opened', pairsOpened);

		        			openedCard.removeClassName('open');
		        			currentCard.removeClassName('open');
		        			openedCard.addClassName('closed');
		        			currentCard.addClassName('closed');
		        			Element.setStyle(openedCard, {'background-image': 'none'});
		        			Element.setStyle(currentCard, {'background-image': 'none'});

		        			if(pairsOpened == no_of_cards) {
		        				gameOver(interval);
		        			}

		        		} else {

		        			// decrease current score
		        			var currentScore = Element.retrieve('current-score', 'value') - 1;
		        			Element.store('current-score', 'value', currentScore);
		        			Element.update('current-score', currentScore);

		        			openedCard.removeClassName('open');
		        			currentCard.removeClassName('open');
		        			Element.setStyle(openedCard, {'background-image': 'url("img/card_bg.gif")'});
		        			Element.setStyle(currentCard, {'background-image': 'url("img/card_bg.gif")'});
		        		}
	        		}, 250);
	        		
	        	}
	        	break;
	    }
	});

	interval = resetGame(interval);
});