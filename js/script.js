var getCards = function() {
	var cards = [];
	for(var i=1; i<=8; i++) {
		cards.push(i);
		cards.push(i);
	}
	//shuffle
	cards.sort(function() {return 0.5 - Math.random()});
	return cards;
};

var resetGame = function() {
	$$('#game-board .card').each(function(element) {
		element.removeClassName('open');
		element.removeClassName('closed');
		element.removeClassName('selected');
		Element.setStyle(element, {'background-image': 'url("img/card_bg.gif")'});
	});
	$$('#game-board .card')[0].addClassName('selected');

	// TODO get these values from server
	Element.store('current-score', 'value', 0);
	Element.store('total-moves', 'value', 0);
	Element.store('pairs-opened', 'value', 0);
	Element.store('time-lapsed', 'value', 0);
	Element.store('games-played', 'value', Element.retrieve('games-played', 'value') || 0);
	Element.store('best-score', 'value', Element.retrieve('best-score', 'value') || 0);

	Element.update('current-score', 0);
	Element.update('total-moves', 0);
	Element.update('total-moves', 0);
	Element.update('pairs-opened', 0);
	Element.update('time-lapsed', '00:00');

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

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

var closeModal = function() {
	Element.removeClassName('modal-backdrop', 'open');
	Element.removeClassName('modal', 'open');
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

	// TODO open modal to ask for user's name and email
	// TODO save user details and score
	// TODO retrieve leaderboard rankings

	Element.addClassName('modal-backdrop', 'open');
	Element.addClassName('modal', 'open');
	clearInterval(interval);
};

var submitScore = function() {
	Element.up('user-name').removeClassName('error');
	Element.next('user-name').update('');
	Element.up('user-email').removeClassName('error');
	Element.next('user-email').update('');

	var name = Form.Element.getValue('user-name');
	var email = Form.Element.getValue('user-email');
	console.log("name", name, "email", email);
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
		// send the data to server
		
		var obj = {
			appId: 'memory-game',
			userid: 0,
			user: name.strip(),
			email: email.strip(),
			score: Element.retrieve('current-score', 'value') || 0,
			moves: Element.retrieve('total-moves', 'value') || 0,
			time: Element.retrieve('time-lapsed', 'value') || 0
		}

		console.log(obj);

		new Ajax.Request('saveScore.php', {
			method: 'post',
			parameters: {obj: JSON.stringify(obj)},
			onSuccess: function(transport) {
				var response = transport.responseText || "no response text";
				alert("Success! \n\n" + response);
			},
			onFailure: function() { alert('Something went wrong...'); }
		});
	}
};

document.observe('dom:loaded', function(){
	
	var cardsSequence = getCards();
	var interval;

	Event.on(document, 'click', function(event) {
		var element = event.element();
		if(Element.match(element, 'button.restart')) {
			var answer = confirm('Restarting the game will loose your progress. Are you sure you want to restart?');
			if(answer) {
				cardsSequence = getCards();
				interval = resetGame();
			}
		} if(Element.match(element, '.modal-backdrop') || Element.match(element, '.close') || Element.match(element, '.cancel')) {
			closeModal();
		} if(Element.match(element, '.submit')) {
			submitScore();
		} else {
			event.stop();
		}
	});

	Event.on(document, 'keydown', function(event) {
		if(Element.hasClassName('modal', 'open')) {
			return;
		}
		var currentCard = Selector.findElement($$('#game-board .card'), '.selected');
		var currentIndex = currentCard.previousSiblings().size();
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
	            if(currentIndex != 15) {
					currentCard.removeClassName('selected');
		            currentCard.next().addClassName('selected');
	            }
	            break;
	        case Event.KEY_DOWN:
	            event.stop();
	            if(currentIndex+4 <= 15) {
					currentCard.removeClassName('selected');
		            currentCard.next(3).addClassName('selected');
	            }
	            break;
	        case Event.KEY_UP:
	            event.stop();
	            if(currentIndex-4 >= 0) {
					currentCard.removeClassName('selected');
		            currentCard.previous(3).addClassName('selected');
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

		        			if(pairsOpened == 8) {
		        				gameOver(interval);

			        			/*var again = confirm("Game Over! Your final score is "+currentScore+'. Play again?');
		        				if(again) {
		        					interval = resetGame();
		        				}*/
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

	resetGame();

	gameOver(interval);

});