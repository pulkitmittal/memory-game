# Colour Memory

The goal of this work sample is to construct a game called "Colour Memory". The game board consists of a 4x4 grid, all in all 16 slots. All slots consists of cards face-down. The player is to flip two of these upwards each round, trying to find equals. If the two cards are equal, the player receives one point, and the cards are removed from the game board. Otherwise, the player loses one point and the cards are turned face-down again. This continues until all pairs have been found.

## Technologies used

This game is developed in Prototype.js, PHP and MySQL. It also uses SASS based CSS, so you would need Ruby on your machine.

## Prerequisites

1. Apache Server (Download: http://httpd.apache.org/docs/2.4/install.html)
2. PHP 5.2 (Download: http://php.net/manual/en/install.php)
3. MySQL 5.6 server and client (Download: http://dev.mysql.com/downloads/installer/)
4. Ruby (Download: http://sass-lang.com/install)

## Installation Instructions

1. Download the package https://github.com/pulkitmittal/memory-game.
2. Extract it and place it in the webapps folder in your PHP installation directory.
3. Run the SQLs in the `script.sql` on your MySQL client.
4. Go to command line of Ruby and install sass: `gem install sass`.
5. After installing the gem, go to app/css directory on Ruby command line and run `sass --sourcemap=none --no-cache style.sass style.css`.
6. Open connect.php and make sure the MySQL connection parameters are correct.
7. Start Apache, PHP, MySQL servers.
8. Open http://localhost:8080/app/index.php on your browser.