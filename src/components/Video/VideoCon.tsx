import Video, { VideoProps } from "./index";

const VideoCon: React.FC<VideoProps & {width?: string, height?: string}> = ({ width, height, ...rest }) => {
  return <div style={{ width: width, height }}>
    <Video {...rest}></Video>
    </div>;
}


export default VideoCon;