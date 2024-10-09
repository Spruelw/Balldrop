import React, { useState, useEffect, useRef, useCallback, createContext } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import Alert from '@mui/material/Alert'
import { styled } from '@mui/system';
import HowToPlay from './components/HowToPlay';

const StyledAlert = styled(Alert)({
  position: "relative",
  top: "-50vh",
  color: 'white',
  backgroundColor: '#ee4b6a',
  zIndex: 7,
  padding: "5px",
  paddingInline: "10px"
});

var ballNumbers: number[] = []
for (var i = 0; i < 30; i++) {
  ballNumbers.push(i)
}

export const HighscoreValue = createContext<number | null>(null)

function App() {
  var listOfBalls = document.querySelectorAll<HTMLElement>(".ball-container .ball")
  const [firstClick, setFirstClick] = useState(false)
  const [ballCount, setBallCount] = useState(30)
  const [gameStarted, setGameStarted] = useState(false)
  const [time, setTime] = useState(30)
  const [score, setScore] = useState(0)
  const [countdown, setCountdown] = useState(3)
  const [showCountdown, setShowCountdown] = useState(false)
  const [newHighScore, setNewHighScore] = useState(false)
  const pipe = useRef<HTMLImageElement>(null)
  const ballContainer = useRef<HTMLDivElement>(null)
  const clickToStart = useRef<HTMLParagraphElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const appDiv = useRef<HTMLDivElement>(null)
  const [mainMusic] = useState(new Audio("/audio/main.mp3"))
  const [tenseMusic] = useState(new Audio("/audio/tense.mp3"))
  const [highScore, setHighScore] = useState<number>(0) //props to pass down to HighscoreList  

  function startCountdown() {
    setShowCountdown(true)
  }

  function startGame(): void {
    setGameStarted(true)
  }

  //get position of ball and add drop class
  function dropABall() {
    var ball = listOfBalls[ballCount - 1];
    var { left, top } = ball.getBoundingClientRect()
    ball.style.cssText = `position:fixed; left:${left}px; top: ${top}px`
    ball.classList.add("drop-down")
    setBallCount(ballCount - 1)
  }

  //check if the ball and pipe intersect and update score
  function isIntersecting() {
    var listOfBalls = document.querySelectorAll<HTMLElement>(".ball-container .ball");
    var count = 0;
    listOfBalls.forEach((ball) => {
      let overlap = null
      var pipePosition = pipe.current!.getBoundingClientRect()
      var ballPosition = ball.getBoundingClientRect()
      if (pipePosition.right < ballPosition.left ||
        pipePosition.left > ballPosition.right ||
        pipePosition.bottom < ballPosition.top ||
        pipePosition.top > ballPosition.bottom) {
        overlap = false
      } else {
        overlap = true
      }
      overlap && count++
    })
    setScore(count)
  }

  // start game or drop a ball
  function isGameStarted() {
    if (gameStarted === false) {
      startCountdown()
    }
    else if (ballCount === 0) {
      setTimeout(() => {
        endGame()
      }, 530)
    }
    else {
      setTimeout(() => { dropABall() }, 10)
    }
  }

  //triggers event that conditionaly renders the highscore popup 
  function showNewHighScore(): void {
    setNewHighScore(true)
    setTimeout(() => {
      setNewHighScore(false)
    }, 3000)
  }

  //callback to start music when play is pressed, and start the side-to-side animation
  var letsPLay = useCallback(() => {
    setFirstClick(!firstClick)
    mainMusic.play()
    mainMusic.loop = true
    appDiv.current!.focus() //tracks keydown event
    setTimeout(() => {
      ballContainer.current!.style.animation = "leftToRight 4s linear infinite"
      clickToStart.current!.style.display = "none"
      clickToStart.current!.style.display = "block"
    }, 200)
  }, [firstClick, mainMusic])

  // set gamestart to false and play correct music
  var endGame = useCallback(() => {
    setGameStarted(false)
    tenseMusic.pause()
    mainMusic.play()
  }, [tenseMusic, mainMusic])

  //plays sound effect and pipe effect when score changes
  useEffect(() => {
    const bubbleSound = new Audio("/audio/bubble_pop.mp3")
    if (score > 0) {
      bubbleSound.play()
      pipe.current!.style.opacity = ".2"
      setTimeout(() => {
        pipe.current!.style.opacity = "1"
      }, 50)
    }
  }, [score])

  //play tense music when game starts
  useEffect(() => {
    if (gameStarted) {
      mainMusic.pause()
      tenseMusic.play()
      tenseMusic.loop = true
    }
  }, [gameStarted, tenseMusic, mainMusic])

  //showCountdown sideeffects
  useEffect(() => {
    if (showCountdown) {
      for (let i = 1; i < 4; i++) {
        setTimeout(() => {
          setCountdown((prev) => prev - 1)
        }, i * 1100)
      }
    }
  }, [showCountdown])

  //countdown sideeffects
  useEffect(() => {
    if (countdown < 1) {
      startGame()
      setCountdown(3)
      setShowCountdown(false)
    }
  }, [countdown])

  // when a balldrops, check amout of balls touching pipe
  useEffect(() => {
    setTimeout(() => {
      isIntersecting()
    }, 500)
  }, [ballCount])

  //check if game is started, start timer and watch for when to end the game
  useEffect(() => {
    if (gameStarted) {
      setTimeout(() => {
        setTime(time - 1)
      }, 1000)

      // end the game when time or ballcount runs out
      setTimeout(() => {
        if (ballCount < 1 || time < 1) {
          endGame()
        }
      }, 500)

      clickToStart.current!.style.display = "none"
    }

    else {// resets everything and shows highscore
      setTime(30)
      setBallCount(30)
      setScore(0)
      clickToStart.current!.style.display = "block"
      listOfBalls.forEach((ball) => { //reset ball position and class
        ball.style.cssText = "position: absolute;top:9vh;"
        ball.classList.remove("drop-down")
      })

      if (score > highScore) { //shows new high score
        setHighScore(score)
        showNewHighScore()
      }
    }
  }, [gameStarted, listOfBalls, time, ballCount, endGame, score, highScore])


  return (
    <div className="App" ref={appDiv} tabIndex={0} onKeyUp={(e) => { if (e.key === ' ') { isGameStarted() } }}>
      <HighscoreValue.Provider value={highScore}>
        <NavBar endGame={endGame} />
      </HighscoreValue.Provider>
      {!firstClick ? <HowToPlay setFirstClick={letsPLay} /> : null}
      <div className='app-body' onClick={isGameStarted}>

        <div className='metrics'>
          <p className='ball-count'>Balls:  <span>{ballCount}</span> </p>
          <p className='score'>Score:  <span>{score}</span></p>
          <p className='time'>Time:   {time} </p>
        </div>

        <div className='ball-container' ref={ballContainer}>
          {ballNumbers.map((item: any, index: number) => {
            return (<img className='ball ' src='/images/ball.png' alt='a ball' key={index} />)
          })}
        </div>

        <p className='click-to-start' ref={clickToStart}> Click or press SPACEBAR to start</p>
        {showCountdown ? <StyledAlert ref={alertRef} className="highscore-alert" severity="success" variant='filled'>
          Start in {countdown}
        </StyledAlert> : null}

        {newHighScore ? <StyledAlert ref={alertRef} className="highscore-alert" severity="success" variant='filled'>
          New Highscore {highScore}
        </StyledAlert> : null}

        <img className="pipe" ref={pipe} src='/images/pipe.png' alt='blue pipe' />
      </div>
    </div>
  );
}
export default App;
