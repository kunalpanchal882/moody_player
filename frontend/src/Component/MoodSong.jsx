import { IoIosPlayCircle } from "react-icons/io";
import { IoPauseCircleSharp } from "react-icons/io5";
import "../Component/MoodSong.css";
import { useState } from "react";


const MoodSong = ({songs}) => {

    const [isPlaying, setisPlaying] = useState(null)

    const handelPlayPause = (index) => {
        if(isPlaying===index){
            setisPlaying(null)
        }else{
            setisPlaying(index)
        }
    }

  return (
    <div className='mood_songs'>
        <h2>Recomanded songs</h2>
        {songs.map((song,index) => (
            <div className='song_container' key={index}>
                <div className='title'>
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                </div>
                <div className='play_pause_btn'>
                    {
                        isPlaying === index &&
                        <audio src={song.audio} 
                    style={{
                        display:"none"
                    }} 
                    controls
                    autoPlay={isPlaying === index}
                    ></audio> }
                    <button onClick={() => handelPlayPause(index)}>
                        {isPlaying ===index ? <IoPauseCircleSharp /> : <IoIosPlayCircle />}
                    </button>
                </div>
            </div>  
        ))}
    </div>
  )
}

export default MoodSong