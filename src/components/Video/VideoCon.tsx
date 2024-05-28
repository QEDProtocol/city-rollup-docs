import BrowserOnly from "@docusaurus/BrowserOnly";
import Video, { VideoProps } from "./index";

const VideoCon: React.FC<VideoProps & { width?: string, height?: string }> = ({ width, height, ...rest }) => {
  return <div style={{ width: width, height }}>
    <BrowserOnly>
      {() => <Video {...rest}></Video>}
    </BrowserOnly>
  </div>;
}


export default VideoCon;