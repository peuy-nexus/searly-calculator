<template>
  <div class="calculator">
    <span class="calculator__calBar" style="grid-area: calculator__change"></span>
    <span class="calculator__calBar" style="grid-area: calculator__minimize"></span>
    <span class="calculator__calBar" style="grid-area: calculator__maximize"></span>
    <span class="calculator__calBar" style="grid-area: calculator__close"></span>
    <div class="calculator__result showFormula" style="grid-area: calculator__result">
      {{ equation }}
    </div>
    <div class="calculator__preview" style="grid-area: calculator__preview">
      {{preEquation}}
    </div>
    <button class="calculator__calculatorTool" style="grid-area: calculator__prescribing" >√</button>
<!--@click="prescribing"    @click="square"-->
    <button class="calculator__calculatorTool" style="grid-area: calculator__square" >x²</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__clear" @click="clear">C</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__delete" @click="del"></button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__left" @click="append('(')">（</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__right" @click="append(')')">）</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__plus-minus" @click="calculateToggle">±</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__add" @click="append('+')">+</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__subtract" @click="append('-')">-</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__multiply" @click="append('×')">×</button>
    <button class="calculator__calculatorTool" style="grid-area: calculator__divide" @click="append('÷')">÷</button>
<!--  @click="calculate"  -->
    <button class="calculator__calculatorTool" style="grid-area: calculator__equal" @click="calculate">=</button>

<!--    <button v-for="(item,index) in number" :style="item" @click="append(index)" :key="index">{{index}}</button>-->
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
        test:true, // 测试
        number: 0, // 计算
        number2:0, // 输入的数
        symbol:'', // 符号
        sum: 0, // 和
        equation: '0',  // 计算表达
        preEquation:0, // 预览和答案
        arr:[],
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
          }else{
            // 如果不是，则将0替换为数字
            // 0910
            this.equation = '' + character
            this.number = character - 0 // 0913
            this.arr.push(this.number) // 0913-2
            // console.log(this.arr); // 将数字push进数组

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
            this.equation += '' + character
            this.number = character;
            this.arr.push(this.number)
            console.log(this.arr); //0913-2

            // 0913-2  中缀转后缀
            // this.midToBack(this.arr) // 中缀转后缀
            // console.log(this.arr);
          }

          // 0910 正常输入数字
          if (!this.isOperator(character) && this.flag){
            // 提前进行计算并得到计算所得值
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

          this.symbol = character // 0913
          this.number = this.preEquation - 0 //0913
          // this.arr.push(character) // 0913-2
          // console.log(this.arr); // 0913-2


          let right = this.arr.pop()
          console.log('right'+right);
          let left = this.arr.pop()
          console.log('left'+left);
          

          this.equation += '' + character
          this.arr.push(character) //0913-2

        
          
          // this.arr.push(this.getCont(left,right,character))

          // this.getCont() // 0913

          this.preEquation =  this.sum //0913 赋值操作

          this.dec = false // 允许再次输入小数点
          this.poer = true // 不能输入功能键
          this.flag = true

          return false
        }
      },
      // 中缀转后缀
      midToBack(arr) {
        let symPrior = { "(": 0, ")": 0, "%": 1, "/": 1, "*": 1, "+": 2, "-": 2 }; //优先级对象数组越小越优先
        console.log(arr); // 转换为数组
        let stack = [];
        let back = [];
        for (let i = 0; i < arr.length; i++) {
            let cur = arr[i];
            console.log("输出"+cur); // 输出
            if (!isNaN(cur)) { //数字
                back.push(cur); 
            } else {
				//不是数字
                if (stack.length == 0) {
                    stack.push(cur);
                } else if (cur == ")") {
                    while (stack.length != 0 && stack[stack.length - 1] != "(") {
                        back.push(stack.pop());
                    }
                    if (stack.length == 0) //栈空 说明表达式()个数不匹配表达式错误
                    {
                        throw new calc_error("表达式错误");
                        return;
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
             console.log('中缀转后缀');
            console.log(back);
            return back;
          },
      // 删除
      del(){
        this.handle()
        this.changeColor('rgb(235, 234, 240)')
        if (this.flag == false){
          this.equation = this.equation.substring(0,this.equation.length - 1);
          this.preEquation = this.preEquation.substring(0,this.preEquation.length - 1);
        }else{
          // this.equation = ''
          this.equation = this.equation.substring(0,this.equation.length - 1);
          this.flag = false
        }
        if (this.preEquation === ''){
          this.preEquation = '0'
        }
      },
      // 计算表达式的值
      getCont(left, right, operator){
        switch (operator) {
          case "+":
            this.sum = left + right
            break;
          case "-":
            this.sum = left - right
            break;
          case "×":
              this.sum = left * right
            break;
          case "÷":
              this.sum = left / right
              break;
        }
      },
	  
	  evalRPN(token){
		  console.log("最终结果："+token)
		  let stack = []; 
		  
		  for(let i = 0; i < token.length; i++){
			  if(!isNaN(token[i])){
				  stack.push(token[i])
			  }
			  
			  else{
				  let left=stack.pop();
				  let right=stack.pop()
				  let res=0; //结果
				  if(token[i]==='+'){
					  res=parseFloat(left)+parseFloat(right)
				  }
				  else if(token[i]==='-'){
					  res=parseFloat(right)-parseFloat(left)
				  }
				  else if(token[i]==='*'){
					  res=parseFloat(right)*parseFloat(left)
				  }
				  else if(token[i]==='/'){
					  resparseFloat(right)/parseFloat(left)
				  }
				  else{
					  throw new calc_error("字符串错误")
				  }
				  stack.push(res)
			  }
		  }
		  return stack.pop()
	  },

      // =
      calculate() {
        // this.getCont() // 0913
        let s=this.midToBack(this.arr) // 中缀转后缀
		let arr=['1','2','3','1','+','*','+']
		let end=this.evalRPN(arr)
		console.log("最后计算结果:"+end)
        this.preEquation =  this.sum //0913 赋值操作
        console.log('calculate= '+this.preEquation);

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
        this.equation = this.equation + '* -1'
      },
      // 开根 直接得出结果
      // prescribing(){
      //   // let result = this.preEquation.replace(new RegExp('×', 'g'), '*').replace(new RegExp('÷', 'g'), '/')
      //   //   .replace(new RegExp('（','g'),'(').replace(new RegExp('）','g'),')')
      //   // this.preEquation = parseFloat(this.noEval(result).toFixed(12)).toString()
      //   // this.dec = false
      //   // this.poer = false
      //   // this.preEquation = parseFloat(Math.sqrt(this.preEquation).toFixed(15)).toString()
      //   // this.equation = '√' + this.preEquation
      // },
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
      // square(){
      //   // let result = this.preEquation.replace(new RegExp('×', 'g'), '*').replace(new RegExp('÷', 'g'), '/')
      //   //   .replace(new RegExp('（','g'),'(').replace(new RegExp('）','g'),')')
      //   // this.preEquation = parseFloat(this.noEval(result).toFixed(15)).toString()
      //   // this.dec = false
      //   // this.poer = false
      //   // if (parseInt(this.preEquation) < this.maxNumber){
      //   //   this.preEquation = parseFloat(Math.pow(this.preEquation,2).toFixed(15)).toString()
      //   //   this.equation = 'sqr ' + this.preEquation
      //   // }else{
      //   //   this.preEquation = '溢出'
      //   //   this.dec = true
      //   //   this.isStarted = true
      //   //   this.changeColor('rgb(210, 210, 210)')
      //   // }
      //   // return
      // },
      // 清空
      clear() {
        if (this.flag){
          this.equation = ''
          this.preEquation = ''
          this.sum = 0
          this.flag = false
        }else{
          this.preEquation = ''
          this.sum = 0
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