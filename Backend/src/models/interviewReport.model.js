const mongoose = require('mongoose');

/**
 * -Job description schema :String
 * -resume text :String
 * -self description :String
 * 
 * -matchScore : number 
 * 
 * -technical questions :[{
 *              question: "",
 *              answer: "",
 *              intention: ""
 *          }]
 * -behavior questions :[{
 *              question: "",
 *              answer: "",
 *              intention: ""
 *          }]
 * -skill gaps :[{
 *          skill: "",
 *          severity: {
 *              type: String,
 *              enum: ["low", "medium", "high"]
 *          },
 *          time needed: ""
 *      }]
 * -preparation plan :[{
 *      day: Number,
 *      focus: String,
 *      tasks: [String]
 *  }, {}, ....]
 */

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question is required']
    },
    answer: {
        type: String,
        required: [true, 'Answer is required']
    },
    intention: {
        type: String,
        required: [true, 'Intention is required']
    },
}, {
    _id: false,
});

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question is required']
    },
    answer: {
        type: String,
        required: [true, 'Answer is required']
    },
    intention: {
        type: String,
        required: [true, 'Intention is required']
    },
}, {
    _id: false,
});

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, 'Skill is required']
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: [true, 'Severity is required']
    },
    timeNeeded: {
        type: String,
        required: [true, 'Time needed is required']
    },
}, {
    _id: false,
});

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, 'Day is required']
    },
    focus: {
        type: String,
        required: [true, 'Focus is required']
    },
    tasks: {
        type: [String],
        required: [true, 'Tasks are required']
    },
}, {
    _id: false,
});

const interviewReportSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    jobDescription: {
        type: String,
        required: [true, 'Job description is required']
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: {
        type: [technicalQuestionSchema],
    },
    behavioralQuestions: {
        type: [behavioralQuestionSchema],
    },
    skillGaps: {
        type: [skillGapSchema],
    },
    preparationPlan: {
        type: [preparationPlanSchema],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
}, {
    timestamps: true,
});

const interviewReportModel = mongoose.model('InterviewReport', interviewReportSchema);

module.exports = interviewReportModel;