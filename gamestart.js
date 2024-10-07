import React, { Component } from 'react';
import 'App.css'; // Ensure your font is imported in this file
import data from 'planets.json'; // Correctly import your JSON data

class App2 extends Component {
  render() {
    const myStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundImage: "url('https://i.pinimg.com/originals/83/ea/58/83ea5842c1f9ff2f3a9761b6c17f3b32.gif')",
      height: "100vh",
      width: "100vw",
      zIndex: 0,
      backgroundSize: "cover",
      backgroundRepeat: "repeat",
    };
    return <div style={myStyle}></div>;
  }
}

class App3 extends Component {
  render() {
    return (
      <img
        src="https://art.pixilart.com/584674f4ef5a427.png"
        alt="Rocket"
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          height: "14vh",
          width: "12vw",
          zIndex: 1,
        }}
      />
    );
  }
}

const styles = {
  box: {
    padding: '20px 40px',
    margin: '10px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    fontSize: '30px',
    color: '#333',
    width: '200px',
    textAlign: 'center',
    animation: 'fall 30s linear forwards',
    transition: 'opacity 0.5s ease',
  },
  container: {
    position: 'absolute',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  inputInfo: {
    position: 'absolute',
    top: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '20px',
    padding: '10px',
    width: '300px',
    textAlign: 'center',
  },
  userInputDisplay: {
    position: 'fixed',
    bottom: '290px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '40px',
    color: 'yellow',
    fontFamily: 'SixtyfourConvergence',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: '10px',
    borderRadius: '10px',
  },
  gif: {
    width: '200px',
    height: 'auto',
    position: 'absolute',
    zIndex: 2,
  },
  congratulations: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '50px',
    color: 'green',
    fontFamily: 'SixtyfourConvergence',
    zIndex: 2,
    opacity: 1,
    transition: 'opacity 1s ease',
  },
};

// Keyframes for falling animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes fall {
    0% { transform: translateY(0); }
    100% { transform: translateY(80vh); }
}`, styleSheet.cssRules.length);

class QuestionBox extends Component {
  render() {
    const { question, isMatched, index } = this.props;

    return (
      <div style={{
        ...styles.box,
        backgroundColor: isMatched ? 'transparent' : 'white',
        animationDelay: `${index * 0.5}s`,
        opacity: isMatched ? 0 : 1,
      }}>
        {isMatched ? (
          <img
            src="https://media3.giphy.com/media/VzYcE4FrtkOhhgirkN/giphy.gif?cid=6c09b952gpthbos8bw17pha6rr2qrqbvtwed98ovdzivorbl&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s"
            alt="Correct Answer!"
            style={styles.gif}
          />
        ) : (
          question
        )}
      </div>
    );
  }
}

class GameComponents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      correctAnswers: [],
      allAnswered: false,
      questionIndex: 0,
      questions: this.getRandomQuestions(),
    };
  }

  getRandomQuestions = () => {
    // Shuffle planets and pick 5 unique questions
    const shuffledPlanets = data.sort(() => 0.5 - Math.random());
    return shuffledPlanets.slice(0, 5).map(item => ({
      question: `What type of planet is ${item.Name}?`,
      answer: item.Type.toLowerCase(),
    }));
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    this.startQuestionTimer();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    clearInterval(this.questionTimer); // Clear the timer when component unmounts
  }

  startQuestionTimer = () => {
    this.questionTimer = setInterval(() => {
      this.setState((prevState) => {
        // Move to the next question if we haven't displayed all
        if (prevState.questionIndex < 4) { // Change to < 4 for zero-based index
          return { questionIndex: prevState.questionIndex + 1 };
        }
        // Clear the timer if all questions have been displayed
        clearInterval(this.questionTimer);
        return null;
      });
    }, 3000); // 3000 ms = 3 seconds
  };

  handleKeyDown = (event) => {
    const { input, correctAnswers, questionIndex, questions } = this.state;

    // Allow letters, numbers, and spaces
    if (event.key.length === 1 && (event.key.match(/[a-zA-Z0-9 ]/))) {
      this.setState({ input: input + event.key });
    }

    // Handle the Enter key
    if (event.key === 'Enter') {
      // Only allow answering the question currently displayed
      if (questionIndex < questions.length) {
        const currentQuestion = questions[questionIndex];
        if (input.trim().toLowerCase() === currentQuestion.answer && !correctAnswers.includes(questionIndex)) {
          this.setState((prevState) => ({
            correctAnswers: [...prevState.correctAnswers, questionIndex],
            input: '', // Clear input after answering correctly
          }), () => {
            // Check if all questions have been answered
            if (this.state.correctAnswers.length === questions.length) {
              this.setState({ allAnswered: true });
              clearInterval(this.questionTimer); // Stop the timer if all answered
            }
          });
        }
      }
    }

    // Handle Backspace key
    if (event.key === 'Backspace') {
      this.setState({ input: input.slice(0, -1) });
    }
  };

  render() {
    const { correctAnswers, input, allAnswered, questionIndex, questions } = this.state;

    return (
      <div>
        <App2 />
        <App3 />
        <div style={styles.inputInfo}>Type your answer and press Enter!</div>
        <div style={styles.container}>
          {questions.map((item, index) => (
            (index <= questionIndex || correctAnswers.includes(index)) && (
              <QuestionBox key={index} question={item.question} isMatched={correctAnswers.includes(index)} index={index} />
            )
          ))}
        </div>
        <div style={styles.userInputDisplay}>
          {input}
        </div>
        {allAnswered && (
          <div style={styles.congratulations}>
            Congratulations!!!!
          </div>
        )}
      </div>
    );
  }
}

export default GameComponents;
