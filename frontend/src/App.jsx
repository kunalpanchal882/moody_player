import FaceExpressionDetector from './Component/FaceExpressionDetector '
import { useState } from 'react';
import MoodSong from "./Component/MoodSong";
function App() {

   const [songs, setsongs] = useState([
          
      ])

  return (
    <>
   <FaceExpressionDetector setsongs={setsongs}/>
    <MoodSong songs={songs}/>
    </>
  )
}

export default App
