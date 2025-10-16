import { useState, useEffect } from "react";
import GameContainer from "./GameContainer";

export default function VennDiagram() {
    const [u, setU] = useState([]);
    const [a, setA] = useState([]);
    const [b, setB] = useState([]);
    const [c, setC] = useState([]);
    const [aIBIC, setAIBIC] = useState([]);
    const [aIC, setAIC] = useState([]);
    const [aIB, setAIB] = useState([]);
    const [bIC, setBIC] = useState([]);

    const [feedback, setFeedback] = useState("");
    const [score, setScore] = useState(() => parseInt(localStorage.getItem("vennScore") || 0));
    const [questionNumber, setQuestionNumber] = useState(() => parseInt(localStorage.getItem("vennQuestionNumber") || 0));

    const [questionTime, setquestionTime] = useState(() => parseInt(localStorage.getItem("vennQuestionTime") || 0));

    const [currentQuestion, setCurrentQuestion] = useState({});

    const generateRandomValues = () => {
        let tempU = [];

        while (tempU.length < 20) {
            let randomNumber = Math.floor(Math.random() * 30) + 1;
            if (!tempU.includes(randomNumber)) tempU.push(randomNumber);
        }

        let tempA = [];
        let tempB = [];
        let tempC = [];
        let tempAIB = [];
        let tempBIC = [];
        let tempAIC = [];
        let tempAIBIC = [];

        tempU.forEach((number) => {
            if (Math.random() > 0.5 && tempA.length < 10) tempA.push(number);
            if (Math.random() > 0.5 && tempB.length < 10) tempB.push(number);
            if (Math.random() > 0.5 && tempC.length < 10) tempC.push(number);
        });

        tempU = tempU.filter(v => !tempA.includes(v) && !tempB.includes(v) && !tempC.includes(v));

        tempA.forEach((value) => {
            if (tempB.includes(value)) tempAIB.push(value);
            if (tempC.includes(value)) tempAIC.push(value);
            if (tempB.includes(value) && tempC.includes(value)) tempAIBIC.push(value);
        });

        tempB.forEach((value) => {
            if (tempC.includes(value)) tempBIC.push(value);
        });

        tempA = tempA.filter(v => !tempAIB.includes(v) && !tempAIC.includes(v) && !tempAIBIC.includes(v));
        tempB = tempB.filter(v => !tempAIB.includes(v) && !tempBIC.includes(v) && !tempAIBIC.includes(v));
        tempC = tempC.filter(v => !tempAIC.includes(v) && !tempBIC.includes(v) && !tempAIBIC.includes(v));

        tempAIB = tempAIB.filter(v => !tempAIBIC.includes(v));
        tempAIC = tempAIC.filter(v => !tempAIBIC.includes(v));
        tempBIC = tempBIC.filter(v => !tempAIBIC.includes(v));


        setU(tempU.filter(v => !tempA.includes(v) && !tempB.includes(v) && !tempC.includes(v)));
        setA(tempA);
        setB(tempB);
        setC(tempC);
        setAIB(tempAIB);
        setAIC(tempAIC);
        setBIC(tempBIC);
        setAIBIC(tempAIBIC);
    };

    const generateQuestion = () => {
        const sets = [
            { name: "U - (A U B U C)", values: u },
            { name: "U", values: [...new Set([ ...u, ...a, ...b, ...c, ...aIB, ...aIC, ...bIC, ...aIBIC])] },
            { name: "(A ∩ B ∩ C)", values: aIBIC },
            { name: "(A U B U C)", values: [...new Set([...a, ...b, ...c, ...aIB, ...aIC, ...bIC, ...aIBIC])] },
            { name: "(A ∩ B) - (A ∩ B ∩ C)", values: aIB },
            { name: "(A ∩ C) - (A ∩ B ∩ C)", values: aIC },
            { name: "(B ∩ C) - (A ∩ B ∩ C)", values: bIC },
            { name: "(A ∩ B ∩ C)ᶜ", values: [...new Set([...u, ...a, ...b, ...c, ...bIC, ...aIB, ...aIC])] },
            { name: "(A U B U C)ᶜ", values: u },
            { name: "(A U B U C) - U", values: [] },
        ];

        const randomSet = sets[Math.floor(Math.random() * sets.length)];
        const type = Math.floor(Math.random() * 3);

        let questionText = "";
        if (type === 0) questionText = `¿Que valores conforman el conjunto ${randomSet.name}?`;
        else if (type === 1) questionText = `¿A que conjunto pertenecen estos valores  {${randomSet.values.join(", ")}}?`;
        else questionText = `¿A que conjunto pertenecen estos valores  {${randomSet.values.join(", ")}}?`;
        
        let options = [];
        let usedIndexes = new Set();
        
        const correctRes = Math.floor(Math.random() * 6);
        
        if (type === 0) {
            for (let i = 0; i < 6; i++) {
                if (i === correctRes) {
                    options.push({
                        label: randomSet.values.join(", "),
                        values: randomSet.name,
                        correct: true,
                    });
                } else {
    
                    let randIndex;
                    do {
                        randIndex = Math.floor(Math.random() * sets.length);
                    } while (randIndex === sets.indexOf(randomSet) || usedIndexes.has(randIndex));
                    
                    usedIndexes.add(randIndex);
    
                    options.push({
                        label: sets[randIndex].values.join(", "),
                        values: sets[randIndex].name,
                        correct: false,
                    });
                }
            }
        }else{
            for (let i = 0; i < 6; i++) {
                if (i === correctRes) {
                    options.push({
                        label: randomSet.name,
                        values: randomSet.values,
                        correct: true,
                    });
                } else {
    
                    let randIndex;
                    do {
                        randIndex = Math.floor(Math.random() * sets.length);
                    } while (randIndex === sets.indexOf(randomSet) || usedIndexes.has(randIndex));
                    
                    usedIndexes.add(randIndex);
    
                    options.push({
                        label: sets[randIndex].name,
                        values: sets[randIndex].values,
                        correct: false,
                    });
                }
            }
        }

        if(score >= 100) {
            setFeedback("Felicidades, has completado el juego!");
            setTimeout(() => {
                setScore(0);
                setQuestionNumber(0);
                localStorage.setItem("vennScore", 0);
                localStorage.setItem("vennQuestionNumber", 0);
            }, 2000);
        }else if(score < 0) {
            setFeedback("Has perdido, intenta de nuevo!");
            setTimeout(() => {
                setScore(0);
                setQuestionNumber(0);
                localStorage.setItem("vennScore", 0);
                localStorage.setItem("vennQuestionNumber", 0);
            }, 2000);
        }

        setCurrentQuestion({
            text: questionText,
            correctAnswer: randomSet.name,
            options,
        });
        setFeedback("");
        setquestionTime(60);
    };

    const handleAnswer = (option) => {
        let newQuestionNumber = 0;

        if (option.correct) {
            setFeedback("Correcto!!!! + 10 puntos");
            setScore(score + 10);
            localStorage.setItem("vennScore", score - 10);
            newQuestionNumber = questionNumber + 1;

        } else {
            setFeedback("Incorrecto!! -10 puntos");
            if(score - 10 < 0){
                setScore(0) 
                setQuestionNumber(0);
                setFeedback("Has perdido, intenta de nuevo!");
            }else{
                setScore(score - 10);
                newQuestionNumber = questionNumber + 1;
            };
        }
        
        setQuestionNumber(newQuestionNumber);

        setTimeout(() => {
            generateRandomValues();
        }, 2000);
    };

    const updateTime = () => {
        if (questionTime > 0) {
            setquestionTime(questionTime - 1);
        } else {
            setFeedback("Tiempo agotado!! -10 puntos");
            if(score - 10 < 0){
                setScore(0) 
                localStorage.setItem("vennScore", 0);
                localStorage.setItem("vennQuestionNumber", 0);
                setFeedback("Has perdido, intenta de nuevo!");
                setQuestionNumber(0);
            }else{
                setScore(score - 10);
            };
            localStorage.setItem("vennScore", score - 10);
            setTimeout(() => {
                generateQuestion();
            }, 2000);
        }
    }
    
    useEffect(() => {
        const interval = setInterval(() => {
            updateTime();
        }, 1000);
        return () => clearInterval(interval);
    }, [questionTime]);

    useEffect(() => {
        generateRandomValues();
    }, []);

    useEffect(() => {
        if (a.length || b.length || c.length) generateQuestion();
    }, [a, b, c]);

    return (
        <GameContainer>
            <div className="w-full flex justify-between px-10 py-2 text-white text-lg">
                <p>Pregunta #: <span className="font-bold">{questionNumber}</span></p>
                <p>Puntos: <span className="font-bold">{score}</span></p>
            </div>
            <div className="top-0 w-full fixed ">
                <progress className="w-full" value={questionTime} max={60}></progress>
            </div>
            <div className="w-[95%] min-h-fit overflow-hidden rounded-md h-full flex items-center justify-center py-10 border border-white mt-4 relative after:content-['U'] after:absolute after:top-3.5 after:left-3 after:text-white after:text-xl">
                <div id="U" className="absolute top-12 left-4 text-white text-xl">{u.join(", ")}</div>

                <div className="border-white border w-80 h-80 rounded-full text-white px-4 py-2 relative -translate-y-20 after:content-['A'] after:absolute after:top-10 after:-left-1 after:text-white after:text-xl">
                    <div className="absolute top-20 left-10 max-w-28 ">{a.join(", ")}</div>
                    <div className="absolute bottom-5 right-34 max-w-20 ">{aIC.join(", ")}</div>
                    <div className="absolute top-16 right-8 max-w-22">{aIB.join(", ")}</div>
                </div>

                <div className="border-white border w-80 h-80 -mx-60 translate-y-20 rounded-full text-white px-4 py-2 relative after:content-['C'] after:absolute after:bottom-4 after:right-10 after:text-white after:text-xl">
                    <div className="absolute bottom-10 right-20 max-w-36">{c.join(", ")}</div>
                    <div className="absolute top-5 left-28 max-w-24">{aIBIC.join(", ")}</div>
                </div>

                <div className="border-white border w-80 h-80 rounded-full text-white px-4 py-2 relative -translate-y-20 after:content-['B'] after:absolute after:top-5 after:right-2 after:text-white after:text-xl">
                    <div className="absolute top-14 right-12 max-w-24 ">{b.join(", ")}</div>
                    <div className="absolute bottom-10 right-22 max-w-20 ">{bIC.join(", ")}</div>
                </div>
            </div>

            <div className="w-full border-t mt-10 border-[#ffffff] h-[40%] text-white flex flex-col items-center justify-center">
                {feedback ? (
                    <p className={`text-xl mb-4 p-2 rounded-md ${feedback.includes("Correcto") ? "text-blue-400" : "text-red-500"}`}>
                        {feedback}
                    </p>
                ) : (
                    <>
                        <p className="text-white text-xl mb-4 text-center px-4">
                            {currentQuestion.text || "Generando pregunta..."}
                        </p>
                        <div className="grid grid-cols-3 px-10 pb-5 gap-4">
                            {currentQuestion?.options?.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(option)}
                                    className="border border-[#ffffff] rounded-md px-10 sm:px-32 hover:bg-blue-400 cursor-pointer py-3 transition duration-300"
                                    disabled={!!feedback}
                                >
                                    {option.label.length > 0 ? option.label : "{∅}"}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </GameContainer>
    );
}
