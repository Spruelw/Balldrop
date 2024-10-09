import  React,{useContext}from "react";
import {HighscoreValue} from "../App"


export default function HighscoreList(){
    const highScore = useContext(HighscoreValue)
    return(
    <div className="highscores-list">
                    <div className="highscore-entry">
                      <p>{highScore} Balls </p>
                    </div>
                </div>
    )
}