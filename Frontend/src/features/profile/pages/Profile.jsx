import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { useInterview } from '../../interview/hooks/useInterview'
import { getDisplayName, getFullName, getInitial } from '../../auth/utils/user'
import AIThinking from '../../../components/loading/AIThinking'
import '../style/profile.scss'

const FILTERS = [
    { id: 'all', label: 'All Plans' },
    { id: 'high', label: 'High Match' },
    { id: 'mid', label: 'Mid Match' },
    { id: 'low', label: 'Low Match' },
]

const formatDate = (value) => {
    if (!value) return '—'
    try {
        return new Date(value).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    } catch {
        return '—'
    }
}

const formatRelative = (value) => {
    if (!value) return ''
    const now = new Date()
    const then = new Date(value)
    const diff = (now - then) / 1000
    if (Number.isNaN(diff)) return ''
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`
    if (diff < 86400 * 30) return `${Math.floor(diff / (86400 * 7))}w ago`
    if (diff < 86400 * 365) return `${Math.floor(diff / (86400 * 30))}mo ago`
    return `${Math.floor(diff / (86400 * 365))}y ago`
}

const scoreBucket = (score) => {
    if (typeof score !== 'number') return 'low'
    if (score >= 80) return 'high'
    if (score >= 60) return 'mid'
    return 'low'
}

const Profile = () => {
    const { user, loading: authLoading } = useAuth()
    const { reports, loading: reportsLoading } = useInterview()
    const navigate = useNavigate()
    const [filter, setFilter] = useState('all')
    const [query, setQuery] = useState('')

    const stats = useMemo(() => {
        if (!reports?.length) {
            return { total: 0, averageScore: null, highest: null, lastCreated: null }
        }
        const validScores = reports.filter((r) => typeof r.matchScore === 'number')
        const sum = validScores.reduce((acc, r) => acc + r.matchScore, 0)
        const average = validScores.length ? Math.round(sum / validScores.length) : null
        const highest = validScores.length
            ? validScores.reduce((m, r) => (r.matchScore > m ? r.matchScore : m), 0)
            : null
        const lastCreated = reports
            .map((r) => r.createdAt)
            .filter(Boolean)
            .sort((a, b) => new Date(b) - new Date(a))[0]
        return { total: reports.length, averageScore: average, highest, lastCreated }
    }, [reports])

    const filteredReports = useMemo(() => {
        if (!reports) return []
        const q = query.trim().toLowerCase()
        return reports.filter((r) => {
            const bucket = scoreBucket(r.matchScore)
            if (filter !== 'all' && bucket !== filter) return false
            if (!q) return true
            const haystack = `${r.title || ''}`.toLowerCase()
            return haystack.includes(q)
        })
    }, [reports, filter, query])

    if (authLoading || !user) {
        return (
            <AIThinking
                inline
                title='Loading your profile'
                subtitle='Pulling together your account details and recent activity.'
                stages={[ 'Fetching account', 'Loading history', 'Preparing layout' ]}
            />
        )
    }

    const fullName = getFullName(user)
    const displayName = getDisplayName(user)

    return (
        <div className='profile-page'>
            {/* Hero / Identity card */}
            <section className='profile-hero'>
                <div className='profile-hero__bg' aria-hidden='true' />
                <div className='profile-hero__inner'>
                    <div className='profile-hero__avatar'>
                        {user.avatar ? (
                            <img src={user.avatar} alt={fullName || displayName} />
                        ) : (
                            <span className='profile-hero__avatar-fallback'>{getInitial(user)}</span>
                        )}
                    </div>
                    <div className='profile-hero__info'>
                        <span className='profile-hero__greeting'>Welcome back,</span>
                        <h1 className='profile-hero__name'>
                            {displayName}
                            <span className='profile-hero__wave' aria-hidden='true'>👋</span>
                        </h1>
                        {fullName && fullName !== displayName && (
                            <p className='profile-hero__fullname'>{fullName}</p>
                        )}
                        <div className='profile-hero__meta'>
                            <span className='profile-hero__chip'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                    <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
                                    <polyline points='22,6 12,13 2,6' />
                                </svg>
                                {user.email}
                            </span>
                            {user.username && (
                                <span className='profile-hero__chip'>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                        <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
                                        <circle cx='12' cy='7' r='4' />
                                    </svg>
                                    @{user.username}
                                </span>
                            )}
                            {user.createdAt && (
                                <span className='profile-hero__chip'>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                        <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
                                        <line x1='16' y1='2' x2='16' y2='6' />
                                        <line x1='8' y1='2' x2='8' y2='6' />
                                        <line x1='3' y1='10' x2='21' y2='10' />
                                    </svg>
                                    Member since {formatDate(user.createdAt)}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className='profile-hero__actions'>
                        <Link to='/create-plan' className='profile-btn profile-btn--primary'>
                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='currentColor'>
                                <path d='M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z' />
                            </svg>
                            Create new plan
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className='profile-stats'>
                <div className='profile-stat-card'>
                    <span className='profile-stat-card__label'>Plans created</span>
                    <span className='profile-stat-card__value'>{stats.total}</span>
                    <span className='profile-stat-card__hint'>across your career goals</span>
                </div>
                <div className='profile-stat-card'>
                    <span className='profile-stat-card__label'>Average match</span>
                    <span className='profile-stat-card__value'>
                        {stats.averageScore !== null ? `${stats.averageScore}%` : '—'}
                    </span>
                    <span className='profile-stat-card__hint'>
                        {stats.averageScore !== null ? 'across all plans' : 'no plans scored yet'}
                    </span>
                </div>
                <div className='profile-stat-card'>
                    <span className='profile-stat-card__label'>Highest match</span>
                    <span className='profile-stat-card__value'>
                        {stats.highest !== null ? `${stats.highest}%` : '—'}
                    </span>
                    <span className='profile-stat-card__hint'>
                        {stats.highest !== null ? 'your best yet' : 'generate a plan to unlock'}
                    </span>
                </div>
                <div className='profile-stat-card'>
                    <span className='profile-stat-card__label'>Last activity</span>
                    <span className='profile-stat-card__value profile-stat-card__value--small'>
                        {stats.lastCreated ? formatRelative(stats.lastCreated) : '—'}
                    </span>
                    <span className='profile-stat-card__hint'>
                        {stats.lastCreated ? formatDate(stats.lastCreated) : 'no activity yet'}
                    </span>
                </div>
            </section>

            {/* History */}
            <section className='profile-history'>
                <div className='profile-history__header'>
                    <div>
                        <h2>Interview history</h2>
                        <p>Every plan you've generated, sorted by most recent.</p>
                    </div>
                    <div className='profile-history__controls'>
                        <div className='profile-search'>
                            <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                <circle cx='11' cy='11' r='8' />
                                <line x1='21' y1='21' x2='16.65' y2='16.65' />
                            </svg>
                            <input
                                type='text'
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder='Search by job title...'
                                aria-label='Search interview plans'
                            />
                        </div>
                        <div className='profile-filter'>
                            {FILTERS.map((f) => (
                                <button
                                    key={f.id}
                                    type='button'
                                    className={`profile-filter__btn ${filter === f.id ? 'is-active' : ''}`}
                                    onClick={() => setFilter(f.id)}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {reportsLoading && !reports.length ? (
                    <div className='profile-empty'>
                        <p>Loading your interview history...</p>
                    </div>
                ) : !reports.length ? (
                    <div className='profile-empty'>
                        <div className='profile-empty__icon'>
                            <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
                                <polyline points='14 2 14 8 20 8' />
                                <line x1='12' y1='18' x2='12' y2='12' />
                                <line x1='9' y1='15' x2='15' y2='15' />
                            </svg>
                        </div>
                        <h3>No interview plans yet</h3>
                        <p>Generate your first AI-powered interview plan to see your history here.</p>
                        <Link to='/create-plan' className='profile-btn profile-btn--primary'>
                            Create your first plan
                        </Link>
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className='profile-empty profile-empty--soft'>
                        <h3>No matches</h3>
                        <p>Try a different search or clear the filters.</p>
                        <button
                            type='button'
                            className='profile-btn profile-btn--ghost'
                            onClick={() => { setFilter('all'); setQuery('') }}
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <ul className='profile-history__list'>
                        {filteredReports.map((report) => {
                            const bucket = scoreBucket(report.matchScore)
                            const created = report.createdAt
                            return (
                                <li
                                    key={report._id}
                                    className='profile-report'
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                    role='button'
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            navigate(`/interview/${report._id}`)
                                        }
                                    }}
                                >
                                    <div className='profile-report__main'>
                                        <div className={`profile-report__score profile-report__score--${bucket}`}>
                                            <span className='profile-report__score-value'>
                                                {typeof report.matchScore === 'number' ? `${report.matchScore}` : '—'}
                                            </span>
                                            <span className='profile-report__score-suffix'>%</span>
                                        </div>
                                        <div className='profile-report__info'>
                                            <h3 className='profile-report__title'>
                                                {report.title || 'Untitled Position'}
                                            </h3>
                                            <p className='profile-report__meta'>
                                                <span>Generated {formatDate(created)}</span>
                                                {created && (
                                                    <>
                                                        <span className='profile-report__dot' aria-hidden='true' />
                                                        <span>{formatRelative(created)}</span>
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='profile-report__actions'>
                                        <span className={`profile-report__pill profile-report__pill--${bucket}`}>
                                            {bucket === 'high' && 'Strong match'}
                                            {bucket === 'mid' && 'Decent match'}
                                            {bucket === 'low' && 'Needs work'}
                                        </span>
                                        <span className='profile-report__open' aria-hidden='true'>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                                <polyline points='9 18 15 12 9 6' />
                                            </svg>
                                        </span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </section>
        </div>
    )
}

export default Profile
