// Functions to help write more functional style

/** 
 * Simple «partial» function implemention.
 * Takes a function and array of arguments to apply
 */
function partial(fn, args) {
  return function(_args){
    return fn.apply(null, args.concat(_args))
  }
}

/**
 * Simple «compose» function implementation
 */
function compose(fn_a, fn_b) {
  return function() {
    return fn_a(fn_b.apply(null, arguments))
  }
}

/** 
 * Function «addpx» takes two number args and return
 * sum of this args as pixel value
 */
function addpx(before, plus) {
	return (parseInt(before ? before : 0) + parseInt(plus)) + "px"
}


/** 
 * Function «xBorders» takes element and returns position
 * of its on x-axis (left and right border) relative to 
 * parent element
 */
function xBorders (el) {
  return {"left": el.offsetLeft, 
          "right": el.offsetLeft + el.offsetWidth}
}

/** 
 * Function «newTarget» creates a div element with
 * class ‹target›, inserts it on the stage, makes
 * it move, and removes after certain amount of time
 */
function newTarget () {
  var target = document.createElement("div");
  target.classList.add("target");
  ndStage.insertBefore(target);
  setTimeout(function(){
    target.style.right = "800px";
  }, 10)
  setTimeout(function(){
    target.remove()
  }, 3000)
}

var trolley = document.getElementById("trolley");
var body = document.getElementById("gameplay");
var ndStage = document.getElementById("nd-stage");

var gameState = {}
gameState.canShoot = true;

function elMove (el, move){
  el.style.left = addpx(el.style.left, move);
}

var trolleyMove = partial(elMove, [trolley]); 

function trolleyMoveLeft (trolley) { 
  var stageLeft = xBorders(ndStage).left;
  if (parseInt(trolley.style.left) >= 20) { 
    trolleyMove(-20); 
  }
}

function trolleyMoveRight (trolley) {
  var stageBorders = xBorders(ndStage);
  var stageLeft = stageBorders.left;
  var stageRight = stageBorders.right;
  trolley.style.left ? 0 : trolley.style.left = 0;
  if (parseInt(trolley.style.left)+stageLeft<stageRight-trolley.offsetWidth-10) {
  	trolleyMove(20);
  }
}

(function(trolley){ 
  var keysMap = [];

  function keysListener (e) {
  	var e = e || event;
    var key = e.keyCode || e.which;
    var type = type;
    keysMap[key] = e.type == 'keydown';
  }

  setInterval(function(){
    if (keysMap[32] && keysMap[37]) {
    	checkAndShoot();
    	trolleyMoveLeft(trolley);
    }
    else if (keysMap[32] && keysMap[39]) {
    	checkAndShoot();
    	trolleyMoveRight(trolley);
    }
    else if (keysMap[37]) {
    	trolleyMoveLeft(trolley);
    }
    else if (keysMap[39]) {
    	trolleyMoveRight(trolley);
    }  
    else if (keysMap[32]) {
      checkAndShoot();
    }
  }, 80)

  body.addEventListener("keydown", keysListener);
  body.addEventListener("keyup", keysListener);
})(trolley);



setInterval(newTarget, 700);

function shootBullet () {
  var bullet = document.createElement("div");
  var killed;
  bullet.classList.add("bullet");
  ndStage.insertBefore(bullet);
  bullet.style.left = addpx(trolley.style.left, 20);
  setTimeout(function(){
    bullet.style.top = "400px";
  }, 1)
  setTimeout(function(){
    killed = killTarget(bullet.style.left);
    if (killed) {
      bullet.classList.add("explode");
    } else {
      bullet.classList.add("too-far");
      bullet.style.top = "500px";
    }
    setTimeout(function(){bullet.remove()},300);
  }, 510)
}

/**
 * Function negates state of player’s ability to shoot.
 * Useful to create delay between shoots
 */
function turnShoot (){
  gameState.canShoot = !gameState.canShoot;
}

/**
 * Function checks if player is able to shoot,
 * shoots if is, and creates delay before next shoot
 */
function checkAndShoot () {
  if (gameState.canShoot){
    shootBullet();
    turnShoot();
    setTimeout(turnShoot, 200);
  }
}


/**
 * Function checks if any target was hitted.
 * If was, adds class ‹killed› to it, and returns true
 */
function killTarget (bulletX) {
  var targets = Array.prototype
                .slice.call(document.getElementsByClassName("target"));
  bulletX = parseInt(bulletX);
  var killed = false;
  targets.forEach(function(target, idx, arr){
    var targetLeft = target.offsetLeft;
    if (bulletX >= targetLeft - 10
      && bulletX <= targetLeft + 50) {
      target.classList.add("killed");
      killed = true;
    }
  })
  return killed
}














