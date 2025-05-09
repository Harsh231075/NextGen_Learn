const prompts = {
  study_plan: `
  I want to learn {course} for {week} weeks. My level is {level}.
  Output must be strictly in JSON format:

  {
    "study_topic": "<Topic Name>",
    "difficulty": "<Beginner/Intermediate/Advanced>",
    "total_weeks": <Total Number of Weeks>,
    "weekly_plan": [
      {
        "week": <Week Number>,
        "title": "<Week Title>",
        "topics": ["Topic 1", "Topic 2"],
        "resources": [
          {"name": "<Resource Name>", "url": "<Resource URL>" }
        ],
        "project": "<Project Description>",
        "notes": {
          "Topic 1": "<Detailed Notes with explanations, examples, and real-world applications>",
          "Topic 2": "<Comprehensive breakdown, key concepts, and practical scenarios>"
        }
      }
    ]
  }
  `,

  summary: `Summarize the following text in simple terms: {text}`,

  interview_questions: `Generate 5 interview questions for a {role} position in {domain}.`,

  quiz: `Generate a quiz on  {tilte} and topics is {topics} . Output must be JSON formatted:
  {
    "quiz_topic": "<Topic Name>",
    "difficulty": "<Beginner/Intermediate/Advanced>",
    "questions": [
      {
        "question": "<Question Text>",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "<Correct Answer>",
        "explanation": "<Short explanation for the correct answer>"
      }
    ]
  }
  `,

  quiz_evaluation: `
  Mene tumhe {total_questions} question aur answers diye hain.
  Tumhe check karna hai ki user ke kitne answers sahi hain aur kitne galat.
  Agar {pass_threshold} se zyada sahi answers hain to "Pass" karna,
  warna "Fail" aur feedback provide karna.

  Ye raha quiz data:
  {quiz}

  Ye raha user ka response:
  {user_answers}

  tumhe quize me se match karna h ki user ke answer kitane sahi h , agar tu 7 sahi h tu pass kar dena , agar tu 7 se kam sahi answer diye tu fail kar dena okay.

  Tumhe response is format me dena hai and tum koi dursa template nhi use karoge okay tumhe tumhara response issi me dena har bar must h :

  {
    "total_questions": {total_questions},
    "correct_answers": <Number of correct answers>,
    "wrong_answers": <Number of incorrect answers>,
    "result": "<Pass/Fail>",
    "feedback": {
      "wrong_questions": [
        {
          "question": "<Question Text>",
          "correct_answer": "<Correct Answer>",
          "user_answer": "<User's Answer>",
          "explanation": "<Explanation of the correct answer>",
          "resources": [
            {"name": "<Resource Name>", "url": "<Resource URL>" }
          ]
        }
      ]
    }
  }

  Criteria:
  - Agar user ke {pass_threshold} ya usse zyada sahi answers hain, result "Pass" hoga.
  - Agar kam sahi hain to result "Fail" hoga aur feedback diya jayega.
`,

  confuse_user: `
 meko thoda confuse ho tu tum meko mere liye best caree path bato samjhe, jo tumhe system instruction me likha h :
 ye mene kuch mere interset ki feild batai h tu mere best caree path batao okay =>

  {my_choice}

  tumhe respone iss fomated me dena Example  = 


      "recommended_paths": [
        {
          "title": "Career Path: Front-End Web Developer",
          "summary": "Front-end developers are responsible for the user-facing part of websites and applications. They use HTML, CSS, and JavaScript to create interactive and visually appealing interfaces.  This involves working with frameworks like React, Angular, or Vue.js and ensuring responsiveness across different devices.",
          "why_suitable": "Builds upon existing HTML/CSS skills. Leverages Python experience through back-end integration and potential scripting. Aligns with the interest in web development and practical experience with a portfolio website. A good entry point into the programming world."
        },
        {
          "title": "Career Path: Data Analyst (with Python Focus)",
          "summary": "Data analysts use programming languages like Python (with libraries like Pandas, NumPy, and Scikit-learn) to collect, clean, analyze, and visualize data. They identify trends, patterns, and insights to help organizations make informed decisions.  Requires strong analytical and problem-solving skills.",
          "why_suitable": "Directly leverages existing Python experience. Aligns with the interest in data analysis.  A practical application of programming skills with tangible results. Good career path with high demand."
        },
        {
          "title": "Course: Full-Stack Web Development Bootcamp",
          "summary": "Intensive, immersive programs that teach you the fundamentals of both front-end and back-end web development.  They typically cover HTML, CSS, JavaScript, a back-end language like Python or Node.js, database management, and deployment.",
          "why_suitable": "Provides a structured learning path to become a versatile web developer. Complements existing HTML/CSS and Python knowledge. Offers a fast track to acquiring job-ready skills. Beneficial given their experience with a portfolio website."
        },
        {
          "title": "Course: Python for Data Science and Machine Learning",
          "summary": "A focused course on using Python and its related libraries for data analysis, visualization, and machine learning tasks.  Covers topics like data manipulation, statistical analysis, and model building.",
          "why_suitable": "Specifically targets the user's interest in data analysis while deepening their Python skills. Provides a concrete skill set for a growing field.  Offers a more focused alternative to a broad data science degree."
        },
        {
          "title": "Career Path: Back-End Developer (Python)",
          "summary": "Back-end developers are responsible for the server-side logic, databases, and APIs that power websites and applications. They use languages like Python (with frameworks like Django or Flask) to build robust and scalable systems.",
          "why_suitable": "Utilizes their existing Python experience. Allows them to work on the 'behind-the-scenes' aspects of web applications, offering a different perspective than front-end development. A necessary skill for full-stack development, aligning with programming goals."
        }
      ]
    }


🔹 
`,


  mentor_test: `You are an expert mentor and test paper generator.

A user has submitted a form to become a mentor, and based on the following details, you are to create a **tough test paper** to evaluate their knowledge and suitability.

Here are the details:
{{test}}



 Your task is to generate a test paper that includes:
1. At least **10 multiple-choice questions (MCQs)** with 4 options each, and only one correct answer.
2. At least **5 written (descriptive) questions** that deeply test the user’s understanding.
3. The paper should reflect **intermediate to advanced** difficulty based on the user's stated knowledge and learning approach.
4. Questions should be based on the selectedCourse and also include general technical and mentoring-related questions based on the user's experience and goals.

### Output Format:
Return the final paper in the following **JSON structure**:

json
{
  "mentor_test": {
    "mcq": [
      {
        "question": "Your MCQ question here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
      },
      ...
    ],
      "written": [
        {
          "question": "Your written question here?"
        },
        ...
    ]
  }
}
`,

  mentor_test_check: `You are a strict but fair AI-based evaluator.

You will receive a variable called {{mentor_test_check}}, containing:
- A list of multiple-choice questions (mcq) where each item has:
  - question: The question asked.
  - selectedAnswer: The answer chosen by the user.

- A list of written-response questions (written) where each item has:
  - question: The open-ended question asked.
  - answer: The response written by the user.

Your tasks are:

### 1. Evaluate MCQs
- Use your domain knowledge to infer the **correct answer** for each question.
- Compare the user's selectedAnswer with your inferred answer.
- Return:
  - isCorrect: true or false
  - correctAnswer: the inferred correct answer
  - feedback: short feedback (only if incorrect)

### 2. Evaluate Written Answers
- Read the response and rate it on clarity, accuracy, and depth.
- Give:
  - score: from 0 to 10
  - evaluation: "satisfactory" if score ≥ 6, otherwise "needs improvement"
  - feedback: what was good or missing in the answer

### 3. Final Decision
- Calculate total marks:
  - Each correct MCQ = 1 mark
  - Written total = sum of scores (out of 10 per question)
- If total score ≥ 70% of the max possible, then:
  - "status": "pass"
  - Add a motivating "message" like "Congratulations! You're ready to be a mentor!"
- Otherwise:
  - "status": "fail"
  - Give a helpful "message" with suggestions to improve.

### Output JSON format:  
Return the entire evaluation as a JSON constant named mentor_test_result:

json
{
  "status": "pass" or "fail",
    "message": "Motivational or improvement message",
      "mcqAnalysis": [
        {
          "question": "string",
          "selectedAnswer": "string",
          "correctAnswer": "string (inferred by you)",
          "isCorrect": true or false,
          "feedback": "string (if incorrect)"
        }
      ],
        "writtenAnalysis": [
          {
            "question": "string",
            "answer": "string",
            "score": number(0 - 10),
            "evaluation": "satisfactory" or "needs improvement",
            "feedback": "string"
          }
        ]
}

{mentor_test}
`


};

export const getFormattedPrompt = (promptType, variables) => {
  if (!prompts[promptType]) {
    throw new Error("Invalid prompt type");
  }

  let formattedPrompt = prompts[promptType];

  for (const key in variables) {
    formattedPrompt = formattedPrompt.replace(`{${key}}`, JSON.stringify(variables[key]));
  }

  return formattedPrompt;
};
