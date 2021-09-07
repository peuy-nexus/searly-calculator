<template>
    <div class="calculator">
      <span class="calBar" style="grid-area: change"></span>
      <span class="calBar" style="grid-area: minimize"></span>
      <span class="calBar" style="grid-area: maximize"></span>
      <span class="calBar" style="grid-area: close"></span>

      <div class="result" style="grid-area: result">
        {{ equation }}
      </div>
        <!--
          根号
          平方
          清空 y
          删除一个字符
          左右括号
          转负 y
          加减乘除 y
          小数 y
          等于 y
        -->
      <button class="calculatorTool" style="grid-area: prescribing">√</button>
      <button class="calculatorTool" style="grid-area: square" >x²</button>
      <button class="calculatorTool" style="grid-area: clear" @click="clear">C</button>
      <button class="calculatorTool" style="grid-area: delete" ></button>
      <button class="calculatorTool" style="grid-area: left">﹙</button>
      <button class="calculatorTool" style="grid-area: right">﹚</button>
      <button class="calculatorTool" style="grid-area: plus-minus" @click="calculateToggle">±</button>
      <button class="calculatorTool" style="grid-area: add" @click="append('+')">+</button>
      <button class="calculatorTool" style="grid-area: subtract" @click="append('-')">-</button>
      <button class="calculatorTool" style="grid-area: multiply" @click="append('×')">×</button>
      <button class="calculatorTool" style="grid-area: divide" @click="append('÷')">÷</button>
      <button class="calculatorTool" style="grid-area: equal" @click="calculate">=</button>

      <button v-for="(item,index) in number" :style="item" @click="append(index)" :key="index">{{index}}</button>
   

       <!-- 
       <button style="grid-area: number-0" @click="append(0)">0</button>
       <button style="grid-area: number-1" @click="append(1)">1</button>
       <button style="grid-area: number-2" @click="append(2)">2</button>
       <button style="grid-area: number-3" @click="append(3)">3</button>
       <button style="grid-area: number-4" @click="append(4)">4</button>
       <button style="grid-area: number-5" @click="append(5)">5</button>
       <button style="grid-area: number-6" @click="append(6)">6</button>
       <button style="grid-area: number-7" @click="append(7)">7</button>
       <button style="grid-area: number-8" @click="append(8)">8</button>
       <button style="grid-area: number-9" @click="append(9)">9</button>
       -->

        <button style="grid-area: dot" @click="append('.')">.</button>
      </div>


</template>

<script>
  export default {
      name: 'Calculator',
      data(){
        return{
        equation: '0',  // 最终答案
        isDecimalAdded: false, // 判断是否是小数和是否出现了两位小数点
        isOperatorAdded: false, // 判断是否是功能键和是否出现两次功能键
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
              this.isDecimalAdded = true
            } else {
              // 如果不是，则将0替换为数字
              this.equation = '' + character
            }
            this.isStarted = true
            return
          }

          // 输入数字
          if (!this.isOperator(character)) {
            if (character === '.' && this.isDecimalAdded) {
              return
            }

            if (character === '.') {
              this.isDecimalAdded = true //防止输入两次小小数点
              this.isOperatorAdded = true // 同时不能输入功能键
            } else {
              this.isOperatorAdded = false
            }

            this.equation += '' + character
          }

          // 输入功能键后
          if (this.isOperator(character) && !this.isOperatorAdded) {
            this.equation += '' + character
            this.isDecimalAdded = false // 允许再次输入小数点
            this.isOperatorAdded = true // 不能输入功能键
          }
        },
        // =
        calculate() {
          let result = this.equation.replace(new RegExp('×', 'g'), '*').replace(new RegExp('÷', 'g'), '/')
          this.equation = parseFloat(eval(result).toFixed(9)).toString()
          this.isDecimalAdded = false
          this.isOperatorAdded = false
        },
        // +/-
        calculateToggle() {
          if (this.isOperatorAdded || !this.isStarted) {
            return
          }
          this.equation = this.equation + '* -1'
          this.calculate()
        },
        // %
        // calculatePercentage() {
        //   if (this.isOperatorAdded || !this.isStarted) {
        //     return
        //   }
        //
        //   this.equation = this.equation + '* 0.01'
        //   this.calculate()
        // },

        // 清空
        clear() {
          this.equation = '0'
          this.isDecimalAdded = false
          this.isOperatorAdded = false
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
    font-size: 48px;
    padding: 0 20px;
    color: #666;
    background-color: #fff;
  }

  .headBar{
    cursor: default;
  }
</style>