import Quiz from '../models/Quiz.js'

// @desc    Get all quizzes for a document
// @route   GET /api/quizzes?documentId=...
// @route   GET /api/quizzes/document/:documentId
// @route   GET /api/documents/:id/quizzes
// @access  Private
export const getQuizzes = async (req, res, next) => {
  try {
    const documentId =
      req.params.documentId || req.params.id || req.query.documentId

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a documentId query parameter or URL parameter',
        statusCode: 400,
      })
    }

    const quizzes = await Quiz.find({
      userId: req.user._id,
      documentId,
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get a quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private
export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        statusCode: 404,
      })
    }

    res.status(200).json({
      success: true,
      data: quiz,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: 'Answers must be an array',
        statusCode: 400,
      })
    }

    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        statusCode: 404,
      })
    }

    if (quiz.completedAt) {
      return res.status(400).json({
        success: false,
        error: 'Quiz already completed',
        statusCode: 400,
      })
    }

    let correctCount = 0
    const userAnswers = []

    answers.forEach((answer) => {
      const { questionIndex, selectedAnswer } = answer

      if (questionIndex < quiz.questions.length) {
        const question = quiz.questions[questionIndex]
        const isCorrect = question.correctAnswer === selectedAnswer
        if (isCorrect) correctCount++

        userAnswers.push({
          questionIndex,
          selectedAnswer,
          isCorrect,
          answeredAt: new Date(),
        })
      }
    })

    const totalQuestions = quiz.questions.length
    const score = totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0

    quiz.userAnswers = userAnswers
    quiz.score = score
    quiz.completedAt = new Date()
    await quiz.save()

    res.status(200).json({
      success: true,
      data: {
        quizId: quiz._id,
        score,
        correctCount,
        totalQuestions,
        percentage: score,
        userAnswers,
      },
      message: 'Quiz submitted successfully',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get quiz results
// @route   GET /api/quizzes/:id/results
// @access  Private
export const getQuizResults = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('documentId', 'title')

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        statusCode: 404,
      })
    }

    if (!quiz.completedAt) {
      return res.status(400).json({
        success: false,
        error: 'Quiz has not been completed yet',
        statusCode: 400,
      })
    }

    const detailedResults = quiz.questions.map((question, index) => {
      const userAnswer = quiz.userAnswers.find((a) => a.questionIndex === index)
      return {
        questionIndex: index,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: userAnswer?.selectedAnswer || null,
        isCorrect: userAnswer?.isCorrect || false,
        explanation: question.explanation,
      }
    })

    res.status(200).json({
      success: true,
      data: {
        quiz: {
          id: quiz._id,
          title: quiz.title,
          document: quiz.documentId,
          score: quiz.score,
          totalQuestions: quiz.questions.length,
          completedAt: quiz.completedAt,
        },
        results: detailedResults,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private
export const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        statusCode: 404,
      })
    }

    await quiz.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}
