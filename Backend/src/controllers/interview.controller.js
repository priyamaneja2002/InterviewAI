const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description generate new interview report on the basis of user self description, resume pdf and job description
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */

async function generateInterviewReportController (req, res) {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer)).getText())
    const { selfDescription, jobDescription } = req.body

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user._id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    res.status(201).json({
        message: 'Interview report generated successfully',
        interviewReport
    })

}

/**
 * @description get interview report by interviewId
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */

async function getInterviewReportByIdController (req, res) {
    const { interviewId } = req.params
    const interviewReport = await interviewReportModel.findById(interviewId)
    if (!interviewReport) {
        return res.status(404).json({
            message: 'Interview report not found'
        })
    }
    return res.status(200).json({
        message: 'Interview report fetched successfully',
        interviewReport
    })
}

/**
 * @description get all interview reports for the authenticated user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */

async function getAllInterviewReportsController (req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user._id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
    if (!interviewReports) {
        return res.status(404).json({
            message: 'No interview reports found'
        })
    }
    return res.status(200).json({
        message: 'Interview reports fetched successfully',
        interviewReports
    })
}

/**
 * @description generate resume pdf for the interview report
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */

async function generateResumePdfController (req, res) {
    const { interviewReportId } = req.params
    const interviewReport = await interviewReportModel.findById(interviewReportId)
    if (!interviewReport) {
        return res.status(404).json({
            message: 'Interview report not found'
        })
    }

    const pdfBuffer = await generateResumePdf({
        resume: interviewReport.resume,
        selfDescription: interviewReport.selfDescription,
        jobDescription: interviewReport.jobDescription
    })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="resume_${interviewReportId}.pdf"`,
        "Content-Length": pdfBuffer.length
    })

    return res.status(200).send(pdfBuffer)
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }