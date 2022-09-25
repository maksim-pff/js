//Программа по кодированию и декодирования данных по алгоритму RLE
const fs = require("fs");

//Функция кодирования данных по алгоритму RLE
function code(ContentOfInput, output){
  let orig_str = ContentOfInput; //orig_str = Содержимое входных данных
  let n = 1; //n = Количество повторяющихся символов
  let s = "";
  for(let i = 1; i <orig_str.length; i++){
    if(orig_str[i-1]!='#'){
      if((orig_str[i-1]==orig_str[i])&&(n!=259)) n++;
      else if(n>3){
        s+= `#` + String.fromCharCode(n-4) + orig_str[i-1];
        n=1;
      }
      else{
        for(let j = 0; j < n; j++) s+=orig_str[i-1];
        n=1;
      }
    }
    else{
      if((orig_str[i-1]==orig_str[i])&&(n!=259)) n++;
      else{
        s+= `#` + String.fromCharCode(n) + orig_str[i-1];
        n=1;
      }
    }
  }
  fs.writeFileSync(output, s);
  console.log("Coding is (hopefully) done successfully!");
  calculateCompressionRatio(ContentOfInput, s);
}

//Функция декодирования данных
function decode(ContentOfInput, output){
  let orig_str = ContentOfInput; //orig_str = Содержимое входных данных
  let s = "";
  for(let i = 0; i <orig_str.length; i++){
    if((orig_str[i]=='#')&&(orig_str[i+2]!='#')){
      for(let j = 0; j < orig_str.charCodeAt(i+1)+4; j++) s+=orig_str[i+2];
      i+=2;
    }
    else if((orig_str[i]=='#')&&(orig_str[i+2]=='#')){
      for(let j = 0; j < orig_str.charCodeAt(i+1); j++) s+=orig_str[i+2];
      i+=2;
    }
    else s+=orig_str[i];
  }
  fs.writeFileSync(output, s);
  console.log("Decoding is (likely) done successfully!");
}

//Функиця подсчета коэффициента сжатия
function calculateCompressionRatio(ContentOfInput, s){
  console.log("Ratio of compression is:", ContentOfInput.length/s.length);
}

//Основное тело программы
let mode = process.argv[2];
let input = process.argv[3];
let output = process.argv[4];
let ContentOfInput = fs.readFileSync(input, "utf8");

if(mode == "code") code(ContentOfInput, output);
if(mode == "decode") decode(ContentOfInput, output);
