<template>
  <div class="calculator">
    <span class="calBar" style="grid-area: change"></span>
    <span class="calBar" style="grid-area: minimize"></span>
    <span class="calBar" style="grid-area: maximize"></span>
    <span class="calBar" style="grid-area: close"></span>

    <div class="result" style="grid-area: result">
      {{ equation }}
    </div>

    <button class="calculatorTool" style="grid-area: prescribing" @click="prescribing">√</button>
    <button class="calculatorTool" style="grid-area: square" @click="square">x²</button>
    <button class="calculatorTool" style="grid-area: clear" @click="clear">C</button>
    <button class="calculatorTool" style="grid-area: delete" @click="del"></button>
    <button class="calculatorTool" style="grid-area: left" @click="append('(')">（</button>
    <button class="calculatorTool" style="grid-area: right" @click="append(')')">）</button>
    <button class="calculatorTool" style="grid-area: plus-minus" @click="calculateToggle">±</button>
    <button class="calculatorTool" style="grid-area: add" @click="append('+')">+</button>
    <button class="calculatorTool" style="grid-area: subtract" @click="append('-')">-</button>
    <button class="calculatorTool" style="grid-area: multiply" @click="append('×')">×</button>
    <button class="calculatorTool" style="grid-area: divide" @click="append('÷')">÷</button>
    <button class="calculatorTool" style="grid-area: equal" @click="calculate">=</button>

    <button v-for="(item,index) in number" :style="item" @click="append(index)" :key="index">{{index}}</button>

    <button style="grid-area: dot" @click="append('.')">.</button>
  </div>


</template>

<script>
  export default {
    name: 'Calculator',
    data(){
      return{
        equation: '0',  // 最终答案
        dec: false, // 判断是否是小数和是否出现了两位小数点
        poer: false, // 判断是否是功能键和是否出现两次功能键
        isStarted: false, // 是否已经开始输入数字
        number:['grid-area: number-0','grid-area: number-1','grid-area: number-2','grid-area: number-3','grid-area: number-4','grid-area: number-5','grid-area: number-6'
          ,'grid-area: number-7','grid-area: number-8','grid-area: number-9'
        ],
      }
    },
    methods: {
      // 检测字符为+ - × ÷
      isOperator(character) {
        return ['+', '-', '×', '÷'].indexOf(character) > -1
      },
      // 点击功能键
      append(character) {
        // 等于0并没有功能键时
        if (this.equation === '0' && !this.isOperator(character)) {
          if (character === '.') {
            // 如果输入小数点则保留0
            this.equation += '' + character
            this.dec = true
          } else {
            // 如果不是，则将0替换为数字
            this.equation = '' + character
          }
          this.isStarted = true
          return
        }

        // 输入数字
        if (!this.isOperator(character)) {
          if (character === '.' && this.dec) {
            return
          }

          if (character === '.') {
            this.dec = true //防止输入两次小小数点
            this.poer = true // 同时不能输入功能键
          } else {
            this.poer = false
          }

          this.equation += '' + character
        }

        // 输入功能键后
        if (this.isOperator(character) && !this.poer) {
          this.equation += '' + character
          this.dec = false // 允许再次输入小数点
          this.poer = true // 不能输入功能键
        }
      },
      del(){
        this.equation = this.equation.substring(0,this.equation.length - 1);
      },
      // = 将乘除通过全局正则转化为数字并通过隐式转化为数值
      calculate() {
        function noEval(str) {
          const Fn = Function;  //一个变量指向Function，防止有些前端编译工具报错
          return new Fn('return ' + str)();
        }
        let result = this.equation.replace(new RegExp('×', 'g'), '*').replace(new RegExp('÷', 'g'), '/')
        .replace(new RegExp('（','g'),'(').replace(new RegExp('）','g'),')')
        this.equation = parseFloat(noEval(result).toFixed(9)).toString()
        this.dec = false
        this.poer = false
      },
      // +/-
      calculateToggle() {
        if (this.poer || !this.isStarted) {
          return
        }
        this.equation = this.equation + '* -1'
        this.calculate()
      },
      // 开根
      prescribing(){
        if (this.poer || !this.isStarted) {
          return
        }
        this.calculate()
        this.equation = Math.sqrt(this.equation).toFixed(9)
      },
      // 平方
      square(){
        if (this.poer || !this.isStarted) {
          return
        }
        this.calculate()
        this.equation = Math.pow(this.equation,2)
      },
      // 清空
      clear() {
        this.equation = '0'
        this.dec = false
        this.poer = false
        this.isStarted = false
      }
    }
  };
</script>

<style scoped>
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #eee;
  }

  @font-face {
    font-family: 'icomoon';
    src:  url('./fonts/icomoon.eot?snsrp8');
    src:  url('./fonts/icomoon.eot?snsrp8#iefix') format('embedded-opentype'),
    url('./fonts/icomoon.ttf?snsrp8') format('truetype'),
    url('./fonts/icomoon.woff?snsrp8') format('woff'),
    url('./fonts/icomoon.svg?snsrp8#icomoon') format('svg');
    font-weight: normal;
    font-style: normal;
  }


  .calculator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    --button-width: 75px;
    --button-height: 60px;

    display: grid;
    grid-template-areas:"change minimize maximize close"
    "result result result result"
    "prescribing square clear delete"
    "left right plus-minus divide"
    "number-7 number-8 number-9 multiply"
    "number-4 number-5 number-6 subtract"
    "number-1 number-2 number-3 add"
    "number-0 number-0 dot equal";
    grid-template-columns: repeat(4, var(--button-width));
    grid-template-rows: repeat(8, var(--button-height));

  }

  .calculator .calBar{
    line-height: var(--button-height);
  }

  .calculator .calBar:hover{
    background-color: rgb(235, 234, 240);
  }

  .calculator span,
  .calculator button{
    margin: 0;
    padding: 0;
    display: block;
    text-align: center;
  }


  .calculator span {
    font-family: 'icomoon';
    /*height: 30px;*/
    line-height: 30px;
    background-color: #fff;
  }

  .calculator button {
    font-family: 'icomoon';
    border: 1px solid rgb(213, 213, 215);
    outline: none;
    font-size: 24px;
    font-weight: normal;
    color: #999;
    background-color: #fff;
  }

  .calculator button:active {
    background-color: rgb(220, 233, 243);
  }

  .calculator .calculatorTool{
    background-color: rgb(235, 234, 240);
  }

  .calculator .calculatorTool:active{
    background-color: rgb(198, 208, 229);
  }

  .result {
    text-align: right;
    line-height: var(--button-height);
    font-size: 45px;
    padding: 0 20px;
    color: #666;
    background-color: #fff;
  }

  .headBar{
    cursor: default;
  }
</style>