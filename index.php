<html>
<head>
	<title>Colour Memory</title>
	<link rel="stylesheet" type="text/css" href="css/reset.css">
	<link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<?php
	$no_of_cards = 8;
?>
<body>
	
	<div class="main">
		<span class="welcome-span">
			<span id="welcome-user-address"></span> <span id="welcome-user-name"></span>! 
			<a href="#" id="not-you">Not you?</a>
		</span>
		<div id="game-board" class="board left">
			<?php for ($i = 1; $i <= $no_of_cards*2; $i++) {?>
				<div class="card card-<?php echo $i?> <?php if($i==1) { echo 'selected'; }?>"></div>
			<?php } ?>
		</div>
		<div class="options right">
			<div class="logo">
				<img src="img/logo.png"/>
			</div>
			<div class="game-info">
				<div>
					To play the game, use the navigation keys to move left, right, bottom or up. 
					To open a card press "Enter" key.</div>
				<hr/>
				<strong>Current Game</strong>
				<ul>
					<li>Current Score: <span id="current-score">0</span></li>
					<li>Total Moves: <span id="total-moves">0</span></li>
					<li>Pairs Opened: <span id="pairs-opened">0</span></li>
					<li>Time Lapsed: <span id="time-lapsed">00:00</span></li>
				</ul>
				<hr/>
				<strong>Previous Games</strong>
				<ul>
					<li>Games Played: <span id="games-played">0</span></li>
					<li>Best Score: <span id="best-score">0</span></li>
				</ul>
			</div>
			<button class="primary restart" id="restart">Restart Game</button>
			<button class="default show-scores" id="show-scores">Show Scores</button>
		</div>
		<div class="clearfix"></div>
	</div>

	<div style="display: none">
		<?php for ($i = 1; $i <= $no_of_cards; $i++) {?>
			<img src="img/colour<?php echo $i?>.gif"/>
		<?php } ?>
	</div>

	<div class="modal" id="modal">
		<div class="modal-head">
			Congratulations!
			<button class="close">&times;</button>
		</div>
		<div class="modal-body">
			<p>Great job! You have found all card pairs. Your final score is <span id="final-score"></span>.</p>
			<p>Please enter your name and email address to compare your ranking with other users.</p>
			<br/>
			<form id="save-form" action="save.php" method="POST">
				<div class="label"><input type="text" name="user-name" id="user-name" value="" placeholder="Your Name"/><p class="help"></p></div>
				<div class="label"><input type="text" name="user-email" id="user-email" value="" placeholder="Your Email"/><p class="help"></p></div>
			</form>
		</div>
		<div class="modal-foot">
			<button class="primary submit" id="submit-score">Submit</button>
			<button class="default cancel">Cancel</button>
			<button class="default right play-again">Skip, play again</button>
		</div>
	</div>

	<div class="modal" id="modal1">
		<div class="modal-head">
			Leaderboard
			<button class="close">&times;</button>
		</div>
		<div class="modal-body">
			<p id="ranking">&nbsp;</p>
			<table>
				<thead>
					<tr><th>Rank</th><th>Name</th><th>Email</th><th>Score</th></tr>
				</thead>
				<tbody id="table-body">
					
				</tbody>
			</table>
		</div>
		<div class="modal-foot">
			<!-- <button class="primary play-again">Play again</button> -->
			<button class="default cancel">Close</button>
		</div>
	</div>
	<div class="modal-backdrop" id="modal-backdrop"></div>

	<script type="text/javascript" src="js/prototype.js"></script>
	<script type="text/javascript" src="js/utils.js"></script>
	<script type="text/javascript" src="js/script.js"></script>
	<script> var no_of_cards = <?php echo $no_of_cards; ?></script>
</body>
</html>