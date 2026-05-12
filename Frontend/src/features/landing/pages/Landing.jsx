import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import ComingSoonModal from '../../../components/feedback/ComingSoonModal'
import '../style/landing.scss'

const FEATURES = [
    {
        title: 'Tailored Question Banks',
        description:
            'Get technical and behavioral questions hand-picked for the exact role you are applying to, with model answers you can adapt.',
        icon: (
            <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
            </svg>
        ),
    },
    {
        title: 'Match Score & Skill Gaps',
        description:
            'Understand how strong your fit is for any role, and exactly which skills to brush up on before the interview.',
        icon: (
            <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M3 3v18h18' />
                <path d='m7 14 4-4 3 3 5-6' />
            </svg>
        ),
    },
    {
        title: 'Personalized Roadmap',
        description:
            'Receive a structured day-by-day preparation plan so you walk into every interview with confidence.',
        icon: (
            <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <polygon points='3 11 22 2 13 21 11 13 3 11' />
            </svg>
        ),
    },
    {
        title: 'Tailored Resume Export',
        description:
            'Download a polished, role-specific resume generated from your profile and the job description with one click.',
        icon: (
            <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
                <polyline points='14 2 14 8 20 8' />
                <line x1='12' y1='18' x2='12' y2='12' />
                <polyline points='9 15 12 12 15 15' />
            </svg>
        ),
    },
]

const STEPS = [
    {
        number: '01',
        title: 'Share the Role',
        description: 'Paste the job description for the position you are targeting.',
    },
    {
        number: '02',
        title: 'Add Your Profile',
        description: 'Upload your resume or write a short summary of your experience.',
    },
    {
        number: '03',
        title: 'Get Your Strategy',
        description: 'Receive questions, a match score, skill gaps and a prep plan in seconds.',
    },
]

const Landing = () => {
    const { user } = useAuth()
    const location = useLocation()
    const [mockOpen, setMockOpen] = useState(false)

    useEffect(() => {
        if (!location.hash) return
        const id = location.hash.slice(1)
        // Defer to let the section mount and styles apply.
        const timeoutId = window.setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 60)
        return () => window.clearTimeout(timeoutId)
    }, [location.hash, location.pathname])

    return (
        <main className='landing-page'>

            {/* Hero */}
            <section className='landing-hero'>
                <div className='landing-hero__inner'>
                    <span className='landing-hero__eyebrow'>AI-Powered Interview Prep</span>
                    <h1 className='landing-hero__title'>
                        Walk into every interview <span className='highlight'>fully prepared.</span>
                    </h1>
                    <p className='landing-hero__subtitle'>
                        InterviewAI turns any job description into a personalized study plan —
                        with tailored questions, a skill-gap analysis and a custom roadmap built
                        around your unique profile.
                    </p>

                    <div className='landing-hero__cta'>
                        {user ? (
                            <>
                                <Link to='/create-plan' className='btn btn-primary btn-lg'>
                                    Create a New Plan
                                </Link>
                                <Link to='/create-plan' className='btn btn-ghost btn-lg'>
                                    View My Plans
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to='/register' className='btn btn-primary btn-lg'>
                                    Get Started — It's Free
                                </Link>
                                <Link to='/login' className='btn btn-ghost btn-lg'>
                                    I already have an account
                                </Link>
                            </>
                        )}
                    </div>

                    <ul className='landing-hero__pills'>
                        <li>No setup required</li>
                        <li>Resume + JD aware</li>
                        <li>Ready in &lt; 60 seconds</li>
                    </ul>
                </div>

                <div className='landing-hero__panel'>
                    <div className='landing-hero__panel-header'>
                        <span className='landing-hero__dot' />
                        <span className='landing-hero__dot' />
                        <span className='landing-hero__dot' />
                        <span className='landing-hero__panel-title'>interview-plan.ai</span>
                    </div>
                    <div className='landing-hero__panel-body'>
                        <div className='landing-hero__stat'>
                            <span className='landing-hero__stat-label'>Match Score</span>
                            <span className='landing-hero__stat-value'>87%</span>
                        </div>
                        <div className='landing-hero__chips'>
                            <span>React</span>
                            <span>System Design</span>
                            <span>STAR Method</span>
                            <span>Behavioral</span>
                            <span>TypeScript</span>
                        </div>
                        <div className='landing-hero__line' />
                        <div className='landing-hero__rows'>
                            <div>
                                <strong>Q1.</strong> Walk me through how you would design a real-time chat app.
                            </div>
                            <div>
                                <strong>Day 3.</strong> Practice 2 system design problems and 5 React concepts.
                            </div>
                            <div>
                                <strong>Skill Gap.</strong> Tighten knowledge of Redis pub/sub before round 2.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id='features' className='landing-features'>
                <div className='landing-section__heading'>
                    <span className='landing-section__eyebrow'>Why InterviewAI</span>
                    <h2>Everything you need to nail the next round.</h2>
                    <p>Stop bouncing between blog posts and outdated question lists. Get a plan built for you.</p>
                </div>

                <div className='landing-features__grid'>
                    {FEATURES.map((feature) => (
                        <article key={feature.title} className='feature-card'>
                            <span className='feature-card__icon'>{feature.icon}</span>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section id='how-it-works' className='landing-steps'>
                <div className='landing-section__heading'>
                    <span className='landing-section__eyebrow'>How It Works</span>
                    <h2>Three steps from job posting to a winning strategy.</h2>
                </div>

                <div className='landing-steps__grid'>
                    {STEPS.map((step) => (
                        <div key={step.number} className='step-card'>
                            <span className='step-card__number'>{step.number}</span>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mock Interviews — Coming Soon */}
            <section id='mock-interviews' className='landing-mock'>
                <div className='landing-mock__inner'>
                    <div className='landing-mock__content'>
                        <span className='landing-mock__eyebrow'>
                            <span className='landing-mock__pulse' />
                            Coming Soon
                        </span>
                        <h2>
                            Practice with <span className='highlight'>AI-Powered Mock Interviews</span>
                        </h2>
                        <p>
                            Step beyond preparation. Soon you'll be able to take live, voice-driven
                            mock interviews — answer real questions, get instant feedback on your
                            content, structure and delivery, and walk in interview-day ready.
                        </p>

                        <ul className='landing-mock__features'>
                            <li>
                                <span className='landing-mock__check' aria-hidden='true'>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round'><polyline points='20 6 9 17 4 12' /></svg>
                                </span>
                                Voice-driven, real-time conversation with an AI interviewer
                            </li>
                            <li>
                                <span className='landing-mock__check' aria-hidden='true'>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round'><polyline points='20 6 9 17 4 12' /></svg>
                                </span>
                                Personalized to your job description and resume
                            </li>
                            <li>
                                <span className='landing-mock__check' aria-hidden='true'>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round'><polyline points='20 6 9 17 4 12' /></svg>
                                </span>
                                Detailed feedback on clarity, pacing and answer quality
                            </li>
                        </ul>

                        <button
                            type='button'
                            className='btn btn-primary btn-lg landing-mock__cta'
                            onClick={() => setMockOpen(true)}
                        >
                            Notify Me When It's Ready
                        </button>
                    </div>

                    <div className='landing-mock__preview' aria-hidden='true'>
                        <div className='landing-mock__panel'>
                            <div className='landing-mock__panel-header'>
                                <span className='landing-mock__dot landing-mock__dot--live' />
                                <span className='landing-mock__panel-title'>Live Mock Interview</span>
                                <span className='landing-mock__panel-time'>02:14</span>
                            </div>
                            <div className='landing-mock__panel-body'>
                                <div className='landing-mock__bubble landing-mock__bubble--ai'>
                                    <strong>Interviewer:</strong> Tell me about a time you optimized a slow API endpoint.
                                </div>
                                <div className='landing-mock__bubble landing-mock__bubble--user'>
                                    <strong>You:</strong> Sure — at my last role, our search endpoint was averaging 1.8s...
                                </div>
                                <div className='landing-mock__bars' aria-hidden='true'>
                                    <span /><span /><span /><span /><span /><span /><span /><span />
                                </div>
                                <div className='landing-mock__feedback'>
                                    <span className='landing-mock__feedback-tag'>Live Feedback</span>
                                    <span>Strong structure (STAR). Watch pacing on technical details.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className='landing-cta'>
                <div className='landing-cta__inner'>
                    <h2>Ready to land your next role?</h2>
                    <p>Generate your personalized interview strategy in under a minute.</p>
                    <Link to={user ? '/create-plan' : '/register'} className='btn btn-primary btn-lg'>
                        {user ? 'Create a New Plan' : 'Start for Free'}
                    </Link>
                </div>
            </section>

            <ComingSoonModal
                open={mockOpen}
                onClose={() => setMockOpen(false)}
            />
        </main>
    )
}

export default Landing
