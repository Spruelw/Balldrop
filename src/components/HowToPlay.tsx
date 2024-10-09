import React from "react"
type setFirstClickFunction= {
    setFirstClick: ()=> void
}

const HowToPlay: React.FC<setFirstClickFunction> = (props: setFirstClickFunction) =>{
    function letsPlay(){
        props.setFirstClick()
    }

    return(
        <div className="how-to-play-container">
            <p>The rules are simple. Click the screen or press SPACEBAR to drop a ball. Drop as many balls as you can into the pipe in 30 seconds. Can you get all of them😈? </p>
            <button onClick={letsPlay}>PLAY</button>
        </div>
    )
}

export default HowToPlay