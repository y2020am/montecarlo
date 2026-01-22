///////////////////////////////////////////////////////////////
// オブジェクトの取得

//layer
const canvasBase = document.getElementById("canvasBase");
const canvasDot = document.getElementById("canvasDot");

const ctx = canvasBase.getContext("2d");
const ctxdot = canvasDot.getContext("2d");

const text01 = document.getElementById("text01");
const button = document.getElementById("button");
const title = document.getElementById("title");

const cls = document.getElementById("cls");


///////////////////////////////////////////////////////////////
// main

let x = 40;			//基準座標
let y = 10;
let xy = 500;		//一辺の長さ
let dx = xy / 5;	//メモリ
let dy = xy / 5;

let count = 0;   // 乱数の累積
let inn = 0;     // 円内の数累積

let isRunning = false; // 二重実行防止用
let timerId = null;    // タイマーID保存用

// 初期表示
setTitle(count, inn);	//タイトルの表示
base();						//グラフ、1/4円弧の表示

//////////////////////////////////////////////////////
// 関数

//タイトルの表示
function setTitle(nrnd, nin) {
    let n1 = nrnd.toString().padStart(5, ' ');
    let n2 = nin.toString().padStart(5, ' ');
    
    // 0で割るのを防ぐ
    let n3 = (nrnd === 0) ? "0.00000000" : (4 * nin / nrnd).toPrecision(10);

    title.textContent = "現在の乱数の数: " + n1 + "　円内数:" + n2 + "　パイ: " + n3;
}

// 形状の描画  四角形、メモリ、円弧
function base() {
    // 線の設定
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.font = "16px serif"; // フォントサイズ調整

    ctx.beginPath();

    // 四角形
    ctx.strokeRect(x, y, xy, xy);

    // メモリ　x方向　y方向
    for (let i = 0; i <= 5; i++) { //i<=5 まで回して0と1を描画
        // ｘ軸
        ctx.moveTo(x + dx * i, y + xy);
        ctx.lineTo(x + dx * i, y + xy + 10); // 外側へ向ける
        ctx.fillText((i / 5).toFixed(1), x + dx * i - 10, y + xy + 30);
        
        // ｙ軸
        ctx.moveTo(x, y + xy - dy * i);
        ctx.lineTo(x - 10, y + xy - dy * i); // 外側へ向ける
        ctx.fillText((i / 5).toFixed(1), x - 35, y + xy - dy * i + 5);
    }
    ctx.stroke(); // 描画
    ctx.closePath();

    // 円弧 (中心は左下、描画は右上象限)
    ctx.beginPath();
    ctx.arc(x, y + xy, xy, Math.PI * 1.5, 0); // 270度(上)から0度(右)へ
    ctx.lineWidth = 2;			//線幅
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
}

// 乱数を発生して表示
button.addEventListener("click", rand);
function rand() {
    // 既に実行中なら無視
    if (isRunning) return;
    
    //マイナスの禁止
    let N = Number(text01.value);
    if (!N || N <= 0) {
        alert("正の数字を入力してください");
        return;
    }

    isRunning = true;	//実行
    let ratio = xy;		//四角形の1辺の長さに合わせるため
//    let currentBatchCount = 0; // 今回の実行分カウンター


    timerId = window.setInterval(function () {
        // 高速化のため、1フレームで10回計算・描画する
//        for (let k = 0; k < 10; k++) {
//            if (currentBatchCount >= N) break;

            //乱数の発生
            let rx = Math.random(); 
            let ry = Math.random();

            let color;
            // 円の方程式: x^2 + y^2 <= 1
            if (rx * rx + ry * ry <= 1) {
                color = "red";		//円内はRED
                inn++;
            } else {
                color = "blue";		//円外はBLUE
            }
//            count++;
//            currentBatchCount++;

            // 点の描画
            ctxdot.beginPath();
            // 半径は1pxくらいで十分見える
            ctxdot.fillStyle = color; // 塗りつぶし
            ctxdot.arc(x + ratio * rx, y + xy - ratio * ry, 2, 0, Math.PI * 2);
            ctxdot.fill();
            ctxdot.closePath();
  //      }

        // 画面更新
        setTitle(count, inn);

        // 終了判定
//        if (currentBatchCount >= N) {
//            window.clearInterval(timerId);
//            isRunning = false;
//        }
			//終了判定
			if(count>=N) //回数が完了なのでタイマー終了
				window.clearInterval(timerId);
			//カウントUP
			count++;
			
    }, 500);  //500ms
}

// リセット処理
cls.addEventListener("click", clss);
function clss() {
    // タイマーが動いていたら止める
    if(timerId) clearInterval(timerId);
    isRunning = false;

    // カウンターリセット
    count = 0;
    inn = 0;
    
    // ドット描画レイヤーをクリア
    // canvasDotの大きさ分すべて消す
    ctxdot.clearRect(0, 0, canvasDot.width, canvasDot.height);
    // タイトル更新
    setTitle(count, inn);
	 //テキストボックスのクリア
	 text01.value = "";

}
