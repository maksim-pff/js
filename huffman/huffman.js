//Программа сжатия данных по алгоритму Хаффмана
const fs = require("fs");

//Фунция по созданию узла в дереве
function Node(id, parentId, letter, used, freq, code) {
    this.id = id;
    this.parentId = parentId;
    this.letter = letter;
    this.used = used;
    this.freq = freq;
    this.code = code;
};

//Функция сортировки массива Tree по возрастанию частоты его элементов
function sortTreeByFreq(tree){
  tree.sort(function (a, b) {
      return a.freq - b.freq;})
}

//Функция сортировки массива Tree по возрастанию id его элементов
function sortTreeById(tree){
  tree.sort(function (a, b) {
      return a.id - b.id;})
}

//Фунция поиска кода родителя определенного элемента Tree в Tree
function findCodeOfParent(currentTree, tree){
  //currentTree - узел, для которого необходимо определить код родителя
  for(let i = 0; i < tree.length; i++)
  {
    if(currentTree.parentId==tree[i].id) return tree[i].code;
  }
}

//Функция поиска индекса элемента с определенным символом в Tree
function findIndexOfSymbol(a, tree){
  for(let i = 0; i < tree.length; i++)
  {
    if(a==tree[i].letter) return i;
  }
}

//Функция по проверке использованности каждого из элементов массива Tree
function checkIfEveryElementIsUsed(tree){
  let numberOfUsedElements = 0;
  let len = tree.length;
  for(let i = 0; i < len; i++)
  {
    if(tree[i].used==1) numberOfUsedElements++;
  }
  //сравниваем с len-1 из-за того, что корень дерева не должен быть использован
  if (numberOfUsedElements==len-1) return false;
  else return true;
}

//Функция создания бинарного дерева
function createBinaryTree(tree, idCount){
  if(tree.length!=1){
    while(checkIfEveryElementIsUsed(tree)){
      sortTreeByFreq(tree);
      let numberOfPickedElements = 0;
      let i = 0;
      let min1Id;
      let min2Id;
      //выбираем два элемента с наименьшей частотой
      while(numberOfPickedElements!=2){
        if(tree[i].used==0){
          if(numberOfPickedElements==0){
            min1Id = i;
            numberOfPickedElements++;
            tree[i].used=1;
          }
          else if(numberOfPickedElements==1){
            min2Id = i;
            numberOfPickedElements++;
            tree[i].used=1;
            }
          }
          i++;
        }
        let n = new Node(idCount, null, tree[min1Id].letter+tree[min2Id].letter, 0, tree[min1Id].freq+tree[min2Id].freq, '')
        tree.push(n);
        tree[min1Id].parentId=idCount;
        tree[min2Id].parentId=idCount;
        idCount++;
      }
  }
}

//Функция создания значений code у каждого элемента, таблицы кодирования и вывод таблицы в консоль
function createCodeTable(tree){
  let len = tree.length;
  if(len!=1){
    sortTreeByFreq(tree);
    for(let i = len-2; i > -1; i--)
    {
      if(i%2==0) tree[i].code = (findCodeOfParent(tree[i], tree)+'0');
      else tree[i].code = (findCodeOfParent(tree[i], tree)+'1');
    }
  }
  else{
    tree[0].code='0';
  }
  //вывод таблицы кодировки символов в консоль
  sortTreeById(tree);
  for(let i = 0; i < len; i++)
  {
    if(tree[i].letter.length==1){
      console.log(tree[i].letter, ": ", tree[i].code);
    }
  }
}

//Функция кодирования данной строки и вывод строки в файл
function codeStr(str, tree, output){
  let lenStr = str.length;
  let strOutput = ""; //строка-вывод в файл
  for(let i = 0; i < lenStr; i++)
  {
    strOutput += tree[findIndexOfSymbol(str[i], tree)].code;
  }
  fs.writeFileSync('encoded_output.txt', strOutput);
}

//Функция декодирования строик и вывод её же в файл
function decodeStr(tree, output){
  let s = fs.readFileSync('encoded_output.txt', "utf8");
  let strOutput = ""; //строка-вывод в файл
  //массив, где значение - код элемента, значение - символ этого элемента
  let code_To_Text_table = [];
  for (let i = 0; i < tree.length; i++)
  {
    if(tree[i].letter.length==1) code_To_Text_table[tree[i].code]=tree[i].letter;
  }

  let substr = "";
  for (let i = 0; i < s.length; i++)
  {
    substr += s[i];
    if(code_To_Text_table[substr]!=undefined){
      strOutput += code_To_Text_table[substr];
      substr = "";
    }
  }
  fs.writeFileSync(output, strOutput);
}

//Основное тело программы
function main(){
  let input = process.argv[2];
  let output = process.argv[3];
  let str = fs.readFileSync(input, "utf8");
  let alph = new Array(); //создание массива под алфавит строки

  //создание массива-алфавита
  for (let i = 0; i < str.length; i++) {
    if (alph[str.charAt(i)]) alph[str.charAt(i)]++;
    else alph[str.charAt(i)] = 1;
  }

  let tree = new Array(); //создание массива-дерева
  let idCount = 0; //счетчик номера элемента в массиве Tree

  //создание листьев дерева
  for (i in alph){
    let n = new Node(idCount, null, i, 0, alph[i], '');
    tree.push(n);
    idCount++;
  }

  createBinaryTree(tree, idCount);
  createCodeTable(tree);
  codeStr(str, tree, output);
  decodeStr(tree, output);
}
main();
