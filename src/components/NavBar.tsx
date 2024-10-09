import React, { useState } from "react"
import HighscoreList from "./HighscoreList"


type endGameFunction =  {
    endGame: ()=>void,
}

const NavBar: React.FC<endGameFunction> = (props: endGameFunction) => {

    const [showHighscores, setShowHighscores] = useState(false)
    return (
        <div className="nav-bar">
            <button className="restart-button" onClick={props.endGame}>Restart</button>
            <div className="logo">
                <p className="logo-ball">Ball </p>
                <p className="logo-drop">Drop </p>
            </div>
            <div className="highscores-container">
                <button className="highscores-button" onClick={(): void => {
                    // show highscores on toggle 
                    setShowHighscores(!showHighscores)
                }}>Highscores</button>

                {showHighscores === true ? <HighscoreList /> : null}

            </div>
        </div>
    )

}

export default NavBar