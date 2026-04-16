import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import styles from './PackageInfo.module.css'

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0)
  const target = typeof value === 'number' ? value : null

  useEffect(() => {
    if (target === null) return
    if (target === 0) { setDisplay(0); return }

    const duration = 600
    const start = performance.now()

    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [target])

  if (target === null) return value
  return display
}

export default function PackageInfo({ data, loading, outdatedCount }) {
  const { t } = useLanguage()

  const totalDeps =
    Object.keys(data.dependencies).length + Object.keys(data.devDependencies).length

  const stats = [
    { label: t.statPackage,  value: data.name,    mono: true },
    { label: t.statVersion,  value: data.version, mono: true },
    { label: t.statLicense,  value: data.license || '—' },
    { label: t.statDeps,     value: Object.keys(data.dependencies).length,    highlight: 'blue',  numeric: true },
    { label: t.statDevDeps,  value: Object.keys(data.devDependencies).length, highlight: 'blue',  numeric: true },
    { label: t.statTotal,    value: totalDeps,                                numeric: true },
    {
      label: t.statOutdated,
      value: loading ? '…' : outdatedCount,
      highlight: outdatedCount > 0 ? 'red' : 'green',
      numeric: !loading,
    },
  ]

  return (
    <div
      className={`pkg-info-card ${styles.card}`}
      style={{ animation: 'fadeUp 0.35s var(--ease-out)' }}
    >
      {/* Card header */}
      <div className={styles.cardHeader}>
        <h2 className={styles.sectionLabel}>{t.packageInfoTitle}</h2>
        {loading && (
          <span className={`loading-dot-badge ${styles.loadingBadge}`}>
            {t.fetchingVersions}
          </span>
        )}
      </div>

      {/* Description */}
      {data.description && (
        <p className={styles.description}>{data.description}</p>
      )}

      {/* Stats grid */}
      <div className={styles.statsGrid}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`stat-grid-item ${styles.statItem}`}
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <span className={styles.statLabel}>{s.label}</span>
            <span
              className={[
                s.mono ? styles.statValueMono : styles.statValue,
                s.highlight === 'red'   ? styles.red   : '',
                s.highlight === 'green' ? styles.green : '',
                s.highlight === 'blue'  ? styles.blue  : '',
              ].filter(Boolean).join(' ')}
            >
              {s.numeric ? <AnimatedNumber value={s.value} /> : s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
