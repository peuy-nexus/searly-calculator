<template>
  <div class="calculator">
    <span class="calculator__calBar" style="grid-area: calculator__change"></span>
    <span class="calculator__calBar" style="grid-area: calculator__minimize"></span>
    <span class="calculator__calBar" style="grid-area: calculator__maximize"></span>
    <span class="calculator__calBar" style="grid-area: calculator__close"></span>
    <div class="calculator__result" style="grid-area: calculator__result">
      {{ equation }}
    </div>
    <div class="calculator__preview" style="grid-area: calculator__preview">
      {{preEquation}}
    </div>
    <button class="calculator__calculatorTool" style="grid-area: calculator__prescribing" @click="prescribing">√</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__square" @click="square">x²</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__clear" @click="clear">C</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__delete" @click="del"></button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__left" @click="append('(')">（</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__right" @click="append(')')">）</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__plus-minus" @click="calculateToggle">±</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__add" @click="append('+')">+</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__subtract" @click="append('-')">-</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__multiply" @click="append('×')">×</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__divide" @click="append('÷')">÷</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__equal" @click="calculate">=</button>

    <button v-for="(item,index) in number" :style="item" @click="append(index)" :key="index">{{index}}</button>

    <button style="grid-area: calculator__dot" @click="append('.')">.</button>
  </div>


</template>

<script>
  export default {
    name: 'Calculator',
    data(){
      return{
        test:true, // 测试
        maxNumber: 99999999999999, // 最大数值
        equation: '0',  // 计算表达
        preEquation:'0', // 预览和答案
        dec: false, // 判断是否出现了两位小数点
        poer: false, // 判断是否出现两次功能键
        flag:false, // 标识 判断数字是否清空
        isStarted: false, // 是否已经开始输入数字
        number:['grid-area: calculator__number-0','grid-area: calculator__number-1','grid-area: calculator__number-2','grid-area: calculator__number-3',
          'grid-area: calculator__number-4','grid-area: calculator__number-5','grid-area: calculator__number-6'
          ,'grid-area: calculator__number-7','grid-area: calculator__number-8','grid-area: calculator__number-9'
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
        console.log('点击了功能键');
        // 等于0并没有功能键时
        if (this.equation === '0' && !this.isOperator(character)) {
          if (character === '.') {
            // 如果输入小数点则保留0
            // 0909
            this.preEquation = '0' + character
            this.equation = '0' + character // 0910
            this.dec = true //不能输入小数点
          }else{
            // 如果不是，则将0替换为数字
            // 0910
            this.equation = '' + character
            // 0909
            if (!this.isOperator(character)){
              this.preEquation = '' + character
            }
          }
          this.isStarted = true
          return
        }

        // 输入数字
        // 溢出重置
        this.changeColor('rgb(235, 234, 240)')
        if( this.preEquation === '溢出'){
          console.log('溢出重置');
          this.handle()
          this.changeColor('rgb(235, 234, 240)')
        }
        // 防止输入两次小数
        if (!this.isOperator(character)) {
          if (character === '.' && this.dec) {
            return
          }
          if (character === ')' && this.dec) {
            return
          }
          if (character === '.') {
            this.dec = true //防止输入两次小小数点
            this.poer = true // 同时不能输入功能键
          } else {
            this.poer = false
          }

          // 0909 输入数字(运算符后)
          if (this.isOperator(character) && this.flag){
            // console.log('0909输入了数字 flag = flase');
            this.preEquation = ''
            this.equation = ''
            this.equation += '' + character
            this.flag = false
          }else{
            // console.log('090902输入了数字');
            this.equation += '' + character
          }

          // 0910 正常输入数字
          if (!this.isOperator(character) && this.flag){
            // console.log('0910输入了数字');
            // 提前进行计算并得到计算所得值 0910
            this.preEquation = ''
            this.preEquation += '' + character
            this.flag = false
          }else{
            this.preEquation += '' + character
          }
        }

        // 输入功能键后
        if (this.isOperator(character) && !this.poer) {
          // 输入符号立刻进行计算
          // let result = this.equation.replace(new RegExp('×', 'g'), '*').replace(new RegExp('÷', 'g'), '/')
          //   .replace(new RegExp('（','g'),'(').replace(new RegExp('）','g'),')')
          //   .replace(new RegExp('sqr','g'),'')
          //   .replace(new RegExp('√','g'),'')
          // this.preEquation = parseFloat(this.noEval(result).toFixed(15)).toString()
          this.equation += '' + character
          console.log('输入了功能键');
          this.dec = false // 允许再次输入小数点
          this.poer = true // 不能输入功能键
          this.flag = true
        }
      },

      // 删除
      del(){
        console.log('点击了删除');
        this.handle()
        this.changeColor('rgb(235, 234, 240)')
        if (this.flag == false){
          this.equation = this.equation.substring(0,this.equation.length - 1);
          this.preEquation = this.preEquation.substring(0,this.preEquation.length - 1);
        }else{
          this.equation = ''
          this.flag = false
        }
        if (this.preEquation === ''){
          this.preEquation = '0'
        }
      },
      // 计算表达式的值
      noEval(str){
        const Fn = Function;  //一个变量指向Function，防止部分编译工具报错
        return new Fn('return ' + str)();
      },
      // = 将乘除通过全局正则转化为数字并通过隐式转化为数值
      calculate() {
        console.log('结果 flag = true');
        let result = this.equation.replace(new RegExp('×', 'g'), '*').replace(new RegExp('÷', 'g'), '/')
          .replace(new RegExp('（','g'),'(').replace(new RegExp('）','g'),')')
          .replace(new RegExp('sqr','g'),'')
          .replace(new RegExp('√','g'),'')
        this.equation = parseFloat(this.noEval(result).toFixed(15)).toString()
        this.preEquation = this.equation
        this.dec = false
        this.poer = false
        this.flag = true
      },
      // +/-
      calculateToggle() {
        // console.log('+/-');
        if (this.poer) {
          // 如果是符号终止
          return
        }
        this.handle()
        this.changeColor('rgb(235, 234, 240)')
        this.equation = this.equation + '* -1'
      },
      // 开根 直接得出结果
      prescribing(){
        console.log('开根');
        let result = this.preEquation.replace(new RegExp('×', 'g'), '*').replace(new RegExp('÷', 'g'), '/')
          .replace(new RegExp('（','g'),'(').replace(new RegExp('）','g'),')')
        this.preEquation = parseFloat(this.noEval(result).toFixed(12)).toString()
        this.dec = false
        this.poer = false
        this.preEquation = parseFloat(Math.sqrt(this.preEquation).toFixed(15)).toString()
        this.equation = '√' + this.preEquation
      },
      // 溢出部分按钮变色
      changeColor(color){
        let calculatorTool = document.querySelectorAll('.calculator__calculatorTool')
        for (let i=0; i<calculatorTool.length; i++){
          calculatorTool[i].style.background =color;
        }
      },
      handle(){
        if( this.preEquation === '溢出'){
          this.equation = ''
          this.preEquation = '0'
        }
      },
      // 平方 直接得出结果
      square(){
        console.log('平方');
        let result = this.preEquation.replace(new RegExp('×', 'g'), '*').replace(new RegExp('÷', 'g'), '/')
          .replace(new RegExp('（','g'),'(').replace(new RegExp('）','g'),')')
        this.preEquation = parseFloat(this.noEval(result).toFixed(15)).toString()
        this.dec = false
        this.poer = false
        if (parseInt(this.preEquation) < this.maxNumber){
          this.preEquation = parseFloat(Math.pow(this.preEquation,2).toFixed(15)).toString()
          this.equation = 'sqr ' + this.preEquation
        }else{
          this.preEquation = '溢出'
          this.dec = true
          this.isStarted = true
          this.changeColor('rgb(210, 210, 210)')
        }
        return
      },
      // 清空
      clear() {
        console.log('清空');
        if (this.flag){
          this.equation = ''
          this.preEquation = ''
          this.flag = false
        }else{
          this.preEquation = ''
          this.flag = true
        }
        this.dec = false
        this.poer = false
        this.isStarted = false
        this.changeColor('rgb(235, 234, 240)')
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
    border: none;
    outline: none;
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
    grid-template-areas:"calculator__change calculator__minimize calculator__maximize calculator__close"
    "calculator__result calculator__result calculator__result calculator__result"
    "calculator__preview calculator__preview calculator__preview calculator__preview"
    "calculator__prescribing calculator__square calculator__clear calculator__delete"
    "calculator__left calculator__right calculator__plus-minus calculator__divide"
    "calculator__number-7 calculator__number-8 calculator__number-9 calculator__multiply"
    "calculator__number-4 calculator__number-5 calculator__number-6 calculator__subtract"
    "calculator__number-1 calculator__number-2 calculator__number-3 calculator__add"
    "calculator__number-0 calculator__number-0 calculator__dot calculator__equal";
    grid-template-columns: repeat(4, var(--button-width));
    grid-template-rows:40px 40px repeat(9, var(--button-height));

  }

  .calculator .calculator__calBar{
    line-height: var(--button-height);
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

  .calculator button:hover {
    background-color: rgb(220, 233, 243);
  }

  .calculator .calculator__calculatorTool{
    background-color: rgb(235, 234, 240);
  }

  .calculator .calculator__calculatorTool:hover{
    background-color: rgb(198, 208, 229);
  }

  .calculator__result,
  .calculator__preview{
    text-align: right;
    line-height: var(--button-height);
    padding: 0 20px;
    font-size: 16px;
    color: #666;
    background-color: #fff;
  }

  .calculator__preview{
    font-size: 24px;
    color: #000;
  }

  .calculator__calBar{
    cursor: default;
  }
</style>