const fs = require('fs/promises');
const sassPaletteRE = /^(\$)(.*)(-)(\d+)(\s*)(:)(\s*?)(#\w+)(;)((.*\/\/\s*)(\d+))*$/gm;
const R = require('ramda');
let _paletteFile;


class PaletteDataParser {


  constructor(paletteFile) {

    _paletteFile = paletteFile;

    const onProcessAll = async()=> {
      await this.processFile();

    }

    //onProcessAll();
  }


  async convertFileToJson(){


    const toJsonStr = (str) =>  str.replace(sassPaletteRE, `"$1$2$3$4" : "$7", \n`)

    const getPaletteStr = (data) => {
      const jsonStr = `${toJsonStr(data)}`
      const jsonSubStr = String(jsonStr).substring(0, jsonStr.length - 4);
      return JSON.parse(`{ ${jsonSubStr} }`);
    }

    try {
      const data = await fs.readFile(_paletteFile, { encoding: 'utf8' });
      return Array.from(String(data).matchAll(sassPaletteRE));
     // return getPaletteStr(data);

    } catch(e){
      console.log('fs err is ',e);
      return false;
    }



  }

  async processFile(){



    try {
      const jsonObj = await this.convertFileToJson();

      const paletteNamesRawObj = jsonObj.reduce(PaletteDataParser.reducePaletteArrs,    {});
      const paletteNamesObj = R.map(PaletteDataParser.onMapEachPalette, paletteNamesRawObj);

     // console.log('palette names obj ',paletteNamesObj);

      return paletteNamesObj

    } catch(e){
      console.log("convert json err is ",e);
    }




  }


  static reducePaletteArrs(acc, arr){
      let paletteName = arr[2];
      let arrLight = arr[4];
      let arrDark = arr[12];
      let arrLightHex = arr[8];
     // console.log('paallete name is ',paletteName);

      if (acc[paletteName] === undefined){
        acc[paletteName] = {
          arrLight: [arrLight],
          arrDark: [arrDark],
          arrLightHex: [arrLightHex]
        };

      } else {
        acc[paletteName].arrLight.push(arrLight);
        acc[paletteName].arrDark.push(arrDark);
        acc[paletteName].arrLightHex.push(arrLightHex);
      }
      return acc;



  }



  static onMapEachPalette(paletteObj){

    let {arrLight, arrDark} = paletteObj;
    const arrLightReverse = R.clone(arrLight).reverse();
    //console.log("palette IS:", {arrLight, arrDark, arrLightReverse})

    const mapArrDark = (arrItem, i)=>{
      if (arrItem === null || arrItem === undefined){
        //console.log({arrItem, i}, arrLightReverse[i])

        return arrLightReverse[i];
      }

      return arrItem;
    }

    paletteObj['arrDark'] = arrDark.map(mapArrDark);

    return paletteObj;


  }





}

module.exports = {PaletteDataParser};
