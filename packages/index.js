// キーボードの入力状態を記録する配列の定義
var input_key_buffer = new Array();

// キーボードの入力イベントをトリガーに配列のフラグ値を更新させる
window.addEventListener("keydown", handleKeydown);
function handleKeydown(e) {
  console.log("key down : " + e.keyCode);
  input_key_buffer[e.keyCode] = true;
}

window.addEventListener("keyup", handleKeyup);
function handleKeyup(e) {
  console.log("key up : " + e.keyCode);
  input_key_buffer[e.keyCode] = false;
}

// canvas要素の取得
const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext("2d");

// 画像を表示するの座標の定義 & 初期化
var x = 0;
var y = 0;

// ロード時に画面描画の処理が実行されるようにする
window.addEventListener("load", update);

// 画面を更新する関数を定義 (繰り返しここの処理が実行される)
function update() {
  // 画面全体をクリア
  ctx.clearRect(0, 0, 640, 480);

  // 入力値の確認と反映
  if (input_key_buffer[88]) {
    // 左が押されていればx座標を1減らす
    x = x - 1;
  }
  if (input_key_buffer[90]) {
    // 右が押されていればx座標を1増やす
    x = x + 1;
  }

  // 主人公の画像を表示
  var image = new Image();
  image.src = "../assets/images/base.png";
  ctx.drawImage(image, x, y, 32, 32);

  // 再描画
  window.requestAnimationFrame(update);
}

// 敵キャラの初期座標を定義
var enemy1x = 0;
var enemy1y = 100;

//敵キャラのフレームごとの移動量
var enemy1dx = 0.5;
var enemy1dy = 0;

// 座標を更新する
function sumEnemy1() {
    if(enemy1x >= canvas.width-28 || enemy1x <= -1){
        enemy1dx = -enemy1dx;
    }
    if(enemy1y >= canvas.height-28 || enemy1y <= -1){
        enemy1dy = -enemy1dy;
    }
}

//敵キャラの画像を表示
function drawEnemy1() {
    sumEnemy1();
    
    var image = new Image();
    image.src = "../images/character/enemy1.png";
    ctx.drawImage(image, enemy1x, enemy1y, 28, 28);
    
    enemy1x = enemy1x + enemy1dx;
    enemy1y = enemy1y + enemy1dy;
}

var lives = 5;

//残機の表示
function drawLives() {
    sumLives();
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("残りマリオ: " +lives+"人", 0, 20);
}

//残機計算
function sumLives() {
    //敵キャラとぶつかった時の処理、とりあえず敵キャラがキャンバスの中心に着いた時カウントするものとする
    if(enemy1x == canvas.width/2){
        lives = lives - 1;
        if(!lives) {
            alert("もう復活できないや..."); //思いつかなかったから一応書いといた、消すかも
            document.location.reload(); //ここで最初のページに戻す？
        }
    }
}
