enchant();

//変数宣言
var game;

//Webページが読み込まれたら
addEventListener( 'load', function() {
    game = new Core(480,480);   //ゲームオブジェクトの作成
    // フレームレートの設定。15fpsに設定
    game.fps = 15;//ゲーム画面のフレームレート　毎秒１５枚のアニメーションで構成
    game.preload( '../img/character/Gilbert2.png' );    //画像をプリロード
    game.preload('../img/map/map1.png');
    game.preload('../img/map/map2.png');
    game.preload('../img/bullet/icon0.png');
    game.preload('../img/flag/flag_red_transparent.png')
    game.preload('../img/character/enemy1.png');
    game.preload('../img/character/enemy2.png');
    game.keybind( 'Z'.charCodeAt(0), 'a' );     //Zキー入力をaボタンとする
		game.keybind( 'Q'.charCodeAt(0), 'b' );     //Qキー入力をbボタンとする

    var bgmsound = Sound.load('../bgm/bgm1.mp3');
         bgmsound.volume = 0.5;
    var jumpsound = Sound.load('../bgm/jump.mp3');
    var bulettsound = Sound.load('../bgm/laser.mp3');


    //マップとの接触判定　いらない
    /*
    function bottom_collisionCheck(mapName,splite){
        if(mapName.hitTest(splite.x+32 ,splite.y + 16 )){
            console.log("通れない："+ (splite.x + 32));
            return true;
        }else{
            return false;
        }
    }
    */

  game.onload = function(){
      //game.pushScene()
      game.pushScene( game.titleScene() );      //シーンをゲームに追加する
      //bgm.play();
  }


	//ポーズ（一時停止）シーン
  game.pauseScene = function(){
    var scene = new Scene();
    scene.backgroundColor = 'rgba(0,0,0,0.5)';
    msg1 = new Label();
  	msg1.color = 'white';
  	msg1.font = "normal normal 30px/1.0 monospace";
  	msg1.text = "Pause!";
    msg1.moveTo(180,150);
	  scene.addChild(msg1);
		msg2 = new Label();
  	msg2.color = 'white';
  	msg2.font = "normal normal 30px/1.0 monospace";
  	msg2.text = "Tap 'Z' to Restart!";
    msg2.moveTo(120,250);
	  scene.addChild(msg2);
    //console.log("pause!");
    scene.addEventListener(Event.ENTER_FRAME, function(e) {
      if ( game.input.a ) {
        bulettsound.play();
        bgmsound.pause();
        game.popScene();
      }
    });
    return scene;
  }

	game.titleScene = function(){
    var scene = new Scene();
    scene.backgroundColor = 'black';
    score = new Label();
  	score.color = 'white';
  	score.font = "normal normal 30px/1.0 monospace";
  	score.text = "Click to start!";
    score.moveTo(150,225);
	  scene.addChild(score);
    scene.ontouchstart = function(){
      //console.log("startTime = " + startTime);    // コンソールに表示
      game.replaceScene(game.mainScene() );
    };
    return scene;
  }

  //ゲームオーバー、デバッグ用なので変えてもいいし消しても大丈夫
  game.gameOverScene = function() {
        var scene = new Scene();
        scene.backgroundColor = 'black';
        var gameOverLabel = new Label( 'GAME OVER' );
        gameOverLabel.color = 'white';
        gameOverLabel.font = "32px 'Russo One', sans-serif";
        gameOverLabel.moveTo( 130, 225 );
        scene.addChild( gameOverLabel );

        return scene;
    }
    //メインシーン
    game.mainScene = function() {
        var scene = new Scene();        //シーンを作成
        //scene.backgroundColor = '#00BFFF';    //ブロックおいてないとこの色（前まで白色だったとこ）
    scene.backgroundColor = 'skyblue';

    //========================
    //  マップデータ見栄え用　マップ画像から左上から0,1,0,2.....と表示するマップチップを変更できる

    /*map1.png用
    var block = [
        [35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [35,35,35, 2, 2, 2,35,35, 2, 2,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [35,35,35,35,35,35,35,35, 2, 2, 2,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [35,35,35,35,35,35,35, 2, 2, 2, 2, 2,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [35,35,35,35,35,35, 2, 2, 2, 2, 2, 2, 2,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
    */
		//map2.png用
    var block = [
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8,32,32,32, 8, 8,32,32, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8, 8,32,32,32, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8, 8,32,32,32,32,32, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [ 8, 8, 8, 8, 8, 8,32,32,32,32,32,32,32, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      [16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16],
      [16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16],
      [16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16]
    ];


		//マップデータ判定用　0は背景、1は壁、床などの当たり判定がある。左端は見えない壁作ってこれ以上行けないように
    var col_block = [
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
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

    //残機と制限時間、スコアのラベル
    var livesLabel = new Label();
    livesLabel.font = "16px 'Russo One', sans-serif";
    var timesLabel = new Label();
    timesLabel.font = "16px 'Russo One', sans-serif";
    var scoresLabel = new Label();
    scoresLabel.font = "16px 'Russo One', sans-serif";

    //制限時間表示
    game.time = 300;
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
        livesLabel.text = '残機：' + Gilbert.lives;
        livesLabel.y = 5;
        scene.addChild(livesLabel);
        if (Gilbert.lives === 0) game.replaceScene(game.gameOverScene());

        //スコア表示
        //スコアに関してはどのようにするのか決めてないから後で追加します
        var scores = 0;
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
    var Gil_firstposition = [64,240]//プレイヤーの初期スポーン位置
    Gilbert.image = game.assets["../img/character/Gilbert2.png"];
    Gilbert.x = Gil_firstposition[0];
    Gilbert.y = Gil_firstposition[1];
    Gilbert.prey = Gil_firstposition[1];
    //Gilbert.ay = 50;
    Gilbert.frame = 1;//プレイヤーのアニメーションの画像　これを変更するとプレイヤーの画像が変わってモーションが作れる（歩くとか）
    Gilbert.jumpFlg = false;//ジャンプしてるかどうかのフラグ
    Gilbert.jumpingFlg = false;//ジャンプ中がどうかのフラグ
    Gilbert.jumpPower = 8; //プレイヤーのジャンプ力　大きくするほど高く飛べる
    Gilbert.lives = 5; // 残機数
    Gilbert.addEventListener(Event.ENTER_FRAME, function(e) {
                //bgm.loop();
        bgmsound.play();

				//----------------------------
	      //Qキーで一ゲームを一時停止
	      //----------------------------
	      if ( game.input.b ) {
	        bulettsound.play();
	        bgmsound.pause();
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
            
            pair[0].remove();
            pair[1].remove();

        });

        //BulletクラスとEnemy2クラスとの当たり判定
        Bullet.intersect(Enemy2).forEach(function(pair)
{
            //pair[0]: Bulletのインスタンス
            //pair[1]: Enemy1のインスタンス
            
            pair[0].remove();
            pair[1].remove();

        });


        //===========================================
        //ゴール処理
        //===========================================

        if(Gilbert.x >= goal.x){
            goal_flag = true;
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
                alert("Game Clear");
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
            
            //無敵時間管理
            if(invincible_flag == true){ //無敵フラグがtrueなら
                invincible_count ++ //無敵時間をカウント
            }
            if(invincible_count == 45){ //無敵時間が3秒になったら
                invincible_flag = false; //無敵を解除
                invincible_count = 0; //無敵時間を初期化
                Gilbert.opacity = 1; //Gilbertの透明度を1にする
            }
            //Gilbertとの当たり判定
            if(invincible_flag == false){
                if(Gilbert.x - this.x > -25 && Gilbert.x - this.x < 25){
                    if(Gilbert.y - this.y > -21 && Gilbert.y - this.y < 21){
                        Gilbert.lives -= 1; //Gilbertの残機を1減らす
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




    var Enemy2 = Class.create( Sprite, {
        initialize: function() {
            Sprite.call(this, 20, 30);
            this.image = game.assets["../img/character/enemy2.png"];
            this.moveTo(enemy2x, enemy2y);
            this.frame = 1;
        },
        onenterframe: function() {
            this.y += enemydy;
            this.frame = (this.age%15) + 1;
            if(this.y >= enemy2max || this.y <= enemy2min){
                enemydy = -enemydy;
            }
            
            //無敵時間管理
            if(invincible_flag == true){ //無敵フラグがtrueなら
                invincible_count ++ //無敵時間をカウント
            }
            if(invincible_count == 45){ //無敵時間が3秒になったら
                invincible_flag = false; //無敵を解除
                invincible_count = 0; //無敵時間を初期化
                Gilbert.opacity = 1; //Gilbertの透明度を1にする
            }
            //Gilbertとの当たり判定
            if(invincible_flag == false){
                if(Gilbert.x - this.x > -25 && Gilbert.x - this.x < 25){
                    if(Gilbert.y - this.y > -21 && Gilbert.y - this.y < 21){
                        Gilbert.lives -= 1; //Gilbertの残機を1減らす
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


    //var stage = new Group();//マップとキャラクターを同時に管理するためにグループとして統括（スクロールするときに必要）


    stage.addChild(backgroundMap);
    stage.addChild(goal);
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


  game.start(); //ゲームスタート

});