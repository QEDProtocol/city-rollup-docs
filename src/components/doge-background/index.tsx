import clsx from 'clsx';
import styles from './styles.module.css';
import React, { useEffect, useRef } from 'react';
import { DogeTextRunner } from './dogeText';
import useResizeObserver from '@react-hook/resize-observer'

const useSize = (target: any) => {
  const [size, setSize] = React.useState<DOMRectReadOnly>()

  React.useLayoutEffect(() => {
    setSize(target.current.getBoundingClientRect())
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size
}
interface IDogeBackgroundProps {
  className?: string;
  words: string[];

}
const COLORS = ["#ffff00", "#ff0000", "#ff00ff","#00FFFF","#00FF00"];
function randColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];

}
const DogeBackground: React.FC<IDogeBackgroundProps> = ({className, words}: IDogeBackgroundProps)=>{
  const divRef = useRef<HTMLDivElement>(null);
  const canvRef = useRef<HTMLCanvasElement>(null);
  const size = useSize(divRef)
  const runnerRef = useRef<DogeTextRunner>(null);

  useEffect(()=>{
    if(size && canvRef.current){
      runnerRef.current = new DogeTextRunner(words, size.width, size.height, 0.5);
      let startTime = performance.now();
      let nextTime = 100;
      let cancelled = false;
      const animFrame = (dt: any) =>{
        if(!cancelled && runnerRef.current){
          window.requestAnimationFrame(animFrame);
          if((dt-startTime)>nextTime){
            runnerRef.current.addText(randColor(), 1000, 3, 1000);
            nextTime=1000*Math.random()+500;
            startTime = dt;
          }
          const ctx = canvRef.current.getContext('2d');
          if(ctx){
            runnerRef.current.render(canvRef.current, ctx, size.width, size.height, dt);
          }
        }

      };
      let handle = window.requestAnimationFrame(animFrame);
      return ()=>{
        cancelled = true;
        runnerRef.current = null;
        window.cancelAnimationFrame(handle)
      };

    }else{
      return ()=>{};
    }
  },[words, size, canvRef, runnerRef]);

  return(
  <div className={clsx(styles.dogeBackground, className)} ref={divRef}>
    <canvas className={styles.canvas} ref={canvRef} width={size?.width} height={size?.height}></canvas>
  </div>
  );
};

export default DogeBackground;