window.setup = setup;
window.draw = draw;
//sets all constant variables, these variables will remain the same no matter what
// TEST - Force a push
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { fb_write, fb_read, fb_initialise } from '../script.mjs';
var fb_gamedb;
var userID;
var currentUser;
var result;
var HighScore;
var uid = null;
const GAMEWIDTH = 1000;
const GAMEHEIGHT = 600;
const PLAYERWIDTH = 50;
const PLAYERHEIGHT = 100;
const BUTTONWIDTH = 400;
const BUTTONHEIGHT = 150;
//sets all non constant variables, these variables will change throughout the code
let reset;
let instructions;
let ball;
let asteroid;
let Scoregroup;
let asteroidGroup;
let wall1;
let wall2;
let floor;
let player;
let Instructions;
let cnv;
let time = 0;
let Score = 0;
let Highscore = 0;
let stopgame = true;
fb_initialise()

function updateHighScore(_highScore) {
    if (uid != null) {
        var filePath = "userPublicInformation/" + uid + "/highscore";
        fb_write(filePath, _highScore);
    }
}
function readHighScore() {
    if (uid != null) {
        var filePath = "userPublicInformation/" + uid + "/coinGameHighScore";
        return fb_read(filePath);
    }
}

const AUTH = getAuth();
onAuthStateChanged(AUTH, (user) => {
    if (user) {
        console.log("User doesn't need to sign in");
        uid = user.uid;
        console.log(uid);
        readHighScore().then((DBHighScore) => {
            console.log("The high score is:");
            HighScore = DBHighScore;
            console.log(HighScore);
        });
    } else {
        console.log("User needs to sign in");
    }
}, (error) => {
    console.log("Authorisation state detection error");
    console.log(error);
});
function setup() {
       
	console.log("setup: ");
	//Sets canvas
	cnv = new Canvas(GAMEWIDTH, GAMEHEIGHT);
	//Sets world gravity
	world.gravity.y = 10;
	//These are sprites that will be removed when the game starts, so they are seperated from the rest.
	reset = new Sprite (GAMEWIDTH/2, GAMEHEIGHT/3, BUTTONWIDTH, BUTTONHEIGHT, 'k')
	Instructions = new Sprite (GAMEWIDTH/2., GAMEHEIGHT/1.5, BUTTONWIDTH*2, BUTTONHEIGHT/2, 'k')
	//These sprites are the sprites that will never be removed
	player = new Sprite(GAMEWIDTH/2, GAMEHEIGHT, PLAYERWIDTH, PLAYERHEIGHT, 'd');
	floor = new Sprite(GAMEWIDTH/2, GAMEHEIGHT, 1600, 50, 'k');
    wall1 = new Sprite(GAMEWIDTH+25, GAMEHEIGHT/2, 50, 1500, 'k');
	wall2 = new Sprite(-25, GAMEHEIGHT/2, 50, 1500, 'k');
	//sets the groups
	asteroidGroup = new Group();
	Scoregroup = new Group();
}
//function for making asteroids, using a parameter for the asteroids radius.
function MakeAsteroid(_asteroidradius) {
	//Makes the asteroid sprite
	asteroid = new Sprite(random(0, 1000), -50, (_asteroidradius), 'd');
	//Sets the asteroids colour
	asteroid.color = 'Gray';
	//Sets they asteroids velocity both X and Y
	asteroid.vel.x = (random(-10, 10));
	asteroid.vel.y = (random(0, 10));
	//Adds astroids to the asteroid group so I can modify all of them at once
	asteroidGroup.add(asteroid);
}
//Function for making balls after game ends, putting your score into better perspective.
function MakeBalls() {
	//Makes the ball sprite
	ball = new Sprite(random(0, 1000), -50, 50, 'd');
	//Sets the ball colour
	ball.color = 'Gray';
	//Adds ball to group so they can all be modified at once
	Scoregroup.add(ball);
}
//function for when the asteroids hit the floor
function AsteroidHitFloor(asteroid, floor) {
	//removes the asteroid that hits the floor
	asteroid.remove();
	//adds 1 to the score, the scoring system is based off how many asteroids hit the ground
	Score++;
}
//Function for when the game ends
function Gameover() {
	//Creates the same reset sprite and Instructions sprite from the setup function.
	reset = new Sprite (GAMEWIDTH/2, GAMEHEIGHT/3, BUTTONWIDTH, BUTTONHEIGHT, 'k')
	Instructions = new Sprite (GAMEWIDTH/2., GAMEHEIGHT/1.5, BUTTONWIDTH*2, BUTTONHEIGHT/2, 'k')
	//Makes stopgame true, stopping timer for asteroid spawn, making the mouse visible, and making the player unable to move
	stopgame = true;
	//Deletes all remaining asteroids
	asteroidGroup.removeAll();
	//Removes any remaining velocity from the player
	player.vel.x = (0);
	player.vel.y = (0);
	//Makes a ball for every score point
	for (i = 0; i < Score; i++) {
    	MakeBalls();
	}
}
function draw() {
	//sets the color for all sprites
	player.color = 'White';
	reset.color = 'White';
	floor.color = 'Gray';
	Instructions.color = 'White';
	background('Black'); 
	//all of the text code, starting with text size then the text on sprites then the score and highscore text which is independent from any sprite
	reset.textSize = 40;
	Instructions.textSize = 20;
	reset.text = "Start";	
	Instructions.text = "A to move left, D to move right, dodge the asteroids!";
	textSize(32);
	fill(255, 255, 255);
	text('Score: '+Score, GAMEWIDTH/10, GAMEHEIGHT/6);
	text('Highscore: '+Highscore, GAMEWIDTH/10, GAMEHEIGHT/3);	
	//calls the corresponding function when an asteroid collides with something
	asteroidGroup.collides(floor, AsteroidHitFloor);
	asteroidGroup.collides(wall1, AsteroidHitFloor);
	asteroidGroup.collides(wall2, AsteroidHitFloor);
	asteroidGroup.collides(player, Gameover)
	//makes mouse visible if the game is stopped and invisible if the game isnt stopped
	if (stopgame == true) {
		mouse.visible = true;
	} else {
		mouse.visible = false;
	}
	//If statement for start button
	if (mouse.pressing() && reset.mouse.hovering()) {
		//starts the game again
		stopgame = false;
		//removes reset button, instructions button, and all balls added to represent your score
		reset.remove();
		Instructions.remove();
		Scoregroup.removeAll();
		//resets your time and score
		time = 0;
		Score = 0;
        fb_initialise();
	}
	//adds a timer that goes up
	time++;
	//if statement for when asteroids should be made based off of the stopgame variable and the timer
	if (time == 10 && stopgame == false) {
		MakeAsteroid((random(30, 100)));
		//resets time when asteroid spawns so timer can reach the correct number for a new asteroid to spawn 
		time = 0;			
	}
	//sets the score as the highscore when the score is higher then the highscore
	if (Score >= Highscore) {
		Highscore = Score;
	}
	//all controls for the player, when the A or left keys are pressed the player moves left, when the D or right key is pressed the player moves right
	if (kb.pressing('left') && stopgame == false) {
    	player.vel.x = -8;
		player.rotationSpeed = 0;
	}
	if (kb.released('left')) {
    	player.vel.x = 0;
		player.rotationSpeed = 0;
	}
	if (kb.pressing('right') && stopgame == false) {
    	player.vel.x = 8;
		player.rotationSpeed = 0;
	}
	if (kb.released('right')) {
    	player.vel.x = 0;
		player.rotationSpeed = 0;
	}
}