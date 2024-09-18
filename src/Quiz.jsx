// src/Quiz.js
import React, { useState, useEffect } from 'react';
import './App.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [fadeState, setFadeState] = useState('fade-in');

  useEffect(() => {
    
    fetch('https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple')
      .then(response => response.json())
      .then(data => {
        const formattedQuestions = data.results.map((question) => {
          const answerOptions = [...question.incorrect_answers];
          // Insert the correct answer at a random position
          const randomIndex = Math.floor(Math.random() * 4);
          answerOptions.splice(randomIndex, 0, question.correct_answer);
          return { ...question, answerOptions };
        });
        setQuestions(formattedQuestions);
      });
  }, []);

  const handleAnswerOptionClick = (answer) => {
    if (answer === questions[currentQuestionIndex].correct_answer) {
      setScore(score + 1);
    }
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    setFadeState('fade-out'); 
    setTimeout(() => {
      setSelectedAnswer(null);
      const nextQuestion = currentQuestionIndex + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestionIndex(nextQuestion);
      } else {
        setShowScore(true);
      }
      setFadeState('fade-in'); // Fade in new question
    }, 800); // Delay for animation
  };

  return (
    <div className="quiz">
      {showScore ? (
        <div className={`score-section ${fadeState}`}>
          You scored {score} out of {questions.length}
        </div>
      ) : (
        <>
          {questions.length > 0 && (
            <div className={fadeState}>
              <div className="question-section">
                <h2>
                  Question {currentQuestionIndex + 1}/{questions.length}
                </h2>
                <p dangerouslySetInnerHTML={{ __html: questions[currentQuestionIndex].question }} />
              </div>
              <div className="answer-section">
                {questions[currentQuestionIndex].answerOptions.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerOptionClick(answer)}
                    disabled={selectedAnswer}
                    className={
                      selectedAnswer === answer
                        ? answer === questions[currentQuestionIndex].correct_answer
                          ? 'correct'
                          : 'incorrect'
                        : ''
                    }
                    dangerouslySetInnerHTML={{ __html: answer }}
                  />
                ))}
              </div>
              {selectedAnswer && (
                <button className="next-btn" onClick={handleNextQuestion}>
                  {currentQuestionIndex + 1 < questions.length ? 'Next Question' : 'Finish Quiz'}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Quiz;
