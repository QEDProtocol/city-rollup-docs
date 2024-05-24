
interface IDogeTextConfig {
  color: string;
  position: {x: number, y: number};
  text: string;
  opacity: number;
  scale: number;
}
const BOUNCE_TIME = 3000;
const FADE_OUT_TIME = 3000;
class DogeTextAnimator {
  color: string;
  position: {x: number, y: number};
  text: string;
  createdAt: number;
  speed: number;
  cycles: number;
  fadeOutTime: number;
  totalDuration: number
  getRelativeTime(absoluteTime: number){
    return absoluteTime - this.createdAt;
  }
  constructor(color: string, position: {x: number, y: number}, text: string, speed: number, cycles: number, fadeOutTime: number){
    this.color = color;
    this.position = position;
    this.text = text;
    this.createdAt = window.performance.now();
    this.cycles = cycles;
    this.speed = speed;
    this.fadeOutTime = fadeOutTime;
    this.totalDuration = speed * (cycles+0.5) + fadeOutTime;

  }
  render(absTime: number): IDogeTextConfig{

    const t = absTime-this.createdAt;

    if(t>(this.cycles*this.speed)){
      return {
        color: this.color,
        position: this.position,
        scale: 1,
        opacity: t-this.cycles*this.speed < this.fadeOutTime ? 1-(t-this.cycles*this.speed)/this.fadeOutTime : 0,
        text: this.text,
      }
    }else{
      // zoom in/out
      const cycle = Math.floor(t/this.speed);
      const cycleTime = t - cycle*this.speed;
      // use sin
      const scale = 1 + 0.1*Math.sin(cycleTime/this.speed*Math.PI);
      return {
        color: this.color,
        position: this.position,
        scale: scale,
        opacity: 1,
        text: this.text,
      }
    }

  }
  canDispose(absTime: number, width: number, height: number){
    const t= absTime-this.createdAt;
    if(t>this.totalDuration || this.position.x > width || this.position.y > height){
      return true;
    }else{
      return false;
    }
  }

}
class DogeTextRunner {
  baseWords = ["such","very","so"]
  words: string[];
  width: number;
  height: number;
  instances: DogeTextAnimator[] = [];
  wordCtr = 0;
  globalOpacity: number;

  constructor(words: string[], width: number, height: number, globalOpacity = 1){
    this.words = words;
    this.width = width;
    this.height = height;
    this.wordCtr = Math.floor(words.length*Math.random())
    this.globalOpacity = globalOpacity;
  }
  addText(color: string, speed: number, cycles: number, fadeOutTime: number) {
    const x = Math.random();
    /*
    let isLeftSide = Math.random() > 0.5;
    let xV = sampleX%0.5;
    const dX = (-1*(2*xV-1)*(2*xV-1)+1)/2;
    const x = isLeftSide ? dX : 1-dX;
*/
    const y = Math.random();
    this.wordCtr = (this.wordCtr+1)%this.words.length;
    const word = this.baseWords[Math.floor(Math.random()*this.baseWords.length)] + " " + this.words[this.wordCtr];
    const instance = new DogeTextAnimator(color, {x, y}, word, speed, cycles, fadeOutTime);
    this.instances.push(instance);
  }
  render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, width: number, height: number, absTime: number){
    if(width !== this.width || height !== this.height){
      canvas.width = width;
      canvas.height = height;
      this.width = width;
      this.height = height;
    }
    ctx.clearRect(0,0,width,height);
    this.instances = this.instances.filter((instance)=>!instance.canDispose(absTime, width, height));
    const fontScaleFactor = Math.round(Math.min(width,height)/21);
    this.instances.forEach((instance)=>{
      const config = instance.render(absTime);
      ctx.fillStyle = config.color;
      ctx.font = `${fontScaleFactor*config.scale}px "Comic Sans MS", "Comic Sans", "Chalkboard SE", "Comic Neue", sans-serif`;
      const textMetrics = ctx.measureText(config.text);
      const calcX = config.position.x*(width-2*fontScaleFactor)+fontScaleFactor;
      const calcY = config.position.y*(height-2*fontScaleFactor)+fontScaleFactor;
      const x = Math.min(Math.max(8, calcX - textMetrics.width/2), width-textMetrics.width-8);
      ctx.globalAlpha = config.opacity*this.globalOpacity;
      ctx.fillText(config.text, x, calcY);
    });
  }

}

export {
  DogeTextRunner,
}