var backgroundImage, Background, ground;
var player, playerImage, gamoveSound, vhJump;
var chaser1, chaser1Img, chaser2, chaser2Img;
var obstacle1, obstacle1Img, obstacle2Img, obstacle3Img;
var flyer, flyerImg, flyerGroup, gamoveImg, resetImg, reset;
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var score = 0;

function preload() {
  backgroundImage = loadImage("download (4).png");
  playerImage = loadImage("download (1).png");
  chaser1Img = loadImage("download (2).png");
  chaser2Img = loadImage("download (3).png");
  obstacle1Img = loadImage("download (5).png");
  obstacle2Img = loadImage("download (6).png");
  obstacle3Img = loadImage("download (7).png");
  flyerImg = loadImage("download.png");
  gamoveImg = loadImage("gameOver.png");
  resetImg = loadImage("restart.png");
  vhJump = loadSound("jump.wav");
  gamoveSound = loadSound("collided.wav");
}

function setup() {
  createCanvas(800, 400);
  
  Background = createSprite(200, 200, 10, 10);
  Background.addImage("bagrIm",backgroundImage);
  Background.scale = 4;
  
  player = createSprite(150, 338, 20, 50);
  player.addImage("plIm", playerImage);
  player.scale = 0.25;
  
  chaser1 = createSprite(55, 332, 20, 50);
  chaser1.addImage("chIm", chaser1Img);
  chaser1.scale = 0.25;
  //chaser1.debug = true;
  chaser2 = createSprite(45, 336, 20, 50);
  chaser2.addImage("ch2Im", chaser2Img);
  chaser2.scale = 0.25;
  //chaser2.debug = true;
  
  ground = createSprite(400, 380, 800, 1);
  ground.visible = false;
  
  obstacleGroup = new Group();
  flyerGroup = new Group();
  
  gamove = createSprite(400, 200, 20, 20);
  gamove.addImage("go", gamoveImg);
  
  reset = createSprite(400, 240, 20, 20);
  reset.addImage("rest", resetImg);
  reset.scale = 0.08;
  
}

function draw() {
  background(20);
  
  player.collide(ground);
  
  chaser1.collide(ground);
  chaser2.collide(ground);
  
  if(gamestate === PLAY) {
    reset.visible = false;
    gamove.visible = false;
    
    Background.velocityX = -(4+3*score/1000);
    
    score = score + Math.round(getFrameRate()/60); 
    
    if(Background.x < 100) {
      Background.x = Background.width/2;
    }
    
    if(keyDown("up") && player.y >= 338 || keyDown("space") &&     player.y >= 338) {
      player.velocityY = - 18;
      vhJump.play();
    } 
    
    player.velocityY = player.velocityY + 0.8;
    
    chaser1.velocityY = chaser1.velocityY + 1;
    chaser2.velocityY = chaser2.velocityY + 1.2;
    
    spawnObstacles();
    spawnFlyer();
    
    if(chaser1.isTouching(obstacleGroup)) {
      chaser1.velocityY = -18
    }
    
    if(chaser2.isTouching(obstacleGroup)) {
      chaser2.velocityY = -18
    }
    
    if(player.isTouching(obstacleGroup) || player.isTouching(flyerGroup)) {
      player.x = player.x - 5;
    }
    
    if(chaser1.isTouching(player) || chaser2.isTouching(player)) {
      gamestate = END;
      gamoveSound.play();
    }
  }
  
  else if(gamestate === END) {
    Background.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    flyerGroup.setVelocityXEach(0);
    flyerGroup.setLifetimeEach(-1);
    player.velocityY = 0;
    gamove.visible = true;
    reset.visible = true;
    chaser1.velocityY = 0;
    chaser2.velocityY = 0;
    if(mousePressedOver(reset)) {
      restart();
    }
  }
  
  drawSprites();
  
  text("Score : " + score, 470, 50);
}

function spawnObstacles() {
  if(frameCount % 95 === 0) {
    obstacle = createSprite(800, 350, 10, 10);
    obstacle.velocityX = -(4+3*score/1000);
    var ran = Math.round(random(1, 3));
    switch (ran) {
      case 1 : obstacle.addImage("ob", obstacle1Img);
      break;
      case 2 : obstacle.addImage("obsta", obstacle2Img);
      break;
      case 3 : obstacle.addImage("obstacle", obstacle3Img);
      break;
      default : break;
    }
    obstacle.scale = 0.15;
    obstacle.lifetime = 600;
    obstacleGroup.add(obstacle);
    player.x = player.x  + 1;
  }
}

function spawnFlyer() {
  if(frameCount % 100 === 0) {
    flyer = createSprite(800, 100, 20, 20);
    flyer.addImage("fly", flyerImg);
    flyer.y = Math.round(random(80, 120));
    flyer.velocityX = -(8+3*score/1000);
    flyer.scale = 0.17
    flyer.lifetime = 600;
    flyerGroup.add(flyer);
  }
}

function restart() {
  gamestate = PLAY;
  score = 0;
  flyerGroup.destroyEach();
  obstacleGroup.destroyEach();
  reset.visible = false;
  gamove.visible = false;
  player.x = 150;
  player.y = 338;
}