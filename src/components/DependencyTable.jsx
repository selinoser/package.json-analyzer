import { useLanguage } from '../context/LanguageContext'
import styles from './DependencyTable.module.css'

function cleanVersion(v) {
  return v.replace(/[\^~>=<]/g, '')
}

function isOutdated(installed, latest) {
  if (!latest) return false
  return cleanVersion(installed) !== latest
}

function VersionBadge({ installed, latest, loading }) {
  const { t } = useLanguage()

  if (loading) {
    return <span className="badge-loading-dot">{t.statusLoading}</span>
  }
  if (!latest) {
    return <span className={styles.unknownBadge}>{t.statusUnknown}</span>
  }
  const outdated = isOutdated(installed, latest)
  return (
    <span className={`${styles.versionBadge} ${outdated ? styles.versionOutdated : styles.versionUpToDate}`}>
      {outdated ? `⬆ ${latest}` : t.statusUpToDate}
    </span>
  )
}

export default function DependencyTable({ deps, versionData, loading, type }) {
  const { t } = useLanguage()
  const entries = Object.entries(deps)

  const typeText  = type === 'dev' ? t.labelDev  : t.labelProd
  const titleText = type === 'dev' ? t.tabDev    : t.tabDeps
  const labelClass = type === 'dev' ? styles.labelDev : styles.labelProd

  if (entries.length === 0) {
    return (
      <div className="dep-card-wrap">
        <div className="dep-card-header">
          <h2 className={styles.titleWrap}>
            <span className={labelClass}>{typeText}</span>
            {titleText}
          </h2>
        </div>
        <p className={styles.emptyMsg}>{t.noDepsFound}</p>
      </div>
    )
  }

  return (
    <div className="dep-card-wrap">
      <div className="dep-card-header">
        <h2 className={styles.titleWrap}>
          <span className={labelClass}>{typeText}</span>
          {titleText}
          <span className={styles.countBadge}>{entries.length}</span>
        </h2>
      </div>

      <div className="dep-table-scroll">
        <table className="dep-table">
          <thead className="dep-table-head">
            <tr>
              <th>{t.colPackage}</th>
              <th>{t.colInstalled}</th>
              <th>{t.colLatest}</th>
              <th>{t.colStatus}</th>
              <th>{t.colDescription}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([name, version], index) => {
              const info    = versionData[name]
              const latest  = info?.latest
              const outdated = isOutdated(version, latest)

              return (
                <tr
                  key={name}
                  className={outdated ? 'dep-row-outdated' : ''}
                  style={{ animationDelay: `${Math.min(index * 0.035, 0.5)}s` }}
                >
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
                    {loading ? (
                      <span className="skeleton-sm" />
                    ) : (
                      <code className={latest ? styles.versionLatest : styles.versionLatestEmpty}>
                        {latest ?? '—'}
                      </code>
                    )}
                  </td>
                  <td>
                    <VersionBadge installed={version} latest={latest} loading={loading} />
                  </td>
                  <td>
                    {loading ? (
                      <span className="skeleton-lg" />
                    ) : (
                      <span className={styles.descCell} title={info?.description}>
                        {info?.description || '—'}
                      </span>
                    )}
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
