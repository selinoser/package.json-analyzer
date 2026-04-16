import { useState, useEffect, useCallback } from 'react'
import FileUploader from './components/FileUploader'
import PackageInfo from './components/PackageInfo'
import DependencyTable from './components/DependencyTable'
import BundleEstimate from './components/BundleEstimate'
import OutdatedSection from './components/OutdatedSection'
import { parsePackage } from './utils/parsePackage'
import { fetchAllVersions } from './utils/fetchVersions'
import { useLanguage } from './context/LanguageContext'
import styles from './App.module.css'

export default function App() {
  const { t, toggleLang } = useLanguage()
  const [darkMode, setDarkMode] = useState(true)
  const [packageData, setPackageData] = useState(null)
  const [versionData, setVersionData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('deps')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.documentElement.className = darkMode ? '' : 'light'
  }, [darkMode])

  const handleFileUpload = useCallback(async (file) => {
    setError(null)
    setVersionData({})
    setSearchQuery('')
    setActiveTab('deps')

    try {
      const parsed = await parsePackage(file)
      setPackageData(parsed)
      setLoading(true)

      const allPackages = {
        ...parsed.dependencies,
        ...parsed.devDependencies,
      }
      const versions = await fetchAllVersions(Object.keys(allPackages))
      setVersionData(versions)
    } catch (err) {
      setError(err.message)
      setPackageData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleCopyJSON = useCallback(() => {
    if (!packageData) return
    const output = {
      dependencies: packageData.dependencies,
      devDependencies: packageData.devDependencies,
    }
    navigator.clipboard.writeText(JSON.stringify(output, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [packageData])

  const filterDeps = (deps) => {
    if (!searchQuery) return deps
    const q = searchQuery.toLowerCase()
    return Object.fromEntries(
      Object.entries(deps).filter(([name]) => name.toLowerCase().includes(q))
    )
  }

  const outdatedPackages = packageData
    ? Object.entries({
        ...packageData.dependencies,
        ...packageData.devDependencies,
      }).filter(([name, version]) => {
        const latest = versionData[name]?.latest
        if (!latest) return false
        const installed = version.replace(/[\^~>=<]/g, '')
        return installed !== latest
      })
    : []

  return (
    <div className={`app-wrapper ${styles.wrapper}`}>
      {/* Dot grid overlay */}
      <div className="grid-dot-overlay" />

      {/* ── Header ─────────────────────────────────────── */}
      <header className="header-wrap">
        <div className={styles.headerInner}>
          {/* Logo */}
          <div className={styles.logoGroup}>
            <span className={`logo-icon-box ${styles.logoIcon}`}>📦</span>
            <div>
              <h1 className={styles.logoTitle}>Package.json Analyzer</h1>
              <p className={styles.logoSub}>{t.appSubtitle}</p>
            </div>
          </div>

          {/* Header actions */}
          <div className={styles.headerActions}>
            {packageData && (
              <button
                className={`copy-action-btn ${styles.copyBtn}`}
                onClick={handleCopyJSON}
              >
                <span>{copied ? t.copied : t.copyJSON}</span>
              </button>
            )}
            <button
              className={styles.iconBtn}
              onClick={toggleLang}
              title={t.toggleLang}
            >
              {t.toggleLang}
            </button>
            <button
              className={styles.iconBtn}
              onClick={() => setDarkMode((d) => !d)}
              title={t.toggleTheme}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────── */}
      <main className={styles.main}>
        <FileUploader onUpload={handleFileUpload} />

        {error && (
          <div
            className={styles.errorMsg}
            style={{ animation: 'fadeUp 0.3s var(--ease-out)' }}
          >
            <span>⚠️</span> {error}
          </div>
        )}

        {packageData && (
          <>
            <PackageInfo
              data={packageData}
              loading={loading}
              outdatedCount={outdatedPackages.length}
            />

            {/* Search Bar */}
            <div className={styles.searchBar}>
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon}>⌕</span>
                <input
                  className={styles.searchInput}
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className={styles.searchClear}
                    onClick={() => setSearchQuery('')}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs-container">
              {[
                { key: 'deps',     label: t.tabDeps,     badge: Object.keys(packageData.dependencies).length },
                { key: 'dev',      label: t.tabDev,      badge: Object.keys(packageData.devDependencies).length },
                { key: 'outdated', label: t.tabOutdated, badge: outdatedPackages.length, danger: outdatedPackages.length > 0 },
                { key: 'bundle',   label: t.tabBundle },
              ].map(({ key, label, badge, danger }) => (
                <button
                  key={key}
                  className={`tab-item${activeTab === key ? ' tab-item-active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                  {badge !== undefined && (
                    <span className={`tab-badge${danger ? ' tab-badge-danger' : ''}`}>
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div key={activeTab} style={{ animation: 'slideInRight 0.28s var(--ease-out) both' }}>
              {activeTab === 'deps' && (
                <DependencyTable
                  deps={filterDeps(packageData.dependencies)}
                  versionData={versionData}
                  loading={loading}
                  type="dep"
                />
              )}
              {activeTab === 'dev' && (
                <DependencyTable
                  deps={filterDeps(packageData.devDependencies)}
                  versionData={versionData}
                  loading={loading}
                  type="dev"
                />
              )}
              {activeTab === 'outdated' && (
                <OutdatedSection
                  deps={{ ...packageData.dependencies, ...packageData.devDependencies }}
                  versionData={versionData}
                  loading={loading}
                  searchQuery={searchQuery}
                />
              )}
              {activeTab === 'bundle' && (
                <BundleEstimate
                  deps={packageData.dependencies}
                  devDeps={packageData.devDependencies}
                />
              )}
            </div>
          </>
        )}

        {!packageData && !error && (
          <div
            className={styles.emptyState}
            style={{ animation: 'fadeUp 0.4s var(--ease-out)' }}
          >
            <div className={`empty-icon-box ${styles.emptyIcon}`}>📂</div>
            <h2 className={styles.emptyTitle}>{t.emptyTitle}</h2>
            <p className={styles.emptySub}>
              {t.emptySub}{' '}
              <code className={styles.inlineCode}>package.json</code>{' '}
              {t.emptySub2}
            </p>
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className={styles.footer}>
        <span>{t.footer}</span>
      </footer>
    </div>
  )
}
