export class SpyneCmsItemHitbox extends HTMLElement {
  constructor() {
    super();

  }


  addSvgRect(){

    //const shadow = this.attachShadow({mode: 'open'});
    const svgns = "http://www.w3.org/2000/svg";

    //const spanTxt = document.createElement('span');
    //spanTxt.textContent = this.textContent;
   // this.textContent = "";

    const svg = document.createElementNS(svgns, 'svg');

    svg.setAttribute('viewbox', "0 0 100% 100%");
    svg.setAttribute('xmlns', "http://www.w3.org/2000/svg")

    //const svgBtn = document.createElementNS(svgns, 'text');
    //svgBtn.textContent = "✎";
   // svgBtn.setAttribute("x", "8");
    ///svgBtn.setAttribute("y", "8");

    // svg.appendChild(svgBtn);
    //this.appendChild(spanTxt);
    this.appendChild(svg);
    const rect = document.createElementNS(svgns, 'rect');
    rect.setAttribute("class", "cms-item-rect stroked");


    const rectBox = document.createElementNS(svgns, 'rect');
    rectBox.setAttribute("class", "box");



    // const rect = document.createElement('rect');
    //rect.setAttribute("x", "-2");
    //rect.setAttribute("y", "-2");
    // rect.setAttribute("width", "100");
    // rect.setAttribute("class", "stroked");
    // rect.setAttribute("height", "100");
    //const onFrame = ()=>{
    svg.appendChild(rectBox);
    svg.appendChild(rect);
      // rect.styles.classList.add('stroked');

    //}

    //requestAnimationFrame(onFrame);


   // let style = document.createElement('style');
   // style.textContent = SpyneCmsItemHitbox.getStylesText();
   // this.appendChild(style);

    //onFrame();
    //this.attachShadow({mode: 'closed'});

  }


  connectedCallback(e) {
    this.addSvgRect();
  }


  static getStylesText(){
    return ` 
    
    spyne-cms-item-hitbox{
      position:absolute;
      width: 100%;
      height: 100%;
      display:contents;
     
    }
    
    
     spyne-cms-item-hitbox svg{
    position: absolute;;

    width: calc(100% + 0px);
    height: calc(100% + 0px);

    pointer-events: none;
    display: inline-block;;
    visibility:hidden;

    }
    

    
     spyne-cms-item-hitbox rect {
      stroke: rgba(0,0,0,0);
      fill:none;;
     
      pointer-events:visiblePainted;
      cursor:pointer;
      visibility:visible;
    }
    
    spyne-cms-item-hitbox rect.stroked {
      stroke-width:12px;
      stroke-color:skyblue;

       width: 100%;
      height: 100%;
    }
    
      spyne-cms-item-hitbox rect.box {
          width:30px;
          height:30px;
          max-width:80%;
          max-height:80%;
          fill:rgba(123,123,0,.2);;

      }
  
    
     spyne-cms-item-hitbox rect:hover{

      stroke: skyblue;
    }
    
`

  }



}
