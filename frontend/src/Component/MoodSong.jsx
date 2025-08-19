import React, { useState } from 'react'
import { IoIosPlayCircle } from "react-icons/io";
import { IoPauseCircleSharp } from "react-icons/io5";
import "../Component/MoodSong.css";

const MoodSong = () => {


    const [songs, setsongs] = useState([
        {
            title:"test_title",
            artist:"test_artist",
            url:"test_url"
        },
        {
            title:"test_title",
            artist:"test_artist",
            url:"test_url"
        },
        {
            title:"test_title",
            artist:"test_artist",
            url:"test_url"
        },
    ])

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
                    <IoPauseCircleSharp />
                    <IoIosPlayCircle />
                </div>
            </div>  
        ))}
    </div>
  )
}

export default MoodSong