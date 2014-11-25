<html>
<head>
	<title>Colour Memory</title>
	<link rel="stylesheet" type="text/css" href="css/reset.css">
	<link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<?php
$mysqli = mysqli_connect("localhost", "root", "", "colour_memory");
if (mysqli_connect_errno($mysqli)) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
?>
<?php
	$user = 'Guest';
	$userid = 0;
?>
<?php
$res = $mysqli->query("SELECT id, name, email FROM player");
$row = $res->fetch_assoc();

printf("id = %s (%s)\n", $row['id'], gettype($row['id']));
printf("label = %s (%s)\n", $row['name'], gettype($row['name']));
printf("label = %s (%s)\n", $row['email'], gettype($row['email']));
?>
<body>
	
	<div class="main">
		<div id="game-board" class="board left">
			<div class="card card-1 selected"></div>
			<div class="card card-2"></div>
			<div class="card card-3"></div>
			<div class="card card-4"></div>
			<div class="card card-5"></div>
			<div class="card card-6"></div>
			<div class="card card-7"></div>
			<div class="card card-8"></div>
			<div class="card card-9"></div>
			<div class="card card-10"></div>
			<div class="card card-11"></div>
			<div class="card card-12"></div>
			<div class="card card-13"></div>
			<div class="card card-14"></div>
			<div class="card card-15"></div>
			<div class="card card-16"></div>
		</div>
		<div class="options right">
			<div class="logo">
				<img src="img/logo.png"/>
			</div>
			<div class="game-info">
				<div><?php if ($userid == 0): ?>Welcome<?php else: ?>Hi<?php endif ?> 
					<?php echo $user ?>! To play the game, use the navigation keys to move left, right, bottom or up. 
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
			<button class="primary restart">Restart Game</button>
		</div>
		<div class="clearfix"></div>
	</div>

	<div style="display: none">
		<img src="img/colour1.gif"/>
		<img src="img/colour2.gif"/>
		<img src="img/colour3.gif"/>
		<img src="img/colour4.gif"/>
		<img src="img/colour5.gif"/>
		<img src="img/colour6.gif"/>
		<img src="img/colour7.gif"/>
		<img src="img/colour8.gif"/>
	</div>

	<div class="modal" id="modal">
		<div class="modal-head">
			Congratulations!
			<button class="close">&times;</button>
		</div>
		<div class="modal-body">
			<p>Great job! You have found all card pairs. Your final score is 3.</p>
			<p>Please enter your name and email address to compare your ranking with other users.</p>
			<br/>
			<form id="save-form" action="save.php" method="POST">
				<div class="label"><input type="text" name="user-name" id="user-name" value="" placeholder="Your Name"/><p class="help"></p></div>
				<div class="label"><input type="text" name="user-email" id="user-email" value="" placeholder="Your Email"/><p class="help"></p></div>
			</form>
		</div>
		<div class="modal-foot">
			<button class="primary submit">Submit</button>
			<button class="default cancel">Cancel</button>
		</div>
	</div>
	<div class="modal-backdrop" id="modal-backdrop"></div>

	<script type="text/javascript" src="js/prototype.js"></script>
	<script type="text/javascript" src="js/script.js"></script>
<body>
</html>