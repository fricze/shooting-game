(function(){

  // Few functions to help write more functional style

  /** 
   * Simple «partial» function implemention.
   * Takes a function and array of arguments to apply
   */
  var partial = function (fn, args) {
    return function(_args){
      return fn.apply(null, args.concat(_args))
    }
  }

  var reverse = function (arr) {
    return Array.prototype.reverse.call(arr)
  } 

  var slice = function (arr) {
    return Array.prototype.slice.call(arr)
  }

  var reverseFunction = function (fn) {
    return function() {
      _args = reverse(slice(arguments))
      return fn.apply(null, _args)
    }
  }

  /**
   * would be lovely to write reversePartial
   * as «partial» and «reverseFunction» composition,
   * but it may require some rewriting of those above
   */
  var reversePartial = function (fn, args) {
    return function(_args){
      return fn.apply(null, reverse(args.concat(_args)))
    }
  }

  /**
   * Simple «compose» function implementation
   */
  var compose = function (fn_a, fn_b) {
    return function() {
      return fn_a(fn_b.apply(null, arguments))
    }
  }

  var parse10 = reversePartial(parseInt, [10])

  /** 
   * Function «addpx» takes two number args and return
   * sum of this args as pixel value
   */
  var addpx = function (before, plus) {
    return (parse10(before ? before : 0) + parse10(plus)) + "px"
  }


  /** 
   * Function «xBorders» takes element and returns position
   * of its on x-axis (left and right border) relative to 
   * parent element
   */
  var xBorders = function (el) {
    return {"left": el.offsetLeft, 
            "right": el.offsetLeft + el.offsetWidth}
  }

  /**
   */

  var createElementWithClass = function (name, _class) {
    var el = document.createElement(name);
    el.classList.add(_class);
    return el
  }


  /** 
   * Function «newTarget» creates a div element with
   * class ‹target›, inserts it on the stage, makes
   * it move, and removes after certain amount of time
   */
  var newTarget = function () {
    var target = createElementWithClass("div","target");
    ndStage.insertBefore(target);
    setTimeout(function(){
      target.style.right = "800px";
    }, 10)
    setTimeout(function(){
      target.remove()
    }, 3000)
  }

  var ndStage = document.getElementById("nd-stage");

  var gameState = {}
  gameState.canShoot = true;



  (function(trolley, body){ 
    var keysMap = [];

    var keysListener = function (e) {
      var e = e || event;
      var key = e.keyCode || e.which;
      var type = type;
      keysMap[key] = e.type == 'keydown';
    }
    
    var elMove = function (el, move){
      el.style.left = addpx(el.style.left, move);
    }

    var trolleyMove = partial(elMove, [trolley]); 

    var trolleyMoveLeft = function (trolley) { 
      var stageLeft = xBorders(ndStage).left;
      if (parse10(trolley.style.left) >= 20) { 
        trolleyMove(-20); 
      }
    }

    var trolleyMoveRight = function (trolley) {
      var stageBorders = xBorders(ndStage);
      var stageLeft = stageBorders.left;
      var stageRight = stageBorders.right;
      trolley.style.left ? 0 : trolley.style.left = 0;
      if (parse10(trolley.style.left)+stageLeft<stageRight-trolley.offsetWidth-10) {
        trolleyMove(20);
      }
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
  })(document.getElementById("trolley"),
     document.getElementById("gameplay"));


  setInterval(newTarget, 700);

  var shootBullet = function () {
    var bullet = createElementWithClass("div", "bullet");
    var killed;
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
  var turnShoot = function (){
    gameState.canShoot = !gameState.canShoot;
  }

  /**
   * Function checks if player is able to shoot,
   * shoots if is, and creates delay before next shoot
   */
  var checkAndShoot = function () {
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
  var killTarget = function (bulletX) {
    var targets = slice(document.getElementsByClassName("target"));
    bulletX = parse10(bulletX);
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
})()











