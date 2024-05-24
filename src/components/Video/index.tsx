import React, { VideoHTMLAttributes } from 'react'
import styles from './styles.module.css';
//import NextImage, { ImageProps } from 'next/image'
//@ts-ignore
interface VideoProps extends React.DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>> {}
const Video = ({ ...rest }: VideoProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  React.useEffect(() => {
    if (videoRef.current) {
      const cur = videoRef.current
      const onPlay = () => {
        setIsPlaying(true)
      }
      const onPause = () => {
        setIsPlaying(false)
      }
      cur.addEventListener('play', onPlay)
      cur.addEventListener('pause', onPause)

      if (isPlaying !== !cur.paused) {
        setIsPlaying(!cur.paused)
      }
      return () => {
        if (cur) {
          cur.removeEventListener('play', onPlay)
          cur.removeEventListener('pause', onPause)
        }
      }
    }
  }, [videoRef])
  return (
    <div className={styles.videoContainer}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        autoPlay={true}
        loop={true}
        muted={true}
        playsInline={true}
        controls={isPlaying}
        {...rest}
        className={styles.videoInner}
        style={{ maxWidth: '100%', maxHeight: "800px" }}
        onClick={() => {
          if (videoRef.current) {
            setIsPlaying(false);
            videoRef.current.pause()
          }
        }}
      />
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className={styles.videoOverlay}
        style={isPlaying ? { display: 'none' } : {}}
        onClick={() => {
          if (videoRef.current) {
            if (!isPlaying) {
              videoRef.current.play()
            }
          }
        }}
      >
        <img src="/img/play-circle.png" alt="play" width="25%" />
      </div>
    </div>
  )
}
export type {
  VideoProps,
}
export default Video
