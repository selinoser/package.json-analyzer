import { useMemo } from 'react'
import { estimateBundleSize, formatSize, getSizeLevel } from '../utils/bundleSizes'
import { useLanguage } from '../context/LanguageContext'
import styles from './BundleEstimate.module.css'

const LEVEL_COLORS = {
  light:        { text: { color: 'var(--green)'   }, bar: { background: 'var(--green)'   }, emoji: '🟢' },
  moderate:     { text: { color: 'var(--yellow)'  }, bar: { background: 'var(--yellow)'  }, emoji: '🟡' },
  heavy:        { text: { color: '#fb923c'         }, bar: { background: '#fb923c'         }, emoji: '🟠' },
  'very-heavy': { text: { color: 'var(--red)'     }, bar: { background: 'var(--red)'     }, emoji: '🔴' },
}

export default function BundleEstimate({ deps, devDeps }) {
  const { t } = useLanguage()

  const LEVEL_LABELS = {
    light:        t.bundleLevelLight,
    moderate:     t.bundleLevelModerate,
    heavy:        t.bundleLevelHeavy,
    'very-heavy': t.bundleLevelVeryHeavy,
  }

  const depsResult = useMemo(() => estimateBundleSize(deps),    [deps])
  const devResult  = useMemo(() => estimateBundleSize(devDeps), [devDeps])

  const totalKb = depsResult.totalKb
  const level   = getSizeLevel(totalKb)
  const cfg     = LEVEL_COLORS[level]

  const maxSize = Math.max(...depsResult.breakdown.map((b) => b.size), 1)

  return (
    <div className={styles.container} style={{ animation: 'fadeUp 0.3s var(--ease-out)' }}>

      {/* ── Summary card ─────────────────────────────── */}
      <div className={`bundle-summary-card ${styles.summaryCard}`}>

        {/* Left: size display */}
        <div className={styles.leftSide}>
          <div className={styles.sizeLabel}>{t.bundleTitle}</div>
          <div
            className={styles.sizeNumber}
            style={{ ...cfg.text, animation: 'scaleIn 0.4s var(--ease-spring)' }}
          >
            {formatSize(totalKb)}
          </div>
          <div className={styles.levelBadge}>
            {cfg.emoji} {LEVEL_LABELS[level]}
          </div>
          <p className={styles.disclaimer}>{t.bundleDisclaimer}</p>
        </div>

        {/* Right: meta rows */}
        <div className={styles.rightSide}>
          <div className="bundle-meta">
            <span className={styles.metaLabel}>{t.bundleProdDeps}</span>
            <span className={styles.metaValue}>{formatSize(depsResult.totalKb)}</span>
          </div>
          <div className="bundle-meta">
            <span className={styles.metaLabel}>{t.bundleDevDeps}</span>
            <span className={styles.metaValue}>{formatSize(devResult.totalKb)}</span>
          </div>
          <div className="bundle-meta">
            <span className={styles.metaLabel}>{t.bundleTotalAnalyzed}</span>
            <span className={styles.metaValue}>{depsResult.breakdown.length}</span>
          </div>
        </div>
      </div>

      {/* ── Breakdown card ───────────────────────────── */}
      {depsResult.breakdown.length > 0 && (
        <div className={`bundle-breakdown-card ${styles.breakdownCard}`}>
          <h3 className={styles.breakdownTitle}>{t.bundleBreakdownTitle}</h3>

          <div className={styles.breakdownList}>
            {depsResult.breakdown.map((item) => {
              const pct = (item.size / maxSize) * 100
              return (
                <div
                  key={item.name}
                  className={styles.breakdownRow}
                  style={{ animation: 'rowIn 0.3s var(--ease-out) both' }}
                >
                  {/* Package name */}
                  <div className={styles.pkgNameCell}>
                    <span className={styles.pkgName}>{item.name}</span>
                    {item.isEstimated && (
                      <span className={`estimated-tag ${styles.estimatedTag}`}>
                        {t.bundleEstimated}
                      </span>
                    )}
                  </div>

                  {/* Bar */}
                  <div className={`bar-track ${styles.barTrack}`}>
                    <div
                      className="bar-fill-item"
                      style={{ ...cfg.bar, width: `${pct}%` }}
                    />
                  </div>

                  {/* Size label */}
                  <div className={styles.sizeValue}>{formatSize(item.size)}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
