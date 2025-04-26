import generateContent from "../ai/ai.services.js";
import StudyModel from "../model/studyModel.js";
import LearningProgress from "../model/learningModel.js";
import QuizPerformance from "../model/Quizemodel.js";
import User from '../model/userModel.js'

export const aiRequest = ("/study", async (req, res) => {
  try {
    const { role, promptType, variables, courseId } = req.body;

    if (!role || !promptType || !variables) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const finalresponse = await generateContent(role, promptType, variables);
    if (!finalresponse) {
      return res.status(400).json({ error: "Error in AI generating content" });
    }

    if (role === "study") {
      const userId = req.userId; // Middleware se user ki ID le rahe hain

      const jsonString = finalresponse.replace(/```json\n|\n```/g, "").trim();
      const responseData = JSON.parse(jsonString);
      // **Step 1:** AI response ko `StudyModel` me store karo
      const studyData = new StudyModel({
        userId,
        studyContent: responseData,
        week: responseData.total_weeks,
      });

      console.log("responve=>", responseData);
      const learningProgress = await LearningProgress.findOne({ userId: userId });
      if (learningProgress) {
        learningProgress.ongoingTopics += 1;
        await learningProgress.save();
      };



      const savedStudy = await studyData.save(); // Database me save kiya


      // **Step 2:** Pehle check karo ki `LearningProgress` me user ka record hai ya nahi
      const existingProgress = await LearningProgress.findOne({ userId });

      if (!existingProgress) {
        // **Agar record nahi mila toh naya document create kar do**
        const newProgress = new LearningProgress({
          userId,
          totalCourses: [savedStudy._id] // Pehla course add ho raha hai
        });

        await newProgress.save();
      } else {
        // **Agar record mil gaya toh sirf course ki ID add karo**
        await LearningProgress.updateOne(
          { userId },
          { $push: { totalCourses: savedStudy._id } }
        );
      }
    }

    if (role === "performance") {
      const userId = req.userId; // Middleware se userId milega

      console.log("User ID:", userId);
      console.log("Course ID:", courseId);

      if (!finalresponse) {
        return res.status(400).json({ error: "Invalid response data from AI" });
      }

      try {
        // 🔹 AI response ko clean karke JSON me convert karna
        const jsonString = finalresponse.replace(/```json\n|\n```/g, "").trim();
        const responseData = JSON.parse(jsonString);

        // 🔹 Extracting important fields
        const { total_questions, correct_answers, wrong_answers, result } = responseData;

        if (!userId || total_questions === undefined || correct_answers === undefined || wrong_answers === undefined) {
          return res.status(400).json({ error: "Missing necessary fields from AI response" });
        }

        // 🔹 Pehle check karo ki user ka QuizPerformance doc hai ya nahi
        let quizPerformance = await QuizPerformance.findOne({ userId });
        let user = await User.findOne({ _id: userId });
        console.log("user found => ", user.point);

        if (!quizPerformance) {
          // Naya create karo agar doc nahi mila
          quizPerformance = new QuizPerformance({
            userId,
            quizzesTaken: 1,
            totalQuestions: total_questions,
            correctAnswers: correct_answers,
            wrongAnswers: wrong_answers,
          });
        } else {
          // Agar pehle se hai toh update karo
          quizPerformance.quizzesTaken += 1;
          quizPerformance.totalQuestions += total_questions;
          quizPerformance.correctAnswers += correct_answers;
          quizPerformance.wrongAnswers += wrong_answers;
          quizPerformance.averageScore = (
            (quizPerformance.correctAnswers / quizPerformance.totalQuestions) *
            100
          ).toFixed(2);
        }

        // 🔹 Study Model me Course ID ke basis pe data fetch karo
        let studyPlan = await StudyModel.findOne({ _id: courseId, userId });
        let learningProgress = await LearningProgress.findOne({ userId: userId });
        if (!studyPlan) {
          return res.status(404).json({ error: "Study plan not found for this user" });
        }

        // console.log("Existing Study Plan:", studyPlan);

        // 🔹 Agar AI response me result "Pass" hai to test count badhao
        if (result === "Pass") {
          studyPlan.test += 1;
          user.point += 5;
          await user.save();
        }

        // 🔹 Agar test count week ke equal ho gaya to complete = true
        if (studyPlan.test >= studyPlan.week) {
          studyPlan.completed = true;
          learningProgress.completedCourses += 1;
          learningProgress.ongoingTopics -= 1;
          await learningProgress.save();
        }

        // 🔹 Save both updated documents
        await quizPerformance.save();
        await studyPlan.save();

        return res.status(200).json({
          message: "Quiz Performance & Study Progress Updated Successfully",
          finalresponse: responseData, // JSON format me bhej rahe hai
        });

      } catch (error) {
        console.error("JSON Parse Error:", error);
        return res.status(500).json({ error: "Error parsing AI response" });
      }
    }


    return res.status(200).json({
      message: "AI Response Generated Successfully",
      finalresponse,
    });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
