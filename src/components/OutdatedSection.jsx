import { useLanguage } from '../context/LanguageContext'
import styles from './OutdatedSection.module.css'

function cleanVersion(v) {
  return v.replace(/[\^~>=<]/g, '')
}

export default function OutdatedSection({ deps, versionData, loading, searchQuery }) {
  const { t } = useLanguage()

  if (loading) {
    return (
      <div className="outdated-card-wrap">
        <h2 className={styles.sectionTitle}>{t.outdatedTitle}</h2>
        <div className={styles.loadingInner}>
          <span className={styles.spinner} />
          {t.outdatedChecking}
        </div>
      </div>
    )
  }

  const q = searchQuery.toLowerCase()

  const outdated = Object.entries(deps).filter(([name, version]) => {
    const latest = versionData[name]?.latest
    if (!latest) return false
    const match = !q || name.toLowerCase().includes(q)
    return match && cleanVersion(version) !== latest
  })

  if (outdated.length === 0) {
    return (
      <div className="outdated-card-wrap">
        <h2 className={styles.sectionTitle}>✅ {t.tabOutdated}</h2>
        <div
          className={styles.emptyContent}
          style={{ animation: 'fadeUp 0.3s var(--ease-out)' }}
        >
          <span className={styles.partyEmoji}>🎉</span>
          <div>
            <p className={styles.allGoodTitle}>{t.outdatedAllGood}</p>
            <p className={styles.allGoodSub}>{t.outdatedAllGoodSub}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="outdated-card-wrap">
      <div className="outdated-card-header">
        <h2 className={styles.sectionTitle} style={{ padding: 0 }}>{t.outdatedTitle}</h2>
        <span className={styles.countBadge}>{t.outdatedCount(outdated.length)}</span>
      </div>

      <div className="outdated-table-scroll">
        <table className="outdated-table">
          <thead>
            <tr>
              <th>{t.colPackage}</th>
              <th>{t.colInstalled}</th>
              <th>{t.colLatest}</th>
              <th>{t.colUpdateCmd}</th>
            </tr>
          </thead>
          <tbody>
            {outdated.map(([name, version]) => {
              const latest = versionData[name]?.latest
              return (
                <tr key={name}>
                  <td>
                    <a
                      href={`https://www.npmjs.com/package/${name}`}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.pkgLink}
                    >
                      {name}
                      <span className={styles.pkgLinkArrow}>↗</span>
                    </a>
                  </td>
                  <td>
                    <code className={styles.versionInstalled}>{version}</code>
                  </td>
                  <td>
                    <code className={styles.versionLatest}>{latest}</code>
                  </td>
                  <td>
                    <CopyCommand name={name} latest={latest} tooltip={t.copyTooltip} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CopyCommand({ name, latest, tooltip }) {
  const cmd = `npm install ${name}@${latest}`

  return (
    <button
      className="cmd-btn-wrap"
      onClick={() => navigator.clipboard.writeText(cmd)}
      title={tooltip}
    >
      <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {cmd}
      </code>
      <span className="cmd-icon" style={{ fontSize: '14px', color: 'var(--text-muted)', flexShrink: 0, transition: 'all 0.15s' }}>
        ⎘
      </span>
    </button>
  )
}
