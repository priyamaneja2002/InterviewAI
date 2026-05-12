import React, { useEffect, useState } from 'react'
import './ai-thinking.scss'

const DEFAULT_STAGES = [
    'Reading the job description...',
    'Analyzing your profile...',
    'Identifying skill gaps...',
    'Drafting technical questions...',
    'Drafting behavioral questions...',
    'Building your preparation roadmap...',
    'Finalizing your interview plan...',
]

/**
 * Full-screen "AI is thinking" overlay with a pulsing icon, rotating progress
 * ring, animated dots, and cycling status messages.
 */
const AIThinking = ({
    title = 'Our AI is crafting your plan',
    subtitle = 'This usually takes 20-60 seconds. Hang tight.',
    stages = DEFAULT_STAGES,
    inline = false,
}) => {
    const [stageIndex, setStageIndex] = useState(0)

    useEffect(() => {
        if (stages.length <= 1) return
        const interval = window.setInterval(() => {
            setStageIndex((current) => (current + 1) % stages.length)
        }, 2400)
        return () => window.clearInterval(interval)
    }, [stages.length])

    return (
        <div className={`ai-thinking ${inline ? 'ai-thinking--inline' : 'ai-thinking--overlay'}`} role='status' aria-live='polite'>
            <div className='ai-thinking__card'>
                <div className='ai-thinking__orbits'>
                    <span className='ai-thinking__orbit ai-thinking__orbit--outer' />
                    <span className='ai-thinking__orbit ai-thinking__orbit--inner' />
                    <span className='ai-thinking__core'>
                        <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='currentColor'>
                            <path d='M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z' />
                        </svg>
                    </span>
                </div>

                <h2 className='ai-thinking__title'>{title}</h2>
                <p className='ai-thinking__subtitle'>{subtitle}</p>

                <div className='ai-thinking__stage'>
                    <span className='ai-thinking__stage-text' key={stageIndex}>
                        {stages[stageIndex]}
                    </span>
                    <span className='ai-thinking__dots' aria-hidden='true'>
                        <span /><span /><span />
                    </span>
                </div>

                <div className='ai-thinking__bar' aria-hidden='true'>
                    <span className='ai-thinking__bar-fill' />
                </div>
            </div>
        </div>
    )
}

export default AIThinking
