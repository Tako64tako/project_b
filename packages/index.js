enchant();

//変数宣言
var game;

//Webページが読み込まれたら
addEventListener( 'load', function() {
	game = new Core(320,320);	//ゲームオブジェクトの作成
    // フレームレートの設定。15fpsに設定
    game.fps = 15;//ゲーム画面のフレームレート　毎秒１５枚のアニメーションで構成
    game.preload( '../img/character/Gilbert2.png' );	//画像をプリロード
    game.preload('../img/map/map1.png');
    game.preload('../img/map/map2.png');
    game.preload('../img/bullet/icon0.png');
    game.preload('../img/character/enemy1.png');
    game.preload('../img/character/enemy2.png');
    game.keybind( 'Z'.charCodeAt(0), 'a' );     //Zキー入力をaボタンとする

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
      game.pushScene( game.titleScene() );		//シーンをゲームに追加する
      //bgm.play();
  }

  game.titleScene = function(){
    var scene = new Scene();
    scene.backgroundColor = 'black';
    score = new Label();
  	score.color = 'white';
  	score.font = "normal normal 30px/1.0 monospace";
  	score.text = "Tap to start!";
    score.moveTo(70,150);
	  scene.addChild(score);
    scene.ontouchstart = function(){
      //console.log("startTime = " + startTime);    // コンソールに表示
      game.replaceScene(game.mainScene() );
    };
    return scene;
  }

    //メインシーン
	game.mainScene = function() {
		var scene = new Scene();		//シーンを作成
		//scene.backgroundColor = '#00BFFF';	//ブロックおいてないとこの色（前まで白色だったとこ）
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
    var bullet_count = 0;       //弾の間隔を数える
    var bullet_flag = true;     //間隔が10フレームあいたかを判断
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
    Gilbert.addEventListener(Event.ENTER_FRAME, function(e) {
				//bgm.loop();
        bgmsound.play();
        if (game.input.up && Gilbert.jumpingFlg === false) {
           Gilbert.jumpFlg = true;
           jumpsound.play();
        }

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

        if(bullet_flag==true){

            if ( game.input.a ) {
              bulettsound.play();
              hitABullet();
            }
        //前に弾を打った時から10フレームが経過かつ'zキーが押された時'
            var bullet;
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

    });

    /**弾のクラス**/
    var Bullet = Class.create( Sprite, {
      initialize: function() {

        var bulletX, bulletY;	//弾のX座標とY座標
        Sprite.call( this, 16, 16 );	//Spriteクラスのメソッドを、thisでも使えるようにする
            this.image = game.assets[ '../img/bullet/icon0.png' ];	//スプライトの画像ファイルを指定
            this.frame = 50

        //プレイヤーの向きによって弾の位置や動かす方向を変える
        if ( Gilbert.scaleX >= 0 ) {
	        this.speed = 10;
                bulletX = Gilbert.x + 25 + stage.x;
                Gilbert.frame = 59;
        } else {
	        this.speed = -10;
                bulletX = Gilbert.x - 9.25 + stage.x;
                Gilbert.frame = 59;
        }
        bulletY = Gilbert.y + 6;

        this.moveTo( bulletX, bulletY );	//弾の位置
      },
      onenterframe: function() {
            this.x += this.speed;	//弾の移動
            if(this.x > Gilbert.x + 200 || this.x < -20){       //弾の削除

        };
        
        //敵キャラ１初期設定
        var enemy1x = 320;
        var enemy1y = 245;
        var enemydx = 3;
        var enemy1min = enemy1x - 50;
        var enemy1max = enemy1x + 50;
        
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
            }
        });
        
        enemy1 = new Enemy1();
        
        stage.addChild(enemy1);
        
        //敵キャラ２初期設定
        var enemy2x = 500;
        var enemy2y = 145;
        var enemydy = 3;
        var enemy2min = enemy2y - 50;
        var enemy2max = enemy2y + 50;
        
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
            }
        });
        
        enemy2 = new Enemy2();
        
        stage.addChild(enemy2);
        
                        this.remove();

            }
        }
    );


    var stage = new Group();//マップとキャラクターを同時に管理するためにグループとして統括（スクロールするときに必要）
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


  game.start();	//ゲームスタート

});
