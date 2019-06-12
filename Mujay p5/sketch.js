let scoreboard = { }
let cir = document.getElementById("cir")
let x
let y
let a
let b
let c 
let d 
let direction_horiz
let direction_vert
let direction_horiz2
let direction_vert2
let direction
let score
let num
let level
let time
let database = firebase.database()

<script>
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDg-zwUq6QF_uiLf-0nGtCED7PwhWCOqq0",
    authDomain: "mujay-p5-game.firebaseapp.com",
    databaseURL: "https://mujay-p5-game.firebaseio.com",
    projectId: "mujay-p5-game",
    storageBucket: "mujay-p5-game.appspot.com",
    messagingSenderId: "327021422583",
    appId: "1:327021422583:web:76a1f3f4f8ea78b2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
</script>


function setup() {
  createCanvas(windowWidth, windowHeight);
  //alert(width)
  s = width/ 1331
  
  x = 500
  y = 780
  
  a = [ 400, 430, 670, 500 ]
  b = [ 420, 680, 350, 730 ]
  
  c = 500
  d = 500 
  
  
  direction_horiz=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  direction_vert=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  direction_horiz2=1
  direction_vert2=1
  direction=1
  
  score=100
  num=4
  level=1
  time=180
  
}


function draw() {
  if (time >  0 ) {
    background(192, 192, 192);
    textSize(35)
    text("Score: " +score, 10, 30)
    text("Time: " +time.toFixed(2), 220, 30)
  
    time = time-0.025
  
    fill(0, 0, 240);
    circle(x*s, y, 50*s);
    if(keyIsDown(LEFT_ARROW)) {
      x = x - 15
    }
    if(keyIsDown(RIGHT_ARROW)) {
      x = x + 15
    }
    if(keyIsDown(DOWN_ARROW)) {
      y = y + 15
    }
    if(keyIsDown(UP_ARROW)) {
      y = y - 15
    }
  
  
    for (i=0; i<num; i=i+1) {
      fill(200, 0, 0)
      circle(a[i]*s, b[i], 20*s);
      if(a[i]*s > width || a[i]*s < 0) {
        direction_horiz[i] =   direction_horiz[i]*-1
      }
      if(b[i] > height || b[i] < 0) {
        direction_vert[i] = direction_vert[i]*-1
      }
      a[i]= a[i]+15*direction_horiz[i]
      b[i]= b[i]+15*direction_vert[i]

      if (dist(x*s, y, a[i]*s, b[i]) < 50 + 20) {
        score = score - 1
      }
    }
      
      fill(0, 200, 0);
      circle(c*s, d, 40*s )
      if (c*s > width || c*s < 0) {
      direction_horiz2 = direction_horiz2*-1
      }
      if (d > height || d < 0) {
        direction_vert2 = direction_vert2*-1
      }
      c= c+10*direction_horiz2
      d= d+10*direction_vert2
      if (dist(x*s, y, c*s, d) < 50 + 40) {
        score = score + 4
      }
  
  
      if(score > 200 && level == 1) {
        num = num + 1
        level = 2
        a.push.apply(a, [350])
        b.push.apply(b, [500])
      }
      if(score > 350 && level == 2) {
        num = num + 1 
        level = 3
        a.push.apply(a,[400])
        b.push.apply(b, [500])
      } 
      if(score > 500 && level == 3) {
        num = num + 1
        level = 4
        a.push.apply(a, [360])
        b.push.apply(b, [620])
      }
      if(score > 670 && level == 4) {
        num = num + 1
        level = 5
        a.push.apply(a, [370])
        b.push.apply(b, [640])
      }
      if(score > 740 && level == 5) {
        num = num + 4
        level = 6
        a.push.apply(a, [400, 450, 700, 270])
        b.push.apply(b, [620, 660, 800, 600])
      }
      

   }
    
    else {
    cir.innerHTML = "Name? <input id='nam'><button onclick='restart()'>Restart</button>"
	onclick=generate_alltime_leaderboard()
    noLoop()
    }
}

function restart() {
  let nam = document.getElementById("nam")
  name = nam.value
  if (name !="") {
    scoreboard[name] = score
  }
  database.ref(name).set(score)
  alert(JSON.stringify(scoreboard, null, 1))
  time = 180
  score = 100
  num = 4
  level = 1
  x = 500
  y = 700 
  loop()
  cir.innerHTML = ""
  generate_leaderboard()
}

function generate_leaderboard() {
  scores = Object.values(scoreboard)
  names = Object.keys(scoreboard)
  
  if (scores.length >= 3) {
    let leaderboard = { 
    }
    for (i=0; i<3; i=i+1) {
      max = Math.max(...scores)
      index = scores.indexOf(max)
      leaderboard[names[index]] = max
      names.splice(index,1)
      scores.splice(index,1)
    }
    alert("Leaderboard: " + JSON.stringify(leaderboard,null,1))
  }
}
function generate_alltime_leaderboard() {
	let alltime_leaderboard = { }
	database.ref().orderByValue().limitToLast(3).on("value", function(snapshot) {
		snapshot.forEach(function(data) {
		alltime_leaderboard[data.key] = data.val()
		});
    	});
	if (Object.values(alltime_leaderboard).length > 0) {
	  alert("All-time leaderboard: " + JSON.stringify(alltime_leaderboard,null,1))
    	}
}

generate_alltime_leaderboard()


