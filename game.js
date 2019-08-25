/**
 * 该类可存储历史数据，用于撤回操作等
 * @author yuwei
 * @since 2019.8.22
 * @location morgan stanley
 * @constructor
 */
function Backup(len){

    //最多保存数量
    this.maxLen=len;
    //保存内容，
    // index越小，内容越久远， 最后一个内容最新
    this.history=[];
    /**
     * 保存某一步的状态
     * @param matrix 4*4矩阵
     */
    this.save=function(matrix){
        //初始矩阵
        let m = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        //需要深拷贝
        for(let i=0;i<4;i++){
            for(let j=0;j<4;j++){
                m[i][j]=matrix[i][j];
            }
        }

        this.history.push(m);
        //如果保存数量超过最大值，则去除最久远的
        if(this.history.length>this.maxLen){
            this.history.splice(0,1);
        }
    }

    /**
     * 撤销当前操作，返回最近的一个状态
     */
    this.undo=function () {
        return this.history.pop();
    }
}


//游戏的状态信息（初始化，合并，结束）
function Game() {

    //实例化 撤销系统, 最多保存10条历史记录
    //@author yuwei
    this.backup=new Backup(10);

    //初始矩阵
    this.gameArray = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    //初始分数为0
    this.score = 0;
    //初始化矩阵为0
    this.init = function () {
        for (let i = 0; i < this.gameArray.length; i++) {
            for (let j = 0; j < this.gameArray[i].length; j++) {
                this.gameArray[i][j] = 0;
            }
        }
        //初始随机生成两个2,不能有覆盖
        this.random();
        this.random();
        //初始化分数为0
        this.score=0;
    };
    //随机生成1个2
    this.random = function () {
        while (true) {
            let i = Math.floor(4 * Math.random());
            let j = Math.floor(4 * Math.random());
            if (this.gameArray[i][j] === 0) {
                this.gameArray[i][j] = 2;
                break;
            }
        }
    };
    //向左合并（一行）
    this.runLeft = function (arr) {
        //第二位
        if (arr[1] !== 0) {
            //第一位等于0时
            if (arr[0] === 0) {
                //把第二位移到第一位，第二位置0
                arr[0] = arr[1];
                arr[1] = 0;
                //第一位不等于0时
            } else {
                //如果第二位和第一位相等，则相加，并把第二位置为0
                if (arr[0] === arr[1]) {
                    arr[0] = arr[0] + arr[1];
                    arr[1] = 0;
                }
            }
        }
        //第三位
        if (arr[2] !== 0) {
            for (let i = 2; i >= 0; i--) {
                if (arr[i - 1] === 0) {
                    arr[i - 1] = arr[i];
                    arr[i] = 0;
                } else if (arr[i - 1] === arr[i]) {
                    arr[i - 1] = arr[i - 1] + arr[i];
                    arr[i] = 0;
                    break;
                } else {
                    break;
                }
            }
        }
//第四位
        if (arr[3] !== 0) {
            for (let i = 3; i >= 0; i--) {
                if (arr[i - 1] === 0) {
                    arr[i - 1] = arr[i];
                    arr[i] = 0;
                } else if (arr[i - 1] === arr[i]) {
                    arr[i - 1] = arr[i - 1] + arr[i];
                    arr[i] = 0;
                    break;
                } else {
                    break;
                }
            }
        }
        return arr;
    }
    //向右合并（一行）
    this.runRight = function (arr) {
        //第三位[0,0,2,2]
        if (arr[2] !== 0) {
            //第四位等于0
            if (arr[3] === 0) {
                arr[3] = arr[2];
                arr[2] = 0;
            } else if (arr[3] === arr[2]) {
                arr[3] = arr[3] + arr[2];
                arr[2] = 0;
            }
        }
        //第二位
        if (arr[1] !== 0) {
            for (let i = 1; i < arr.length; i++) {
                if (arr[i + 1] === 0) {
                    arr[i + 1] = arr[i];
                    arr[i] = 0;
                } else if (arr[i] === arr[i + 1]) {
                    arr[i + 1] = arr[i + 1] + arr[i];
                    arr[i] = 0;
                    break;
                } else {
                    break;
                }
            }
        }
        //第一位
        if (arr[0] !== 0) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i + 1] === 0) {
                    arr[i + 1] = arr[i];
                    arr[i] = 0;
                } else if (arr[i] === arr[i + 1]) {
                    arr[i + 1] = arr[i + 1] + arr[i];
                    arr[i] = 0;
                    break;
                } else {
                    break;
                }
            }
        }
        return arr;
    }
    //向上合并（一行）
    this.runUp = function (arr, col) {
        //第二位
        if (arr[1][col] !== 0) {
            if (arr[0][col] === 0) {
                arr[0][col] = arr[1][col];
                arr[1][col] = 0;
            } else if (arr[0][col] === arr[1][col]) {
                arr[0][col] = arr[0][col] + arr[1][col];
                arr[1][col] = 0;
            }
        }
        //第三位
        if (arr[2][col] !== 0) {
            for (let i = 2; i > 0; i--) {
                if (arr[i - 1][col] === 0) {
                    arr[i - 1][col] = arr[i][col];
                    arr[i][col] = 0;
                } else if (arr[i - 1][col] === arr[i][col]) {
                    arr[i - 1][col] = arr[i - 1][col] + arr[i][col];
                    arr[i][col] = 0;
                    break;
                } else {
                    break;
                }
            }
        }
        //第四位
        if (arr[3][col] !== 0) {
            for (let i = 3; i > 0; i--) {
                if (arr[i - 1][col] === 0) {
                    arr[i - 1][col] = arr[i][col];
                    arr[i][col] = 0;
                } else if (arr[i - 1][col] === arr[i][col]) {
                    arr[i - 1][col] = arr[i - 1][col] + arr[i][col];
                    arr[i][col] = 0;
                    break;
                } else {
                    break;
                }
            }
        }
        return arr;
    }
    //向下合并（一行）
    this.runDown = function (arr, col) {
        //第二位
        if (arr[2][col] !== 0) {
            if (arr[3][col] === 0) {
                arr[3][col] = arr[2][0];
                arr[2][col] = 0;
            } else if (arr[3][col] === arr[2][col]) {
                arr[3][col] = arr[3][col] + arr[2][col];
                arr[2][col] = 0;
            }
        }
        //第一位
        if (arr[1][col] !== 0) {
            for (let i = 1; i < arr.length - 1; i++) {
                if (arr[i + 1][col] === 0) {
                    arr[i + 1][col] = arr[i][col];
                    arr[i][col] = 0;
                } else if (arr[i + 1][col] === arr[i][col]) {
                    arr[i + 1][col] = arr[i + 1][col] + arr[i][col];
                    arr[i][col] = 0;
                    break;
                } else {
                    break;
                }
            }
        }
        // //第零位
        if (arr[0][col] !== 0) {
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i + 1][col] === 0) {
                    arr[i + 1][col] = arr[i][col];
                    arr[i][col] = 0;
                } else if (arr[i + 1][col] === arr[i][col]) {
                    arr[i + 1][col] = arr[i + 1][col] + arr[i][col];
                    arr[i][col] = 0;
                    break;
                } else {
                    break;
                }
            }
        }
        return arr;
    }

    //进行游戏，合并数字
    this.run = function (direction) {
        //备份上一个状态
        //@author yuwei
        //@since 2019.8.22
        this.backup.save(this.gameArray);
        // console.log(this.backup.history)


        //判断方向
        if (direction === "left") {
            for (let i = 0; i < this.gameArray.length; i++) {
                this.runLeft(this.gameArray[i]);
            }
        } else if (direction === "right") {
            for (let i = 0; i < this.gameArray.length; i++) {
                this.runRight(this.gameArray[i]);
            }
        } else if (direction === "up") {
            for (let i = 0; i < this.gameArray.length; i++) {
                this.runUp(this.gameArray, i);
            }
        } else if (direction === "down") {
            for (let i = 0; i < this.gameArray.length; i++) {
                this.runDown(this.gameArray, i);
            }
        }
    }
    //找矩阵中最大数
    this.calculateScore = function () {
        let max = 0;
        for (let i = 0; i < this.gameArray.length; i++) {
            for (let j = 0; j < this.gameArray[i].length; j++) {
                if (this.gameArray[i][j] > max) {
                    max = this.gameArray[i][j];
                }
            }
        }
        return max === 2 ? 0 : max;
    }
    //结束游戏判断
    this.gameOver = function () {
        //false能继续游戏 true结束游戏
        let count = 0;
        for (let i = 0; i < this.gameArray.length; i++) {
            for (let j = 0; j < this.gameArray[i].length; j++) {
                if (this.gameArray[i][j] !== 0) {
                    //左上角
                    if (i - 1 < 0 && j - 1 < 0) {
                        if (this.gameArray[i][j] !== this.gameArray[i + 1][j] && this.gameArray[i][j] !== this.gameArray[i][j + 1]) {
                            count = count + 1;
                        } else {
                            return false;
                        }
                        //上面两个
                    } else if (i - 1 < 0 && j + 1 <= 3 && j + 1 >= 0) {
                        if (this.gameArray[i][j] !== this.gameArray[i][j - 1] && this.gameArray[i][j] !== this.gameArray[i + 1][j] && this.gameArray[i][j] !== this.gameArray[i][j + 1]) {
                            count = count + 1;
                        } else {
                            return false;
                        }
                        //右上角
                    } else if (i - 1 < 0 && j + 1 > 3) {
                        if (this.gameArray[i][j] !== this.gameArray[i][j - 1] && this.gameArray[i][j] !== this.gameArray[i + 1][j]) {
                            count = count + 1;
                        } else {
                            return false;
                        }
                        //左边两个
                    } else if (j - 1 < 0 && i + 1 <= 3) {
                        if (this.gameArray[i][j] !== this.gameArray[i][j + 1] && this.gameArray[i][j] !== this.gameArray[i - 1][j] && this.gameArray[i][j] !== this.gameArray[i + 1][j]) {
                            count = count + 1;
                        } else {
                            return false;
                        }
                        //左下角
                    } else if (i + 1 > 3 && j - 1 < 0) {
                        if (this.gameArray[i][j] !== this.gameArray[i][j + 1] && this.gameArray[i][j] !== this.gameArray[i - 1][j]) {
                            count = count + 1;
                        } else {
                            return false;
                        }
                    } else if (i + 1 > 3 && j + 1 <= 3) {
                        if (this.gameArray[i][j] !== this.gameArray[i - 1][j] && this.gameArray[i][j] !== this.gameArray[i][j - 1] && this.gameArray[i][j] !== this.gameArray[i][j + 1]) {
                            count = count + 1;
                        } else {
                            return false;
                        }
                    } else if (i + 1 > 3 && j + 1 > 3) {
                        if (this.gameArray[i][j] !== this.gameArray[i - 1][j] && this.gameArray[i][j] !== this.gameArray[i][j - 1]) {
                            count = count + 1;
                        } else {
                            return false;
                        }
                    } else if (j + 1 > 3 && i + 1 <= 3) {
                        if (this.gameArray[i][j] !== this.gameArray[i + 1][j] && this.gameArray[i][j] !== this.gameArray[i - 1][j] && this.gameArray[i][j] !== this.gameArray[i][j - 1]) {
                            count = count + 1;
                        } else {
                            return false;
                        }
                    } else if (i - 1 >= 0 && i + 1 <= 3 && j - 1 >= 0 && j + 1 <= 3) {
                        if (this.gameArray[i][j] !== this.gameArray[i - 1][j] && this.gameArray[i][j] !== this.gameArray[i + 1][j] && this.gameArray[i][j] !== this.gameArray[i][j - 1] && this.gameArray[i][j + 1]) {
                            count = count + 1;
                        } else {
                            return false;
                        }
                    }
                } else {
                    //存在0可以继续游戏
                    return false;
                }
            }
        }
        //只要16个都不能移动游戏才结束
        return count === 16;
    }

    /**
     * 撤销当前操作
     * @since 2019.8.22
     * @author yuwei
     * @location morgan stanley
     */
    this.undo=function () {
        //调用备份系统方法，返回上一步操作
        let lastState=this.backup.undo();
        // console.log(lastState);
        //只有当存在备份，才允许撤销
        if(lastState!==undefined){
            this.gameArray=lastState;
        }
    }

}

function UI() {
    //立即执行函数
    (function () {
        /**
        /* 绑定滑动事件
         * @author yuwei 修改滑动事件，将click改为touch
         * @author dora 判断滑动方向算法
         * @since 2019.8.21
         */
        let gameTable=document.getElementById("gameTable");
        // 滑动
        let xDown=0;
        let yDown=0;
        //绑定手指触碰启动
        gameTable.addEventListener("touchstart",function(e){
            e.preventDefault();
            //保存起始位置
            xDown=e.touches[0].screenX;
            yDown=e.touches[0].screenY;
        });
        /**
         * 绑定手指移动事件,移动核心函数
         * 注意，使用touchend作为结束判断条件，不要使用touchmove,会出现抖动情况
         * 一次滑动出发多次事件已修复，
         * @author yuwei
         * @location morgan stanley
         * @since 2019.8.21
         */
        gameTable.addEventListener("touchend",function(e){
            e.preventDefault();
            //保存移动后位置
            let xUp=e.changedTouches[0].screenX;
            let yUp=e.changedTouches[0].screenY;
            //获取移动差值
            let diffX=xUp-xDown;
            let diffY=yUp-yDown;
            if(diffX>=0&&diffY>=0){
                // console.log("右下角")
                if(diffX>diffY){
                    game.run("right");
                }else{
                    game.run("down");
                }
            }else if(diffX>=0&&diffY<=0){
                if(diffX>-diffY){
                    game.run("right");
                }else{
                    game.run("up");
                }
            }else if(diffX<0&&diffY>0){
                if(-diffX>diffY){
                    game.run("left");
                }else{
                    game.run("down");
                }
            }else if(diffX<0&&diffY<0){
                if(diffX>diffY){
                    game.run("left");
                }else{
                    game.run("up");
                }
            }
            //生成随机数
            game.random();
            //计算分数
            let score = game.calculateScore();
            //渲染
            render(game.gameArray, score);
            /**
             * 判断游戏结束
             * Todo 还有bug, 在数字填满了以后会出现卡死的情况，还没定位问题来源 2019.8.21 16：51
             * @since 2019.8.21
             * @author yuwei
             */
            let over=game.gameOver();
            if(over){
                alert("游戏结束");
            }

        });
        //启动游戏调用初始化函数
        //初始化游戏game实例
        let game = new Game();
        game.init();
        render(game.gameArray, 0);
        //监听键盘事件
        document.onkeydown = function (e) {
            if (e.keyCode === 37) {
                game.run("left");
            } else if (e.keyCode === 38) {
                game.run("up");
            } else if (e.keyCode === 39) {
                game.run("right");
            } else if (e.keyCode === 40) {
                game.run("down");
            }
            if (e.keyCode >= 37 && e.keyCode <= 40) {
                game.random();
                let score = game.calculateScore();
                render(game.gameArray, score);
            }
        };

        //点击新游戏初始化矩阵
        let newGame=document.getElementById("newGame");
        newGame.addEventListener("click",function(){
            game.init();
            render(game.gameArray,0);
        });

        //绑定撤销事件
        //@author yuwei
        //@since 2019.8.22
        let menu=document.getElementById("menu");
        menu.addEventListener("click",function () {
            //undo
            game.undo();
            //calculate score again
            let score = game.calculateScore();
            //render
            render(game.gameArray,score)

        })

    })();

    /**
     * 游戏渲染
     * @param gameArray
     * @param score
     */
    function render(gameArray, score) {
        //单元格背景颜色
        let colorMap = {
            "0": "gainsboro",
            "2": "LightYellow",
            "4": "PaleGoldenrod",
            "8": "orange",
            "16": "Tomato",
            "32": "OrangeRed",
            "64": "red",
            "128": "Yellow",
            "256": "Gold",
        };
        //字体颜色
        let fontColor = {
            "dark": "#7B6C65",
            "light": "white",
        };
        let fontSize={
            "twoNum":"50px",
            "threeNum":"43px",
        }
        for (let i = 1; i < 5; i++) {
            for (let j = 1; j < 5; j++) {
                let tableID = document.getElementById("td-" + i + "-" + j);
                //单元格内容
                if (gameArray[i - 1][j - 1] === 0) {
                    tableID.innerHTML = "";
                } else {
                    tableID.innerHTML = gameArray[i - 1][j - 1];
                }
                //单元格背景颜色
                for (let a = 0; a <= 2048; a = a + 2) {
                    if (gameArray[i - 1][j - 1] === a) {
                        tableID.style.backgroundColor = colorMap[a];
                    }
                }
                //单元格字体颜色
                if (gameArray[i - 1][j - 1] <= 4||gameArray[i-1][j-1]>=128) {
                    tableID.style.color = fontColor.dark;
                } else {
                    tableID.style.color = fontColor.light;
                }

                if(gameArray[i-1][j-1].toString().length<=2){
                    tableID.style.fontSize=fontSize.twoNum;
                }else{
                    tableID.style.fontSize=fontSize.threeNum;
                }
            }
        }
        //分数渲染
        let scorePanel = document.getElementById("score");
        scorePanel.innerHTML = score;

    }
}




