enchant();

//変数宣言
var game;
var scores = 0;

//Webページが読み込まれたら
addEventListener( 'load', function() {
  game = new Core(480,480);   //ゲームオブジェクトの作成
  // フレームレートの設定。15fpsに設定
  game.fps = 15;//ゲーム画面のフレームレート　毎秒１５枚のアニメーションで構成
    var times = 300;
  game.time = times;//ゲームの制限時間、メインシーンで時間を減らしていく
    var gil_hp = 5;

  //***
  //画像をプリロード
  game.preload( '../img/character/Gilbert2.png' );
  game.preload('../img/map/map1.png');
  game.preload('../img/map/map2.png');
    game.preload('../img/flag/flag_red_transparent.png');
  game.preload('../img/bullet/icon0.png');
  game.preload('../img/character/enemy1.png');
  game.preload('../img/character/enemy2.png');
  game.preload('../img/character/bigmonster2.png');
  game.preload('../img/bullet/bossbullet.png');
  game.preload('../img/bullet/bossfire.png');
  game.preload('../img/bullet/bossfire2.png');
  game.preload('../img/arrow.png');
  game.preload('../img/arrow2.png');
  //***

  //ボタン設定
  game.keybind( 'Z'.charCodeAt(0), 'a' );     //Zキー入力をaボタンとする
  game.keybind( 'Q'.charCodeAt(0), 'b' );     //Qキー入力をbボタンとする
  game.keybind(32, "c");                      //Spaceキーをcボタンとする

  // ゲーム音の設定
  var bgmsound = Sound.load('../bgm/bgm1.mp3');
  bgmsound.volume = 0.5;
  var jumpsound = Sound.load('../bgm/jump.mp3');
  var bulettsound = Sound.load('../bgm/laser.mp3');
  var boss_bulllet_sound = Sound.load('../bgm/launcher2.mp3');
  var boss_fire_sound = Sound.load('../bgm/fire1.mp3');
  var boss_bigfire_sound = Sound.load('../bgm/BigFire.mp3');
  boss_bigfire_sound.volume = 0.6;


    //tweetする機能
    function twitText() {
        var s, url;
        s = "横スクロール型シューティングゲームのチュートリアルでscore:";
        m = "獲得したよ!!"
        url = document.location.href;
        h = "#プロジェクト演習"
                //投稿画面を開く
                url = "http://twitter.com/share?url=" + escape(url) + encodeURIComponent("チュートリアルステージの得点は:" + scores + "でした") + "&hashtags=プロジェクト演習";
                window.open(url,"_blank","width=600,height=300");
    }


  //残機と制限時間、スコアのラベル
  var livesLabel = new Label();
  livesLabel.font = "16px 'Russo One', sans-serif";
  var timesLabel = new Label();
  timesLabel.font = "16px 'Russo One', sans-serif";
  var scoresLabel = new Label();
  scoresLabel.font = "16px 'Russo One', sans-serif";

  game.onload = function(){
      game.pushScene( game.titleScene() );      //シーンをゲームに追加する
  }


	//ポーズ（一時停止）シーン
  game.pauseScene = function(){
    bgmsound.pause();
    var scene = new Scene();
    scene.backgroundColor = 'rgba(0,0,0,0)';

    var windows = new Sprite(290, 270);
    var surface = new Surface( 290, 270);
    windows.image = surface;
    windows.moveTo(100,100);
    surface.context.fillStyle = "gray";
    surface.context.fillRect (0, 0, 290, 270);

      var btn_x = 180;
      var btn_y = 40;


    var surface1 = new Surface( 155, btn_y);
    surface1.context.fillStyle = "green";
    surface1.context.fillRect (0, 0, btn_x, btn_y);

    var surface2 = new Surface( 155, btn_y);
    surface2.context.fillStyle = "orange";
    surface2.context.fillRect (0, 0, btn_x, btn_y);

    var surface3 = new Surface( 155, btn_y);
    surface3.context.fillStyle = "red";
    surface3.context.fillRect (0, 0, btn_x, btn_y);

    var continue_button = new Sprite(btn_x, btn_y);
    continue_button.image = surface1;
    continue_button.moveTo(153,170);

    var replay_button = new Sprite(btn_x, btn_y);
    replay_button.image = surface2;
    replay_button.moveTo(153,235);

    var backStageSelect_button = new Sprite(btn_x, btn_y);
    backStageSelect_button.image = surface3;
    backStageSelect_button.moveTo(153,300);

    pause_msg = new Label();
  	pause_msg.color = 'white';
  	pause_msg.font = "40px 'Russo One', sans-serif";
  	pause_msg.text = "PAUSE";
    pause_msg.moveTo(178,120);

    msg1 = new Label();
  	msg1.color = 'white';
  	msg1.font = "25px 'Russo One', sans-serif";
  	msg1.text = "続ける";
    msg1.moveTo(203,180);

    msg2 = new Label();
  	msg2.color = 'white';
  	msg2.font = "25px 'Russo One', sans-serif";
  	msg2.text = "初めから";
    msg2.moveTo(193,245);

    msg3 = new Label();
  	msg3.color = 'white';
  	msg3.font = "25px 'Russo One', sans-serif";
  	msg3.text = "セレクト画面へ";
    msg3.moveTo(155,310);

    var arrow = new Sprite(32,32);       //ゴールイラスト
    var arrow_pos= [108,170,235,300];       //ゴールの位置
    arrow.image = game.assets["../img/arrow.png"];
    arrow.x = arrow_pos[0];
    arrow.y = arrow_pos[1];


    scene.addChild(windows);
    scene.addChild(continue_button);
    scene.addChild(replay_button);
    scene.addChild(backStageSelect_button);

    scene.addChild(pause_msg);
    scene.addChild(msg1);
    scene.addChild(msg2);
    scene.addChild(msg3);

    scene.addChild(arrow);


    var speed = 2;
    var frame_cnt = 5;
    arrow.onenterframe = function() {
      this.x += speed;
      if(this.x >= arrow_pos[0]+10 || this.x <= arrow_pos[0]){
        speed = -speed;
      }

      if(game.input.up && frame_cnt >= 5){
        if(this.y != arrow_pos[1]){
          this.y -= 65;
          frame_cnt = 0;
        }
      }
      if (game.input.down && frame_cnt >= 5) {
        if(this.y != arrow_pos[3]){
          this.y += 65;
          frame_cnt = 0;
        }
      }

      frame_cnt++;

      if(game.input.c){//Spaceキーで決定
        switch (this.y) {
          case arrow_pos[1]:
            //console.log("continue");
            bgmsound.pause();
            game.popScene(this);
            break;

          case arrow_pos[2]:
            //console.log("retry");
            game.time = times;
            scores = 0;
            gil_hp = 5;
            game.popScene(this);
            bgmsound.stop();
            game.replaceScene(game.mainScene() );
            break;

          case arrow_pos[3]:
            //console.log("select");
            window.history.back();
            break;
        }
      }
    }

    return scene;
  }

  //タイトルシーン
  game.titleScene = function(){
    var scene = new Scene();
    scene.backgroundColor = 'black';
    score = new Label();
  	score.color = 'white';
  	score.font = "28px 'Russo One', sans-serif";
  	score.text = "Click or Press\"SPACE\"";
    score.moveTo(100,225);
    score2 = new Label();
  	score2.color = 'white';
  	score2.font = "28px 'Russo One', sans-serif";
  	score2.text = "to Start !";
    score2.moveTo(160,260);
    scene.addChild(score);
    scene.addChild(score2);
    scene.ontouchstart = function(){
      //console.log("startTime = " + startTime);    // コンソールに表示
      game.replaceScene(game.mainScene() );
    };
    scene.onenterframe = function(){
      if(game.input.c){//Spaceキーで決定
        game.replaceScene(game.mainScene() );
      }
    };
    return scene;
  }

  //ゲームオーバーシーン
  game.gameOverScene = function() {
    bgmsound.stop();
    var scene = new Scene();
    scene.backgroundColor = 'black';

      var btn_x = 180;
      var btn_y = 40;

    var surface2 = new Surface( btn_x, btn_y);
    surface2.context.fillStyle = "orange";
    surface2.context.fillRect (0, 0, btn_x, btn_y);

    var surface3 = new Surface( btn_x, btn_y);
    surface3.context.fillStyle = "red";
    surface3.context.fillRect (0, 0, btn_x, btn_y);

    var replay_button = new Sprite(btn_x, btn_y);
    replay_button.image = surface2;
    replay_button.moveTo(153,235);

    var backStageSelect_button = new Sprite(btn_x, btn_y);
    backStageSelect_button.image = surface3;
    backStageSelect_button.moveTo(153,300);

    gameover_msg = new Label();
  	gameover_msg.color = 'white';
  	gameover_msg.font = "40px 'Russo One', sans-serif";
  	gameover_msg.text = "Game Over";
    gameover_msg.moveTo(125,120);


    msg2 = new Label();
  	msg2.color = 'white';
  	msg2.font = "25px 'Russo One', sans-serif";
  	msg2.text = "再挑戦";
    scores =0;
    msg2.moveTo(203,245);

    msg3 = new Label();
  	msg3.color = 'white';
  	msg3.font = "25px 'Russo One', sans-serif";
  	msg3.text = "セレクト画面へ";
    msg3.moveTo(153,310);

    var arrow = new Sprite(32,32);       //選択用矢印
    var arrow_pos= [108,235,300];       //矢印の位置
    arrow.image = game.assets["../img/arrow2.png"];
    arrow.x = arrow_pos[0];
    arrow.y = arrow_pos[1];

    scene.addChild(replay_button);
    scene.addChild(backStageSelect_button);
    scene.addChild(gameover_msg);
    scene.addChild(msg2);
    scene.addChild(msg3);
    scene.addChild(arrow);

    var speed = 2;
    var frame_cnt = 5;
    arrow.onenterframe = function() {
      this.x += speed;
      if(this.x >= arrow_pos[0]+10 || this.x <= arrow_pos[0]){
        speed = -speed;
      }
      if(game.input.up && frame_cnt >= 5){
        if(this.y != arrow_pos[1]){
          this.y -= 65;
          frame_cnt = 0;
        }
      }
      if (game.input.down && frame_cnt >= 5) {
        if(this.y != arrow_pos[2]){
          this.y += 65;
          frame_cnt = 0;
        }
      }
      frame_cnt++;
      if(game.input.c){//Spaceキーで決定
        switch (this.y) {
          case arrow_pos[1]:
            //console.log("retry");
            scores = 0;
            game.time = times;
            gil_hp = 5;
            game.popScene(this);
            bgmsound.stop();
            game.replaceScene(game.mainScene() );
            break;

          case arrow_pos[2]:
            //console.log("select");
            window.history.back();
            break;
        }
      }
    }
    return scene;
  }

  //ゲームクリアシーン
  game.ClearScene = function() {
    bgmsound.stop();
    var scene = new Scene();
    scene.backgroundColor = 'white';

      var btn_x = 180;
      var btn_y = 40;


    var surface1 = new Surface( btn_x, btn_y);
    surface1.context.fillStyle = "green";
    surface1.context.fillRect (0, 0, btn_x, btn_y);

    var surface2 = new Surface( btn_x, btn_y);
    surface2.context.fillStyle = "blue";
    surface2.context.fillRect (0, 0, btn_x, btn_y);

    var surface3 = new Surface( btn_x, btn_y);
    surface3.context.fillStyle = "red";
    surface3.context.fillRect (0, 0, btn_x, btn_y);

    var continue_button = new Sprite(btn_x, btn_y);
    continue_button.image = surface1;
    continue_button.moveTo(153,220);

    var replay_button = new Sprite(btn_x, btn_y);
    replay_button.image = surface2;
    replay_button.moveTo(153,285);

    var backStageSelect_button = new Sprite(btn_x, 40);
    backStageSelect_button.image = surface3;
    backStageSelect_button.moveTo(153,350);

    clear_msg = new Label();
  	clear_msg.color = 'black';
  	clear_msg.font = "40px 'Russo One', sans-serif";
  	clear_msg.text = "Game Clear";
    clear_msg.moveTo(120,80);

    score_msg = new Label();
  	score_msg.color = 'black';
  	score_msg.font = "30px 'Russo One', sans-serif";
  	score_msg.text = "SCORE : "+scores;
    score_msg.moveTo(130,135);

    msg1 = new Label();
  	msg1.color = 'white';
  	msg1.font = "25px 'Russo One', sans-serif";
  	msg1.text = "もう一度遊ぶ";
    msg1.moveTo(160,230);

    msg2 = new Label();
  	msg2.color = 'white';
  	msg2.font = "25px 'Russo One', sans-serif";
  	msg2.text = "ツイートする";
    msg2.moveTo(165,295);

    msg3 = new Label();
  	msg3.color = 'white';
  	msg3.font = "25px 'Russo One', sans-serif";
  	msg3.text = "セレクト画面へ";
    msg3.moveTo(153,360);

    var arrow = new Sprite(32,32);       //ゴールイラスト
    var arrow_pos= [108,220,285,350];       //ゴールの位置
    arrow.image = game.assets["../img/arrow.png"];
    arrow.x = arrow_pos[0];
    arrow.y = arrow_pos[1];


    scene.addChild(continue_button);
    scene.addChild(replay_button);
    scene.addChild(backStageSelect_button);

    scene.addChild(clear_msg);
    scene.addChild(score_msg);
    scene.addChild(msg1);
    scene.addChild(msg2);
    scene.addChild(msg3);

    scene.addChild(arrow);
      var i =0;

    var speed = 2;
    var frame_cnt = 5;
    arrow.onenterframe = function() {
      this.x += speed;
      if(this.x >= arrow_pos[0]+10 || this.x <= arrow_pos[0]){
        speed = -speed;
      }

      if(game.input.up && frame_cnt >= 5){
        if(this.y != arrow_pos[1]){
          this.y -= 65;
          frame_cnt = 0;
        }
      }
      if (game.input.down && frame_cnt >= 5) {
        if(this.y != arrow_pos[3]){
          this.y += 65;
          frame_cnt = 0;
        }
      }

      frame_cnt++;

      if(game.input.c){//Spaceキーで決定
        switch (this.y) {
          case arrow_pos[1]:
            //console.log("retry");
            scores = 0;
            game.time = times;
            gil_hp = 5;
            game.popScene(this);
            bgmsound.stop();
            game.replaceScene(game.mainScene() );
            break;

          case arrow_pos[2]:
            //Twitter処理

            if(i == 0){
              twitText();
              i =1;
              game.popScene(this);
              bgmsound.stop();
              game.replaceScene(game.ClearScene() );
            }

          case arrow_pos[3]:
            //console.log("select");
            window.history.back();
            break;
        }
      }
    }

    return scene;
  }

  game.mainScene = function() {
    var scene = new Scene();        //シーンを作成
    scene.backgroundColor = 'darkred';

    //========================
    //  マップデータ見栄え用　マップ画像から左上から0,1,0,2.....と表示するマップチップを変更できる


		//map2.png用
    var block = [
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
            [78, 8, 8, 8,78, 8, 8, 8,78, 8, 8, 8,78, 8, 8, 8,78, 8, 8, 8,78, 8, 8, 8,78, 8, 8, 8,78, 8, 8, 8,78, 8, 8, 8,78, 8, 8, 8,78, 8, 8],
            [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78],
            [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78],
            [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78],
            [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78],
            [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78],
            [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78],
            [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78],
            [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78],
            [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78],
            [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78],
            [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78],
            [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78],
            [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78],
            [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78, 4, 5, 6,78,78,78],
            [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78, 4, 0, 6,78,78,78],
            [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78, 4, 0, 6,78,78,78],
            [70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,37,37,37,37,37,70,70],
            [70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70],
            [70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70]
    ];


		//マップデータ判定用　0は背景、1は壁、床などの当たり判定がある。左端は見えない壁作ってこれ以上行けないように
    var col_block = [
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
    //========================




    backgroundMap = new Map(16, 16);//マップ配置用のクラス
    backgroundMap.image = game.assets['../img/map/map2.png'];
    backgroundMap.loadData(block);
    backgroundMap.collisionData = col_block;

    var i = 0;
    var bullet_pos_x = 0;       //弾の位置を他のオブジェクトの位置と比べる際に使用するx座標の値
    var bullet_pos_y = 0;       //弾の位置を他のオブジェクトの位置と比べる際に使用するy座標の値

    //無敵管理
    var invincible_flag = false;    //無敵かどうかのフラグ　true = 無敵
    var invincible_count = 0;   //無敵時間のカウント（フレーム数）

    var goal_flag = false;      //ゴールしたかどうかを判定する

    //ゲームオーバー後のフレームのカウント
    var gameover_framcount = 0;
    var gameover_framecount_gil = 0;

    //残機と制限時間、スコアのラベル
    var livesLabel = new Label();
    livesLabel.font = "16px 'Russo One', sans-serif";
    var timesLabel = new Label();
    timesLabel.font = "16px 'Russo One', sans-serif";
    var scoresLabel = new Label();
    scoresLabel.font = "16px 'Russo One', sans-serif";

    //制限時間表示
    //game.time = 300;
    timesLabel.text = '制限時間：' + game.time;
    timesLabel.x = 350;
    timesLabel.y = 5;
    timesLabel.addEventListener('enterframe', function(){
        if(goal_flag == false){
            if(game.frame % game.fps == 0){
                game.time--;
                timesLabel.text = '制限時間：' + game.time;
                if (game.time == 0) game.replaceScene(game.gameOverScene());
            }
        }
    });

    scene.addChild(timesLabel);

    //残機とスコア用処理
    scene.onenterframe = function() {
        //残機表示
        //あとは当たり判定と同時にlives減らす
        livesLabel.text = '残機：' + gil_hp;
        livesLabel.y = 5;
        scene.addChild(livesLabel);
        if (gil_hp <= 0) {
          goal_flag = true;
          Gilbert.opacity = 1;
          if(gameover_framcount % 6 == 0){

            Gilbert.frame = (gameover_framecount_gil % 8) + 81;
            gameover_framecount_gil ++;

          }
          if(gameover_framcount >= 48){

            game.replaceScene(game.gameOverScene());

          }else{

            gameover_framcount ++;

          }
        }

        //スコア表示
        scoresLabel.text = 'SCORE : ' + scores;
        scoresLabel.y = 25;
        scene.addChild(scoresLabel);
    }

    var bullet;
    var bullet_count = 0;       //弾の間隔を数える
    var bullet_flag = true;     //間隔が10フレームあいたかを判断

    var goal = new Sprite(32,32);       //ゴールイラスト
    var goal_pos = [600,400];       //ゴールの位置
    goal.image = game.assets["../img/flag/flag_red_transparent.png"];
    goal.x = goal_pos[0];
    goal.y = goal_pos[1];
    var goal_framecount = 0;
    var framecount_set = 0;

    var enemy1; //敵スプライトの変数宣言
    var enemy2; //敵スプライトの変数宣言


    var Gilbert = new Sprite(32, 32);//プレイヤークラスenchant.jsではSpriteで管理
    var Gil_firstposition = [80,400]//プレイヤーの初期スポーン位置
    Gilbert.image = game.assets["../img/character/Gilbert2.png"];
    Gilbert.x = Gil_firstposition[0];
    Gilbert.y = Gil_firstposition[1];
    Gilbert.prey = Gil_firstposition[1];
    //Gilbert.ay = 50;
    Gilbert.frame = 1;//プレイヤーのアニメーションの画像　これを変更するとプレイヤーの画像が変わってモーションが作れる（歩くとか）
    Gilbert.jumpFlg = false;//ジャンプしてるかどうかのフラグ
    Gilbert.jumpingFlg = false;//ジャンプ中がどうかのフラグ
    Gilbert.jumpPower = 8; //プレイヤーのジャンプ力　大きくするほど高く飛べる
    //Gilbert.lives = 5; // 残機数
    Gilbert.addEventListener(Event.ENTER_FRAME, function(e) {
        bgmsound.play();

				//----------------------------
	      //Qキーで一ゲームを一時停止
	      //----------------------------
	      if ( game.input.b ) {
	        bulettsound.play();

	        game.pushScene(game.pauseScene());
	      }
        if (game.input.up && Gilbert.jumpingFlg === false && goal_flag == false) {
           Gilbert.jumpFlg = true;
           jumpsound.play();
        }

        if(goal_flag == false){
            if (game.input.right) {
                 //→キー
                if(backgroundMap.hitTest(Gilbert.x+30 ,Gilbert.y + 30 )){
                }else{
                    if(Gilbert.jumpingFlg){
                        Gilbert.x += 4;
                        Gilbert.scaleX = 1;
                    }else{
                        Gilbert.frame = (Gilbert.age%5) + 1;
                        Gilbert.x += 4;
                        Gilbert.scaleX = 1;
                    }

                }
            }


            if (game.input.left) {
                //←キー
                if(backgroundMap.hitTest(Gilbert.x+5 ,Gilbert.y + 30 )){
                }else{
                    if(Gilbert.jumpingFlg){
                        Gilbert.x -= 4;
                        Gilbert.scaleX = -1;
                    }else{
                        Gilbert.frame = (Gilbert.age%5) + 1;
                        Gilbert.x -= 4;
                        Gilbert.scaleX = -1;
                    }
                }

            }
        }
         //落とし穴処理
        if(Gilbert.y > 480){
            game.replaceScene(game.gameOverScene())
        }
        //左に落ちないようにする処理
            if(Gilbert.x == 0){
                Gilbert.x += 4;
                Gilbert.scaleX = -1;
            }

        //=============
        //ジャンプ処理
        //=============
        if(Gilbert.jumpFlg){
            if(!Gilbert.jumpingFlg){
                Gilbert.jumpingFlg = true;
                Gilbert.prey = Gilbert.y;
                //jumpsound.play();
            }else{
                //y座標を決める処理
                if(Gilbert.jumpPower>3){
                    //上昇中
                    Gilbert.frame = 27
                }else if(Gilbert.jumpPower <= 3 && Gilbert.jumpPower > 0){
                    //頂上付近、ブロックから下り始めも
                    Gilbert.frame = 28
                }else if(Gilbert.jumpPower<=0){
                    //下降中
                    Gilbert.frame = 29
                }
                Gilbert.y = Gilbert.prey - Gilbert.jumpPower--;

                //y座標が衝突する場合
                while(backgroundMap.hitTest(Gilbert.x+16 ,Gilbert.y + 32 )){
                    Gilbert.y = Gilbert.prey - (++Gilbert.jumpPower);
                    if(!backgroundMap.hitTest(Gilbert.x+16 ,Gilbert.y + 32 )){
                        Gilbert.y++;
                        Gilbert.jumpingFlg = false;
                        Gilbert.jumpFlg = false;
                        Gilbert.jumpPower = 8;
                        Gilbert.frame = 30
                        break;
                    }
                }
                Gilbert.prey = Gilbert.y;
            }
        }

        //===========================================
        //足元に地面がない場合はジャンプ中とみなす
        //ただし上には飛べないのでjumpPowerは0とする
        //===========================================
        if(!backgroundMap.hitTest(Gilbert.x+16 ,Gilbert.y + 32 ) && Gilbert.jumpingFlg !== true){
            Gilbert.jumpFlg = true;
            Gilbert.jumpPower = 0;
        }

        //===========================================
        //弾を打つ処理
        //10フレーム間隔で発射できる
        //===========================================

        if(bullet_flag==true && goal_flag == false){

            if ( game.input.a ) {
              bulettsound.play();
              hitABullet();
            }
        //前に弾を打った時から10フレームが経過かつ'zキーが押された時'

            function hitABullet() {
              //弾を作成
                bullet = new Bullet();
                stage.addChild( bullet );
                bullet_flag = false;
                bullet_count = 0;

            }
        }

        if(bullet_flag==false){     //前に弾を打った時から10フレーム立っていない時

            bullet_count++;     //フレームのカウントを行う

        }

        if(bullet_count==10)bullet_flag=true;       //フレームカウントが10になった時、弾を打てるようにする

        if( i == 0){
            enemy1 = new Enemy1;
            stage.addChild(enemy1);
            enemy2 = new Enemy2;
            stage.addChild(enemy2);
            i = 1;
        }


        //BulletクラスとEnemy1クラスとの当たり判定
        Bullet.intersect(Enemy1).forEach(function(pair)
        {
            //pair[0]: Bulletのインスタンス
            //pair[1]: Enemy1のインスタンス

            scores += 100;
            pair[0].remove();
            pair[1].remove();

        });

        //BulletクラスとEnemy2クラスとの当たり判定
        Bullet.intersect(Enemy2).forEach(function(pair)
        {
            //pair[0]: Bulletのインスタンス
            //pair[1]: Enemy1のインスタンス

            scores += 200;
            pair[0].remove();
            pair[1].remove();

        });


        //無敵時間管理
        if(invincible_flag == true){ //無敵フラグがtrueなら

          invincible_count ++ //無敵時間をカウント

        }
        if(invincible_count == 30){ //無敵時間が3秒になったら
          invincible_flag = false; //無敵を解除
          invincible_count = 0; //無敵時間を初期化
          Gilbert.opacity = 1; //Gilbertの透明度を1にする
        }


        //===========================================
        //ゴール処理
        //===========================================

        if(Gilbert.x >= goal.x){
            goal_flag = true;
            //スコア追加
            //framecount_setが0の時のみ加算を行う
            framecount_set ++
            if(framecount_set % 3 == 0 ){

                goal_framecount ++ //ゴールしてからの時間を計測
                game.time = game.time; //ゲーム内の時間をクリアした時間で固定

                Gilbert.x = Gilbert.x; //Gilbertのx軸を固定

                if(Gilbert.jumpFlg == false){ //ジャンプが終わった後にフレームを動かす

                    Gilbert.frame = goal_framecount % 2 +  53;

                }

            }
            if(framecount_set == 45){
                //alert("Game Clear");
                game.replaceScene(game.mainScene2());
            }
        }
        else{

            goal_flag = false;

        }

    });
      var stage = new Group();//マップとキャラクターを同時に管理するためにグループとして統括（スクロールするときに必要）


    /**弾のクラス**/
    var Bullet = Class.create( Sprite, {
      initialize: function() {

        var bulletX, bulletY;   //弾のX座標とY座標
        Sprite.call( this, 16, 16 );    //Spriteクラスのメソッドを、thisでも使えるようにする
            this.image = game.assets[ '../img/bullet/icon0.png' ];  //スプライトの画像ファイルを指定


        //プレイヤーの向きによって弾の位置や動かす方向を変える
        if ( Gilbert.scaleX >= 0 ) {
            this.speed = 10;
                bulletX = Gilbert.x + 25 ;
                Gilbert.frame = 59;
                this.frame = 54
        } else {
            this.speed = -10;
                bulletX = Gilbert.x - 9.25 ;
                Gilbert.frame = 59;
                this.frame = 50
        }
        bulletY = Gilbert.y + 6;
        bullet_pos_y = bulletY;


        this.moveTo( bulletX, bulletY );    //弾の位置
      },
      onenterframe: function() {
            this.x += this.speed;   //弾の移動
            bullet_pos_x = this.x;
            if(this.x > Gilbert.x + 200 || this.x < -20){       //弾の削除
                this.remove();
            };
            if(backgroundMap.hitTest(bullet.x + 9 ,bullet.y + 10)){
                this.remove();
            }
        }
    });




    var Enemy1 = Class.create( Sprite, {
        initialize: function() {
            Sprite.call(this, 20, 30);
            this.image = game.assets["../img/character/enemy1.png"];
            this.moveTo(enemy1x, enemy1y);
            this.frame = 1;
        },
        onenterframe: function() {
            this.x += enemydx;
            this.frame = (this.age%15) + 1;
            if(this.x >= enemy1max || this.x <= enemy1min){
                enemydx = -enemydx;
            }


            //Gilbertとの当たり判定
            if(invincible_flag == false){
                if(Gilbert.x - this.x > -25 && Gilbert.x - this.x < 25){
                    if(Gilbert.y - this.y > -21 && Gilbert.y - this.y < 21){
                        gil_hp -= 1; //Gilbertの残機を1減らす
                        invincible_flag = true; //無敵フラグをtrueに
                        Gilbert.opacity = 0.7; //Gilbertの透明度を0.7にする
                    }
                }
            }
        }
    });
		//敵キャラ１初期設定
    var enemy1x = 320;
    var enemy1y = 405;
    var enemydx = 3;
    var enemy1min = enemy1x - 50;
    var enemy1max = enemy1x + 50;
    //var enemy1 = new Enemy1();



    //敵クラス、縦移動を行う
    var Enemy2 = Class.create( Sprite, {
        initialize: function() {
            Sprite.call(this, 30, 24);
            this.image = game.assets["../img/character/enemy2.png"];
            this.moveTo(enemy2x, enemy2y);
            this.frame = 6;
        },
        onenterframe: function() {
          this.y += enemydy;
          if(this.x > Gilbert.x ){
              this.frame = (this.age % 3) + 6;
          }else if(this.x < Gilbert.x) {
              this.frame = (this.age % 3) + 12;
          }else{
              this.frame = this.age % 3;
          }
          if(this.y >= enemy2max || this.y <= enemy2min){
              enemydy = -enemydy;
          }

            //Gilbertとの当たり判定
            if(invincible_flag == false){
                if(Gilbert.x - this.x > -25 && Gilbert.x - this.x < 25){
                    if(Gilbert.y - this.y > -21 && Gilbert.y - this.y < 21){
                        gil_hp -= 1; //Gilbertの残機を1減らす
                        invincible_flag = true; //無敵フラグをtrueに
                        Gilbert.opacity = 0.7; //Gilbertの透明度を0.7にする
                    }
                }
            }
        }
    });
		//敵キャラ２初期設定
		var enemy2x = 500;
		var enemy2y = 355;
		var enemydy = 3;
		var enemy2min = enemy2y - 50;
		var enemy2max = enemy2y + 50;



    stage.addChild(goal);
    stage.addChild(backgroundMap);

    stage.addChild(Gilbert);

    //プレイヤーのX座標に合わせて画面をスクロール
    stage.addEventListener(Event.ENTER_FRAME, function(e) {
    if(stage.x > 128 - Gilbert.x){
        stage.x = 128 - Gilbert.x;
    }else if(stage.x < 80 - Gilbert.x){
        stage.x = 80 - Gilbert.x;
    }


    });

    scene.addChild(stage);

    return scene;

  }


  //ボスバトルシーン
  game.mainScene2 = function() {
    var scene = new Scene();        //シーンを作成

    //scene.backgroundColor = '#00BFFF';    //ブロックおいてないとこの色（前まで白色だったとこ）
    scene.backgroundColor = 'darkred';

    //========================
    //  マップデータ見栄え用　マップ画像から左上から0,1,0,2.....と表示するマップチップを変更できる
    //map2.png用
    var block = [
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [78, 8, 8,78, 8, 8,78, 8, 8,78, 8, 8,78, 8, 8,78, 8, 8,78, 8, 8,78, 8, 8,78, 8, 8,78, 8,78],
      [78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78],
      [70,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,70],
      [70,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,70],
      [70,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,70],
      [70,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,70],
      [70,78,78,78,78, 1, 1,78,78,78,78,78,78,78, 1, 1,78,78,78,78,78,78,78, 1, 1,78,78,78,78,70],
      [70,78,78,78,78, 1, 1,78,78,78,78,78,78,78, 1, 1,78,78,78,78,78,78,78, 1, 1,78,78,78,78,70],
      [70,78,78,78,78, 1, 1,78,78,78,78,78,78,78, 1, 1,78,78,78,78,78,78,78, 1, 1,78,78,78,78,70],
      [70,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,70],
      [70,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,70],
      [70,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,70],
      [70,78,78,78,70,70,70,70,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,70,70,70,70,78,78,70],
      [70, 4, 5, 6,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,70],
      [70, 4, 0, 6,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,70],
      [70, 4, 0, 6,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,70],
      [70,37,37,37,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70],
      [70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70],
      [70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70]
    ];


		//マップデータ判定用　0は背景、1は壁、床などの当たり判定がある。左端は見えない壁作ってこれ以上行けないように
    var col_block = [
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [ 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1],
      [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
    //========================

    backgroundMap = new Map(16, 16);//マップ配置用のクラス
    backgroundMap.image = game.assets['../img/map/map2.png'];
    backgroundMap.loadData(block);
    backgroundMap.collisionData = col_block;

    //var stage = new Group();//マップとキャラクターを同時に管理するためにグループとして統括（スクロールするときに必要）


    var bullet_pos_x = 0;       //弾の位置を他のオブジェクトの位置と比べる際に使用するx座標の値
    var bullet_pos_y = 0;       //弾の位置を他のオブジェクトの位置と比べる際に使用するy座標の値

    var b_bullet_pos_x = 0;       //弾の位置を他のオブジェクトの位置と比べる際に使用するx座標の値
    var b_bullet_pos_y = 0;       //弾の位置を他のオブジェクトの位置と比べる際に使用するy座標の値
    var b_fire_pos_x = 0;
    var b_fire_pos_y = 0;
    var b_bfire_pos_x = 0;
    var b_bfire_pos_y = 0;

    //無敵管理
    var invincible_flag = false;    //無敵かどうかのフラグ　true = 無敵
    var invincible_count = 0;   //無敵時間のカウント（フレーム数）

    var goal_flag = false;      //ゴールしたかどうかを判定する
    var goal_framecount = 0;
    var framecount_set = 0;

    //ゲームオーバー後のフレームのカウント
    var gameover_framcount = 0;
    var gameover_framecount_gil = 0;


    //制限時間表示
    timesLabel.text = '制限時間：' + game.time;
    timesLabel.x = 350;
    timesLabel.y = 5;

    scene.addChild(timesLabel);
    scene.addChild(scoresLabel);
    scene.addChild(livesLabel);

    var bullet;
    var bullet_count = 0;       //弾の間隔を数える
    var bullet_flag = true;     //間隔が10フレームあいたかを判断



    var Gilbert = new Sprite(32, 32);//プレイヤークラスenchant.jsではSpriteで管理
    var Gil_firstposition = [32,400]//プレイヤーの初期スポーン位置
    var Gil_jp = 11;
    Gilbert.image = game.assets["../img/character/Gilbert2.png"];
    Gilbert.x = Gil_firstposition[0];
    Gilbert.y = Gil_firstposition[1];
    Gilbert.prey = Gil_firstposition[1];
    Gilbert.frame = 1;//プレイヤーのアニメーションの画像　これを変更するとプレイヤーの画像が変わってモーションが作れる（歩くとか）
    Gilbert.jumpFlg = false;//ジャンプしてるかどうかのフラグ
    Gilbert.jumpingFlg = false;//ジャンプ中がどうかのフラグ
    Gilbert.jumpPower = Gil_jp; //プレイヤーのジャンプ力　大きくするほど高く飛べる
    //Gilbert.lives = 5; // 残機数
    Gilbert.addEventListener(Event.ENTER_FRAME, function(e) {
      bgmsound.play();
      //制限時間処理
      if(goal_flag == false){
          if(game.frame % game.fps == 0){
              game.time--;
              timesLabel.text = '制限時間：' + game.time;
              if (game.time == 0) game.replaceScene(game.gameOverScene());
          }
      }

      //残機表示
      //あとは当たり判定と同時にlives減らす
      livesLabel.text = '残機：' + gil_hp;
      livesLabel.y = 5;
      if (gil_hp <= 0) {
        goal_flag = true;
        Gilbert.opacity = 1;
        if(gameover_framcount % 6 == 0){
          Gilbert.frame = (gameover_framecount_gil % 8) + 81;
          gameover_framecount_gil ++;
        }
        if(gameover_framcount >= 48){
          game.replaceScene(game.gameOverScene());
        }else{
          gameover_framcount ++;
        }
      }

      //スコア表示
      scoresLabel.text = 'SCORE : ' + scores;
      scoresLabel.y = 25;

			//----------------------------
      //Qキーで一ゲームを一時停止
      //----------------------------
      if ( game.input.b ) {
        bulettsound.play();

        game.pushScene(game.pauseScene());
      }


      //キャラクターの移動処理
      if (game.input.up && Gilbert.jumpingFlg === false && goal_flag == false) {
         Gilbert.jumpFlg = true;
         jumpsound.play();
      }
      if(goal_flag == false){
        if (game.input.right) {
             //→キー
            if(backgroundMap.hitTest(Gilbert.x+30 ,Gilbert.y + 30 )){
            }else{
                if(Gilbert.jumpingFlg){
                    Gilbert.x += 4;
                    Gilbert.scaleX = 1;
                }else{
                    Gilbert.frame = (Gilbert.age%5) + 1;
                    Gilbert.x += 4;
                    Gilbert.scaleX = 1;
                }

            }
        }
        if (game.input.left) {
          //←キー
          if(backgroundMap.hitTest(Gilbert.x+5 ,Gilbert.y + 30 )){
          }else{
              if(Gilbert.jumpingFlg){
                  Gilbert.x -= 4;
                  Gilbert.scaleX = -1;
              }else{
                  Gilbert.frame = (Gilbert.age%5) + 1;
                  Gilbert.x -= 4;
                  Gilbert.scaleX = -1;
              }
          }
        }
      }


      //落とし穴処理
      if(Gilbert.y > 480){
          game.replaceScene(game.gameOverScene())
      }


      //=============
      //ジャンプ処理
      //=============
      if(Gilbert.jumpFlg){
        if(!Gilbert.jumpingFlg){
          Gilbert.jumpingFlg = true;
          Gilbert.prey = Gilbert.y;
          //jumpsound.play();
        }else{
          //y座標を決める処理
          if(Gilbert.jumpPower>3){
              //上昇中
              Gilbert.frame = 27
          }else if(Gilbert.jumpPower <= 3 && Gilbert.jumpPower > 0){
              //頂上付近、ブロックから下り始めも
              Gilbert.frame = 28
          }else if(Gilbert.jumpPower<=0){
              //下降中
              Gilbert.frame = 29
          }
          Gilbert.y = Gilbert.prey - Gilbert.jumpPower--;
          //y座標が衝突する場合
          while(backgroundMap.hitTest(Gilbert.x+16 ,Gilbert.y + 32 )){
              Gilbert.y = Gilbert.prey - (++Gilbert.jumpPower);
              if(!backgroundMap.hitTest(Gilbert.x+16 ,Gilbert.y + 32 )){
                  Gilbert.y++;
                  Gilbert.jumpingFlg = false;
                  Gilbert.jumpFlg = false;
                  Gilbert.jumpPower = Gil_jp;
                  if (Gilbert.scaleX == -1) {
                    Gilbert.frame = 10;
                  }else{
                    Gilbert.frame = 1;
                  }

                  break;
              }
          }
          Gilbert.prey = Gilbert.y;
        }
      }
      //===========================================
      //足元に地面がない場合はジャンプ中とみなす
      //ただし上には飛べないのでjumpPowerは0とする
      //===========================================
      if(!backgroundMap.hitTest(Gilbert.x+16 ,Gilbert.y + 32 ) && Gilbert.jumpingFlg !== true){
          Gilbert.jumpFlg = true;
          Gilbert.jumpPower = 0;
      }

      //===========================================
      //弾を打つ処理
      //10フレーム間隔で発射できる
      //===========================================
      if(bullet_flag==true && goal_flag == false){
        if ( game.input.a ) {
          bulettsound.play();
          hitABullet();
        }
        //前に弾を打った時から10フレームが経過かつ'zキーが押された時'
        function hitABullet() {
          //弾を作成
          bullet = new Bullet();
          scene.addChild( bullet );
          bullet_flag = false;
          bullet_count = 0;
        }
      }
      if(bullet_flag==false){     //前に弾を打った時から10フレーム立っていない時
          bullet_count++;     //フレームのカウントを行う
      }
      if(bullet_count==10)bullet_flag=true;       //フレームカウントが10になった時、弾を打てるようにする



      //BulletクラスとEnemy1クラスとの当たり判定
      Bullet.intersect(BossEnemy).forEach(function(pair)
      {
          //pair[0]: Bulletのインスタンス
          //pair[1]: Enemy1のインスタンス
          scores += 10;
          enemy_lives -= 1;
          if (enemy_lives <= 0) {
            scores += 1000;
            pair[1].remove();
          }
          pair[0].remove();

      });


      //Gilbertとの当たり判定
      BossEnemy.intersect(Gilbert).forEach(function(pair){
        if(invincible_flag == false){
          gil_hp -= 1; //Gilbertの残機を1減らす
          Gilbert.opacity = 0.7; //Gilbertの透明度を0.7にする
        }
        invincible_flag = true; //無敵フラグをtrueに
      });
      //Gilbertとの当たり判定
      BossBullet.intersect(Gilbert).forEach(function(pair){
        if(invincible_flag == false){
          gil_hp -= 1; //Gilbertの残機を1減らす
          Gilbert.opacity = 0.7; //Gilbertの透明度を0.7にする
        }
        invincible_flag = true; //無敵フラグをtrueに
      });
      //Gilbertとの当たり判定
      BossFire.intersect(Gilbert).forEach(function(pair){
        if(invincible_flag == false){
          gil_hp -= 1; //Gilbertの残機を1減らす
          Gilbert.opacity = 0.7; //Gilbertの透明度を0.7にする
        }
        invincible_flag = true; //無敵フラグをtrueに
      });
      //Gilbertとの当たり判定
      BossBigFire.intersect(Gilbert).forEach(function(pair){
        if(invincible_flag == false){
          gil_hp -= 1; //Gilbertの残機を1減らす
          Gilbert.opacity = 0.7; //Gilbertの透明度を0.7にする
        }
        invincible_flag = true; //無敵フラグをtrueに
      });
      /*
      //BulletクラスとEnemy2クラスとの当たり判定
      Bullet.intersect(Enemy2).forEach(function(pair)
      {
          //pair[0]: Bulletのインスタンス
          //pair[1]: Enemy1のインスタンス
          scores += 200;
          pair[0].remove();
          pair[1].remove();
      });
      */


      //無敵時間管理
      if(invincible_flag == true){ //無敵フラグがtrueなら
        invincible_count ++ //無敵時間をカウント
      }
      if(invincible_count == 45){ //無敵時間が3秒になったら
        invincible_flag = false; //無敵を解除
        invincible_count = 0; //無敵時間を初期化
        Gilbert.opacity = 1; //Gilbertの透明度を1にする
      }


      //===========================================
      //ゴール処理
      //===========================================

      if(enemy_lives <= 0){
        goal_flag = true;
        //スコア追加
        //framecount_setが0の時のみ加算を行う
        if(framecount_set == 0){
          scores += game.time;
          scores += gil_hp * 100;
        }
        framecount_set ++
        if(framecount_set % 3 == 0 ){
            goal_framecount ++ //ゴールしてからの時間を計測
            game.time = game.time; //ゲーム内の時間をクリアした時間で固定
            Gilbert.x = Gilbert.x; //Gilbertのx軸を固定
            if(Gilbert.jumpFlg == false){ //ジャンプが終わった後にフレームを動かす
                Gilbert.frame = goal_framecount % 2 +  53;
            }

        }
        if(framecount_set == 90){
            //alert("Game Clear");
            game.replaceScene(game.ClearScene());
        }
      }
      else{
          goal_flag = false;
      }

      //プレイヤーのX座標に合わせて画面をスクロール
      /*
      if(stage.x > 128 - Gilbert.x){
          stage.x = 128 - Gilbert.x;
      }else if(stage.x < 80 - Gilbert.x){
          stage.x = 80 - Gilbert.x;
      }
      */

    });//Gilbert.addEventListenerが終了

    /**自分の弾のクラス**/
    var Bullet = Class.create( Sprite, {
      initialize: function() {
        var bulletX, bulletY;   //弾のX座標とY座標
        Sprite.call( this, 16, 16 );    //Spriteクラスのメソッドを、thisでも使えるようにする
        this.image = game.assets[ '../img/bullet/icon0.png' ];  //スプライトの画像ファイルを指定

        //プレイヤーの向きによって弾の位置や動かす方向を変える
        if ( Gilbert.scaleX >= 0 ) {
          this.speed = 10;
          bulletX = Gilbert.x + 25 ;
          Gilbert.frame = 59;
          this.frame = 54
        } else {
          this.speed = -10;
          bulletX = Gilbert.x - 9.25 ;
          Gilbert.frame = 59;
          this.frame = 50
        }
        bulletY = Gilbert.y + 6;
        bullet_pos_y = bulletY;

        //console.log(bulletX);
        //console.log(bulletY);

        this.moveTo( bulletX, bulletY );    //弾の位置
      },
      onenterframe: function() {
        this.x += this.speed;   //弾の移動
        bullet_pos_x = this.x;
        if(this.x > Gilbert.x + 200 || this.x < -20){       //弾の削除
            this.remove();
        };
        if(backgroundMap.hitTest(bullet.x + 9 ,bullet.y + 10)){
            this.remove();
        }
      }
    });

    /**bossの弾のクラス**/
    //シャドーボール
    var BossBullet = Class.create( Sprite, {
      initialize: function() {
        var b_bulletX, b_bulletY;   //弾のX座標とY座標
        Sprite.call( this, 32, 32 );    //Spriteクラスのメソッドを、thisでも使えるようにする
        this.image = game.assets[ '../img/bullet/bossbullet.png' ];  //スプライトの画像ファイルを指定
        boss_bulllet_sound.stop();
        boss_bulllet_sound.play();

        //プレイヤーの向きによって弾の位置や動かす方向を変える
        if ( enemy1.scaleX >= 0 ) {
          this.speed = -13;
          b_bulletX = enemy1.x - 15 ;
        } else {
          this.speed = 13;
          b_bulletX = enemy1.x + 25 ;

        }
        var i = getRandomInt(2);
        switch (i) {
          case 0:
            b_bulletY = enemy1.y + 5;
            break;

          case 1:
            b_bulletY = enemy1.y + 35;
            break;
        }
        //b_bulletY = Gilbert.y;
        b_bullet_pos_y = b_bulletY;
        this.moveTo( b_bulletX, b_bulletY );    //弾の位置
      },
      onenterframe: function() {
        this.x += this.speed;   //弾の移動
        b_bullet_pos_x = this.x;
        if(this.x > 480 || this.x < -32){       //弾の削除
            this.remove();
        };
      }
    });
    //火柱（小）（速い）
    var BossFire = Class.create( Sprite, {
      initialize: function() {
        var b_fireX, b_fireY;   //弾のX座標とY座標
        Sprite.call( this, 20, 28 );    //Spriteクラスのメソッドを、thisでも使えるようにする
        this.image = game.assets[ '../img/bullet/bossfire.png' ];  //スプライトの画像ファイルを指定
        this.frame = 3;

        boss_fire_sound.play();

        //プレイヤーの向きによって弾の位置や動かす方向を変える
        if ( enemy1.scaleX >= 0 ) {
          this.speed = -20;
          b_fireX = enemy1.x - 15 ;
        } else {
          this.speed = 20;
          b_fireX = enemy1.x + 25 ;

        }

        b_fireY = enemy1.y + 52;
        //b_bulletY = Gilbert.y;
        b_fire_pos_y = b_fireY;

        //console.log(b_bulletX);
        //console.log(b_bulletY);


        this.moveTo( b_fireX, b_fireY );    //弾の位置
      },
      onenterframe: function() {
        this.x += this.speed;   //弾の移動
        b_fire_pos_x = this.x;
        if(this.x > 480 || this.x < -20){       //弾の削除
            this.remove();
            boss_fire_sound.stop();
        };
      }
    });
    //火柱（大）
    var BossBigFire = Class.create( Sprite, {
      initialize: function() {
        var b_bfireX, b_bfireY;   //弾のX座標とY座標
        Sprite.call( this, 30, 126 );    //Spriteクラスのメソッドを、thisでも使えるようにする
        this.image = game.assets[ '../img/bullet/bossfire2.png' ];  //スプライトの画像ファイルを指定
        this.frame = 2;
        boss_bigfire_sound.stop();
        boss_bigfire_sound.play();

        //プレイヤーの向きによって弾の位置や動かす方向を変える
        if ( enemy1.scaleX >= 0 ) {
          this.speed = -20;
          b_bfireX = enemy1.x - 5 ;
        } else {
          this.speed = 20;
          b_bfireX = enemy1.x + 35 ;

        }

        b_bfireY = enemy1.y - 46;
        //b_bulletY = Gilbert.y;
        b_bfire_pos_y = b_bfireY;

        //console.log(b_bulletX);
        //console.log(b_bulletY);


        this.moveTo( b_bfireX, b_bfireY );    //弾の位置
      },
      onenterframe: function() {
        if(this.frame == 5){
          this.frame = 0;
          this.x += this.speed;   //弾の移動
          b_bfire_pos_x = this.x;
          boss_bigfire_sound.stop();
          boss_bigfire_sound.play();
        }else{
          this.frame++;
        }

        if(this.x > 440 || this.x < 40){       //弾の削除
            this.remove();
        };
      }
    });

    //ランダムな値を生成　
    function getRandomInt(max){
      return Math.floor(Math.random() * max);
    }



    var rnd = 0;
    var cnt =0;

    //  ボスパラメータ
    //攻撃用フラグ、合計発生フレーム
    var atack1_flg = 0;
    var atack2_flg = 0;
    var atack3_flg = 0;

      //敵キャラ１初期設定
    var enemy1x = 320;
    var enemy1y = 360;
    var enemydx = 3;
    var enemy_lives = 30;


    //ボスモンスター
    var BossEnemy = Class.create( Sprite, {
      initialize: function() {
        Sprite.call(this, 80, 80);
        this.image = game.assets["../img/character/bigmonster2.png"];
        this.moveTo(enemy1x, enemy1y);
        this.frame = 3;
      },
      onenterframe: function() {

        //console.log(rnd);


        if (atack1_flg == 0 && atack2_flg == 0 && atack3_flg==0) {
          //攻撃をさせる乱数　高くするほど攻撃頻度の期待は下がる
          rnd = getRandomInt(30);

          if(rnd==1){
            atack1_flg = 30;
            console.log("flg 1");
            //b_cnt =0;
          }else if (rnd==2) {
            atack2_flg = 30;
            console.log("flg 2");
            //f_cnt =0;
          }else if (rnd==3) {
            atack3_flg = 30;
            console.log("flg 3");
          }
        }

        //ここにボスの攻撃処理をかく

        //パターン１　シャドーボールで攻撃
        if (atack1_flg <= 30 && atack1_flg > 0) {
          console.log("shadow ball");
          enemydx = 0;
          if(atack1_flg >= 15){
            this.frame =8;
            atack1_flg--;
            return;
          }else if (atack1_flg > 1) {
            this.frame = 9
            atack1_flg--;
            return;
          }else if(atack1_flg == 1){
            //atack1_flg = 0の時
            //弾を作成
            this.frame = 9
            b_bullet = new BossBullet();
            scene.addChild( b_bullet );
            atack1_flg--;
            console.log("atack1_flg : " + atack1_flg);

          }
        }

        //パターン2　小さな火柱を生成　弾速早い
        if (atack2_flg <= 30 && atack2_flg > 0) {
          console.log("flame");
          enemydx = 0;
          if(atack2_flg >= 5){
            this.frame =5;
            //console.log("構え");
            atack2_flg--;
            return;
          }else if (atack2_flg > 1) {
            //console.log("発射手前");

            this.frame = 6;
            atack2_flg--;
            return;
          }else if (atack2_flg == 1) {
            //atack1_flg = 0の時
            //弾を作成
            //弾を作成
            this.frame = 6;
            b_fire = new BossFire();
            scene.addChild( b_fire );
            atack2_flg--;
            console.log("atack2_flg : " + atack2_flg);
          }

        }

        //パターン2　大きな火柱を生成　弾速遅い
        if (atack3_flg <= 30 && atack3_flg > 0) {
          console.log("Bigflame");
          enemydx = 0;
          if(atack3_flg >= 5){
            this.frame =5;
            //console.log("構え");
            atack3_flg--;
            return;
          }else if (atack3_flg > 1) {
            //console.log("発射手前");

            this.frame = 7;
            atack3_flg--;
            return;
          }else if (atack3_flg == 1) {
            //atack1_flg = 0の時
            //弾を作成
            //弾を作成
            this.frame = 7;
            b_bfire = new BossBigFire();
            scene.addChild( b_bfire );
            atack3_flg--;
            console.log("atack3_flg : " + atack3_flg);
          }

        }

        //ボスの移動処理
        if (Math.abs(Gilbert.x-16 - this.x-15)<200 ) {
          enemydx = 0;
          this.frame = 3;
          if (Gilbert.x-16 > this.x-15) {
            this.scaleX = -1;
          }
          //return;

        }else{
          //ギルバートに向かって歩き続ける（ギルバートが右側の時の処理）
          if(Gilbert.x-16 > this.x-15){
            if(cnt <= 5){
              enemydx = 3;
              this.frame =4;
            }
            if (cnt <= 10 && cnt>5) {
              enemydx = 0;
              this.frame = 3
            }
            if (cnt <= 15 && cnt>10) {
              enemydx = 3;
              this.frame = 2
            }
            if (cnt <= 20 && cnt>15) {
              enemydx = 0;
              this.frame = 3
            }
            if (cnt >20) {
              cnt = 0;
            }
            cnt++;
            this.scaleX = -1;
            //this.frame = (this.age%3) + 2;
          }
          //ギルバートが左側の時の処理
          if(Gilbert.x-16 < this.x-15){
            if(cnt <= 5){
              enemydx = -3;
              this.frame =4;
            }
            if (cnt <= 10 && cnt>5) {
              enemydx = 0;
              this.frame = 3
            }
            if (cnt <= 15 && cnt>10) {
              enemydx = -3;
              this.frame = 2
            }
            if (cnt <= 20 && cnt>15) {
              enemydx = 0;
              this.frame = 3
            }
            if (cnt>20) {
              cnt = 0;
            }
            cnt++;
            this.scaleX = 1;
          }
        }


        this.x += enemydx;
        //console.log(cnt);
        return;
      }
    });


    var enemy1 = new BossEnemy();


    scene.addChild(backgroundMap);
    //stage.addChild(goal);
    scene.addChild(enemy1);
    scene.addChild(Gilbert);
    //stage.addChild(enemy2);

    //scene.addChild(stage);

    return scene;
  }

  game.start(); //ゲームスタート
});
