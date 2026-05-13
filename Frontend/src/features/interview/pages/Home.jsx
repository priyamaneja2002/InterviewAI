import React, { useState, useRef } from 'react'
import "../style/Home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import AIThinking from '../../../components/loading/AIThinking'
import { EXPERIENCE_OPTIONS, getDummyJdForSelection, ROLE_OPTIONS } from '../jdTemplates'

const JD_CHAR_LIMIT = 5000
const RESUME_MAX_BYTES = 5 * 1024 * 1024 // 5MB

const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selectedRole, setSelectedRole] = useState("")
    const [selectedExperience, setSelectedExperience] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeFile, setResumeFile] = useState(null)
    const [resumeError, setResumeError] = useState(null)
    const [submitError, setSubmitError] = useState(null)
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleResumeChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > RESUME_MAX_BYTES) {
            setResumeError('That file is over 5MB. Please upload a smaller PDF or DOCX.')
            setResumeFile(null)
            if (resumeInputRef.current) resumeInputRef.current.value = ''
            return
        }

        setResumeError(null)
        setResumeFile(file)
    }

    const handleResumeClear = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setResumeFile(null)
        setResumeError(null)
        if (resumeInputRef.current) resumeInputRef.current.value = ''
    }

    const handleJdChange = (e) => {
        const value = e.target.value
        setJobDescription(value.length > JD_CHAR_LIMIT ? value.slice(0, JD_CHAR_LIMIT) : value)
    }

    const handleRoleChange = (e) => {
        const role = e.target.value
        setSelectedRole(role)
        if (!role || !selectedExperience) return

        const generatedJd = getDummyJdForSelection(role, selectedExperience)
        setJobDescription(generatedJd.length > JD_CHAR_LIMIT ? generatedJd.slice(0, JD_CHAR_LIMIT) : generatedJd)
    }

    const handleExperienceChange = (e) => {
        const experience = e.target.value
        setSelectedExperience(experience)
        if (!selectedRole || !experience) return

        const generatedJd = getDummyJdForSelection(selectedRole, experience)
        setJobDescription(generatedJd.length > JD_CHAR_LIMIT ? generatedJd.slice(0, JD_CHAR_LIMIT) : generatedJd)
    }

    const canSubmit =
        jobDescription.trim().length > 0 &&
        (resumeFile || selfDescription.trim().length > 0)

    const handleGenerateReport = async () => {
        setSubmitError(null)

        if (!jobDescription.trim()) {
            setSubmitError('Please paste the job description first.')
            return
        }
        if (!resumeFile && !selfDescription.trim()) {
            setSubmitError('Add a resume or a short self-description so we can tailor your plan.')
            return
        }

        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            if (data?._id) {
                navigate(`/interview/${data._id}`)
            } else {
                setSubmitError('Something went wrong while generating your plan. Please try again.')
            }
        } catch (err) {
            setSubmitError(err?.response?.data?.message || 'Something went wrong. Please try again.')
        }
    }

    const jdLength = jobDescription.length
    const jdRemaining = JD_CHAR_LIMIT - jdLength
    const jdCounterClass =
        jdRemaining < 0 ? 'char-counter char-counter--exceeded' :
        jdRemaining < 250 ? 'char-counter char-counter--warning' : 'char-counter'
    const recentReports = [ ...reports ]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)

    return (
        <div className='home-page'>

            {loading && (
                <AIThinking
                    title='Our AI is crafting your plan'
                    subtitle='Analyzing the role and your profile to build a tailored strategy. This usually takes 20–60 seconds.'
                />
            )}

            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            value={jobDescription}
                            onChange={handleJdChange}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            maxLength={JD_CHAR_LIMIT}
                        />
                        <div className='jd-generator'>
                            <p className='jd-generator__label'>Or pick a prebuilt dummy JD template</p>
                            <div className='jd-generator__controls'>
                                <select
                                    className='jd-generator__select'
                                    value={selectedRole}
                                    onChange={handleRoleChange}
                                    aria-label='Select preferred role'
                                >
                                    <option value=''>Select role</option>
                                    {ROLE_OPTIONS.map((role) => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                                <select
                                    className='jd-generator__select'
                                    value={selectedExperience}
                                    onChange={handleExperienceChange}
                                    aria-label='Select experience level'
                                >
                                    <option value=''>Select experience</option>
                                    {EXPERIENCE_OPTIONS.map((experience) => (
                                        <option key={experience.value} value={experience.value}>{experience.label}</option>
                                    ))}
                                </select>
                            </div>
                            <p className='jd-generator__hint'>Choosing both fields auto-generates a dummy JD in the textbox above.</p>
                        </div>
                        <div className={jdCounterClass}>
                            {jdLength.toLocaleString()} / {JD_CHAR_LIMIT.toLocaleString()} chars
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>

                            {resumeFile ? (
                                <div className='resume-uploaded'>
                                    <span className='resume-uploaded__icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <polyline points="9 14 11 16 15 12" />
                                        </svg>
                                    </span>
                                    <div className='resume-uploaded__info'>
                                        <p className='resume-uploaded__name'>{resumeFile.name}</p>
                                        <p className='resume-uploaded__meta'>
                                            <span className='resume-uploaded__status'>Ready to analyze</span>
                                            <span className='resume-uploaded__sep'>&bull;</span>
                                            <span>{formatBytes(resumeFile.size)}</span>
                                        </p>
                                    </div>
                                    <div className='resume-uploaded__actions'>
                                        <label className='resume-uploaded__replace' htmlFor='resume'>Replace</label>
                                        <button
                                            type='button'
                                            className='resume-uploaded__remove'
                                            onClick={handleResumeClear}
                                            aria-label='Remove uploaded resume'
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                        </button>
                                    </div>
                                    <input
                                        ref={resumeInputRef}
                                        hidden
                                        type='file'
                                        id='resume'
                                        name='resume'
                                        accept='.pdf,.docx'
                                        onChange={handleResumeChange}
                                    />
                                </div>
                            ) : (
                                <label className='dropzone' htmlFor='resume'>
                                    <span className='dropzone__icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    </span>
                                    <p className='dropzone__title'>Click to upload or drag &amp; drop</p>
                                    <p className='dropzone__subtitle'>PDF or DOCX (Max 5MB)</p>
                                    <input
                                        ref={resumeInputRef}
                                        hidden
                                        type='file'
                                        id='resume'
                                        name='resume'
                                        accept='.pdf,.docx'
                                        onChange={handleResumeChange}
                                    />
                                </label>
                            )}

                            {resumeError && <p className='resume-error'>{resumeError}</p>}
                        </div>

                        {/* OR Divider */}
                        <div className='or-divider'><span>OR</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                            </span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>
                        {submitError ? (
                            <span className='footer-info__error'>{submitError}</span>
                        ) : (
                            'AI-Powered Strategy Generation • Approx 30s'
                        )}
                    </span>
                    <button
                        onClick={handleGenerateReport}
                        disabled={!canSubmit || loading}
                        className='generate-btn'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                        {loading ? 'Generating...' : 'Generate My Interview Strategy'}
                    </button>
                </div>
            </div>

            {/* Recent Reports List */}
            {reports.length > 0 && (
                <section className='recent-reports'>
                    <div className='recent-reports__header'>
                        <h2>My Recent Interview Plans</h2>
                        <button
                            type='button'
                            className='recent-reports__view-all'
                            onClick={() => navigate('/profile')}
                        >
                            View Full History
                        </button>
                    </div>
                    <ul className='reports-list'>
                        {recentReports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

        </div>
    )
}

export default Home
