//おまじない
enchant();
 
//変数宣言
var game;
 
//Webページが読み込まれたら
addEventListener( 'load', function() {
	game = new Game(320,320);	//ゲームオブジェクトの作成
 
	//ゲームオブジェクトが読み込まれたら
	game.addEventListener( 'load', function() {
		game.pushScene( game.mainScene() );		//シーンをゲームに追加する
	} );
 
	//メインシーン
	game.mainScene = function() {
		var scene = new Scene();		//シーンを作成
		scene.backgroundColor = 'black';	//シーンを黒く塗りつぶす
		return scene;
	}
 
	game.start();	//ゲームスタート
} );