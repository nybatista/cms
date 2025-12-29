const fs = require('fs/promises');
const path = require('path');
const R = require('ramda');
const sassDir = path.resolve('../scss/02-variables/');
const paletteFile = path.join(sassDir, 'palette.scss');
const paletteFileMixins = path.join(sassDir, 'palette-mixins.scss');
const {PaletteDataParser} = require('./palette-data-parser');


const getSassLibs = ()=>{
  return `@use "sass:list";
@use "sass:map";
@use "sass:string";
@use "sass:math";
@use "sass:selector";
@import "mixins";

`
}




const getSassIncludeStatement = ()=>`@include mapPaletteToVars($colorMap);`

const getPaletteToVarsStringChunks = (paletteObj)=> {



  const paletteTypesArr = Object.keys(paletteObj);



  const fillString = (val, strLength=45)=>{
    const valLength = String(val).length;
    const repeatLen = strLength - valLength;
    const spaceStr = repeatLen <=0 ? "" : R.join('', R.repeat(' ', repeatLen));
    return `${val}${spaceStr}`;
  }

  const caseFn = arr => arr[0].toUpperCase()+arr[1];
  const rCapCase = R.compose(caseFn, R.splitAt(1))
  const createCssVar = (str, num=50)=>`--ld-${str}-${num}`;
  const createSassVar = (str, num=50, prefix='')=>`$${prefix}${rCapCase(str)}-${num}`;
  const createLDSassVar = (str, num=50)=> createSassVar(str, num, 'ld');
  const createMapList = (val, light, dark)=>`${fillString(`"${val}" `, 24)}:  ${fillString(` ( ${light},`, 26)} ${dark} ),`;
  const createPaletteList = (sassVar, hexVal, darknum)=>`${fillString(`${sassVar}`, 22)}:  ${fillString(` ${hexVal};  //`, 10)} ${darknum}`;
  const createLDSassGlobal = (sassVal, cssVal)=>`${fillString(`${sassVal}`, 24)}:     var(${String(cssVal).toLowerCase()});`;


  const reducePaletteTypeToStr = (acc, str, i) => {

    const currentPaletteObj = paletteObj[str];
    const {arrLight, arrLightHex, arrDark} = currentPaletteObj;

    const numReducer = (numAcc, num, n) => {
      const ldSassVal = createLDSassVar(str, num);
      const cssVal = createCssVar(str, num);
      const sassGlobal = createLDSassGlobal(ldSassVal, cssVal);
      const darkNum = arrDark[n];
      const arrlightHexVal = arrLightHex[n];
      const sassValLight = createSassVar(str, num);
      const sassValDark = createSassVar(str, darkNum);
      const mapList = createMapList(ldSassVal, sassValLight, sassValDark);
      const paletteList = createPaletteList(sassValLight, arrlightHexVal, darkNum);
        acc.sassMap.push(mapList);
        acc.sassGlobals.push(sassGlobal);
        acc.sassPalette.push(paletteList);

    }

    arrLight.reduce(numReducer, acc);

    return acc;

  }

  return paletteTypesArr.reduce(reducePaletteTypeToStr, {
    sassMap: [],
    sassGlobals: [],
    sassPalette: []
  });

}

const writeToFile =  async (fileName, fileStr)=>{
  try{
    return await fs.writeFile(fileName, fileStr);
  } catch(e){
    console.log('write error ',e);
  }
  return false;
}


const updateColorPalette = async ()=> {

  const paletteDataParser = new PaletteDataParser(paletteFile);

  const paletteJson = await paletteDataParser.processFile();
  const sassValues = getPaletteToVarsStringChunks(paletteJson);

  const sassMapStrFn =  arr => `$colorMap: (${arr.join('\n')});\n`;

  const sassLibsStr = getSassLibs();
  const sassMapStr = sassMapStrFn(sassValues.sassMap);
  const sassIncludeStr = getSassIncludeStatement();
  const sassGlobalsStr = sassValues.sassGlobals.join("\n");
  const paletteFileStr = sassValues.sassPalette.join("\n");
  const sassFileStr = `${sassLibsStr}\n\n${sassMapStr}\n\n${sassIncludeStr}\n\n${sassGlobalsStr}\n\n`;

  await writeToFile(paletteFile, paletteFileStr);
  await writeToFile(paletteFileMixins, sassFileStr);



  /*
  try{
    await fs.writeFile(paletteFileMixins, sassFileStr);
  } catch(e){
    console.log('write error ',e);
  }*/


 // console.log('palette json is ',paletteJson['$Primary-100'], {sassValues});
  console.log(sassGlobalsStr);
}


updateColorPalette();
