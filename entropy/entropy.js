//Программа по нахождению энтропии Шеннона
const fs = require("fs");

let str = process.argv[2];
let len = str.length
let alph = new Array()
let H = 0;
let n = 0;

for(i = 0; i < len; i++){
    if (str.charAt(i) in alph){
        alph[str.charAt(i)]++;
    }
    else{
        alph[str.charAt(i)] = 1;
        n++;
    }
}
for(i in alph){
    alph[i] /= len;
}
for(i in alph){
    H -= alph[i]*Math.log(alph[i]);
}
if (H !=0) H /= Math.log(n);
console.log(H);
