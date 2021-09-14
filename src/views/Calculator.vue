<template>
  <div class="calculator">
    <span class="calculator__calBar" style="grid-area: calculator__change"></span>
    <span class="calculator__calBar" style="grid-area: calculator__minimize"></span>
    <span class="calculator__calBar" style="grid-area: calculator__maximize"></span>
    <span class="calculator__calBar" style="grid-area: calculator__close"></span>
    <!--  预览  -->
    <div class="calculator__result showFormula" style="grid-area: calculator__result">
      {{ equation }}
    </div>
    <!--  操作与结果  -->
    <div class="calculator__preview" style="grid-area: calculator__preview">
      {{preEquation}}
    </div>
    <!--  运算符  -->
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
    <!--  数值键  -->
    <button style="grid-area: calculator__number-0" @click="append(0)">0</button>
    <button style="grid-area: calculator__number-1" @click="append(1)">1</button>
    <button style="grid-area: calculator__number-2" @click="append(2)">2</button>
    <button style="grid-area: calculator__number-3" @click="append(3)">3</button>
    <button style="grid-area: calculator__number-4" @click="append(4)">4</button>
    <button style="grid-area: calculator__number-5" @click="append(5)">5</button>
    <button style="grid-area: calculator__number-6" @click="append(6)">6</button>
    <button style="grid-area: calculator__number-7" @click="append(7)">7</button>
    <button style="grid-area: calculator__number-8" @click="append(8)">8</button>
    <button style="grid-area: calculator__number-9" @click="append(9)">9</button>

    <button style="grid-area: calculator__dot" @click="append('.')">.</button>
  </div>


</template>

<script>
  export default {
    name: 'Calculator',
    data(){
      return{
        // test:true, // 测试
        number: 0, // 计算
        equation: '0',  // 计算表达
        preEquation:0, // 预览和答案
        arr:[], // 模拟栈
        dec: false, // 判断是否出现了两位小数点
        poer: false, // 判断是否出现两次功能键
        flag:false, // 标识 判断数字是否清空
        isStarted: false, // 是否已经开始输入数字
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
            // 0909
            this.preEquation = '0' + character
            this.equation = '0' + character // 0910
            this.dec = true //不能输入小数点
          }else if(character === '('){
            // 判断第一个输入的是（
            this.equation = '' + character
            this.arr.push(this.equation) // 0914注a
          }
          else{
            // 如果不是，则将0替换为数字
            // 0910
            this.equation = '' + character
            this.number = character - 0 // 0913

            this.arr.push(this.number) // 将数字push进数组 0914注a
            console.log(this.arr);
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
          this.handle()
          this.changeColor('rgb(235, 234, 240)')
        }
        // 防止输入两次小数
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

          // 0909 输入数字(运算符后)
          if (this.isOperator(character) && this.flag){
            this.preEquation = ''
            this.equation = ''
            this.equation += '' + character
            this.flag = false
          }else{
            // a
            // 0913-2
            this.equation += '' + character
            this.number = character;
            console.log(this.number);
            this.arr.push(this.number) //0914注a
            console.log(this.arr); // 将数字加入栈 0914注a
          }

            /* 目的：将拼接好的字符串（10 1.2）以number加入栈中
                 a.输入任意一个数字都会进栈
                 b.目前使用：在this.isOperator(character)里面，未点击符号键的时候，让number做字符串拼接，点击符号键的时再将前面拼接好的入栈，但符号键会溢出一个
                 c.在!this.isOperator(character)发生的问题，只有输入长度超过1的才能生效

               解决a： a与b连用，给a加一个判断（输入数小于10），否则不输入，但无法解决b的问题
               解决b： 在arr转后缀表达式时，加一个判断，如果最后一个是非数字则删除，但每次确认时最终还是要输入符号键，不符合计算器使用规范
               解决b2： 修改确认键（目前确认键为+-×÷） ？？？
               解决c： a加判断与c连用，但例如输入1+2+99会解析为[1,2,'+',9,9,99,'+']
               */



          // b
          // 0910 正常输入数字
          if (!this.isOperator(character) && this.flag){
            this.preEquation = ''
            this.preEquation += '' + character
            this.flag = false
          }else{
            this.preEquation += '' + character // 拼接字符串
          }
        }
        
        // 输入功能键后
        if (this.isOperator(character) && !this.poer) {
          this.number = this.preEquation - 0 //0913

          //c
          // this.arr.push(this.number) // 0914
          // console.log(this.arr); // 0914

          this.equation += '' + character
          this.arr.push(character) //0913-2
          console.log(this.arr); // 插入功能键
          this.preEquation =  this.number //0913 赋值操作
          this.dec = false // 允许再次输入小数点
          this.poer = true // 不能输入功能键
          this.flag = true

          return false
        }
      },

      // 中缀转后缀
      midToBack(arr) {
        let symPrior = {"(": 0, ")": 0, "÷": 1, "×": 1, "+": 2, "-": 2 }; // 优先级判断
        console.log(arr); // 输出arr数组
        let stack = []; // 判断
        let back = []; // 后缀表达式

        // this.arr.pop() // 0914注c
        // this.equation = this.equation.substring(0,this.equation.length - 1); // 0914注c方案

        for (let i = 0; i < arr.length; i++) {
          let cur = arr[i];
          console.log("输出"+cur); // 输出
          if (!isNaN(cur)) { // 判断数字
            back.push(cur);
          } else {
            //不是数字
            if (stack.length == 0) {
              stack.push(cur);
            } else if (cur == ")") {
              while (stack.length != 0 && stack[stack.length - 1] != "(") {
                back.push(stack.pop());
              }
              if (stack.length == 0){ //栈空 表达式()个数不匹配
                return "表达式错误";
              } else {
                stack.pop(); //弹出(
              }
            } else if (cur == "(" || symPrior[cur] < symPrior[stack[stack.length - 1]]) {
              stack.push(cur);
            } else {
                while (stack.length != 0 && stack[stack.length - 1] != "(" && symPrior[cur] >= symPrior[stack[stack.length - 1]]) {
                  back.push(stack.pop());
                }
              stack.push(cur);
              }
            }
            }
            while (stack.length != 0) {
              back.push(stack.pop());
            }
             // console.log('中缀转后缀');
             // console.log(back);
            return back;
          },

      // 删除
      del(){
        this.handle()
        this.changeColor('rgb(235, 234, 240)')
        if (this.flag == false){
          this.equation = this.equation.substring(0,this.equation.length - 1);
          this.preEquation = this.preEquation.substring(0,this.preEquation.length - 1);
          this.arr.pop()
        }
        else{
          this.equation = ''
          this.arr.length = 0
          this.flag = false
        }
        if (this.preEquation === ''){
          this.preEquation = '0'
        }
      },

      // 0913-2
      // 弹出数字并计算
	  evalRPN(token){
		  // console.log("最终结果："+token)
		  let stack = [];
		  for(let i = 0; i < token.length; i++){
			  if(!isNaN(token[i])){
				  stack.push(token[i]) // 数字
			  }
			  else{
				  let left=stack.pop();
				  let right=stack.pop()
				  let res=0; //结果
				  if(token[i] === '+'){
					  res = parseFloat(left) + parseFloat(right)
				  }
				  else if(token[i] === '-'){
					  res = parseFloat(right) - parseFloat(left)
				  }
				  else if(token[i] === '×'){
					  res = parseFloat(right) * parseFloat(left)
				  }
				  else if(token[i] === '÷'){
				    if (parseFloat(left) === 0){
				      return '除数不能为0'
                    }else{
                      res = parseFloat(right) / parseFloat(left)
                    }
				  }
				  else{
                    return "字符串错误"
				  }
				  stack.push(res)
			  }
		  }
		  return stack.pop()
	  },

      // =
      calculate() {
        let s = this.midToBack(this.arr) // 中缀转后缀
        console.log('中缀转后缀: ');
        console.log(s);
		// let arr2=['11.2','2','3','1','+','×','+']
        // console.log(arr2);
		let end = this.evalRPN(s)
        this.preEquation = end//0913 赋值操作
        console.log("最后计算结果:"+ this.preEquation )
        this.dec = false
        this.poer = false
        this.flag = true
      },

      // +/-
      calculateToggle() {
        if (this.poer) {
          // 如果是符号终止
          return
        }
        this.handle()
        this.changeColor('rgb(235, 234, 240)')
        this.equation = this.equation + '×' + '-1'
        this.arr.push('×')
        this.arr.push(-1)
        console.log(this.arr);
      },

      // 开根 直接得出结果
      prescribing(){
        this.equation.replace(new RegExp('√', 'g'), '')
        this.calculate()
        console.log('开根');
        this.equation = '√' + this.preEquation
        this.preEquation = Math.sqrt(this.preEquation)
        this.arr.length = 0
        this.arr.push(this.preEquation)
        this.dec = false
        this.poer = false
        return
      },

      // 溢出部分按钮变色
      changeColor(color){
        let calculatorTool = document.querySelectorAll('.calculator__calculatorTool')
        for (let i=0; i<calculatorTool.length; i++){
          calculatorTool[i].style.background =color;
        }
      },
      // 溢出将各个数值归0
      handle(){
        if( this.preEquation === '溢出'){
          this.equation = ''
          this.preEquation = 0
          this.arr.length = 0
        }
      },
      // 平方
      square(){
        if (parseInt(this.preEquation) < 999999999999){
        this.equation.replace(new RegExp('sqr', 'g'), '')
        this.calculate()
        console.log('平方')
        this.equation = 'sqr' + this.preEquation
        this.preEquation = this.preEquation * this.preEquation
        this.arr.length = 0
        this.arr.push(this.preEquation)

        this.dec = false
        this.poer = false
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
        if (this.flag){
          this.equation = ''
          this.preEquation = 0
          this.arr.length = 0
          this.flag = false
        }else{
          this.preEquation = ''
          this.equation = this.equation.substring(0,this.equation.length - 1);
          this.arr.pop()
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