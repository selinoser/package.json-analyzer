import { createContext, useContext, useState } from 'react'

const translations = {
  en: {
    // Header
    appSubtitle: 'Inspect, compare & analyze your npm dependencies',
    copyJSON: '⎘ Copy JSON',
    copied: '✓ Copied!',
    toggleTheme: 'Toggle theme',
    toggleLang: 'TR',

    // FileUploader
    dropHere: 'Drop your',
    dropHereFile: 'package.json',
    dropHereSub: 'here',
    dropBrowse: 'or click to browse',
    dropReplace: 'Click or drop another file to replace',
    errorWrongFile: 'Only package.json files are accepted.',
    errorWrongFileHint: 'Please upload a file named exactly "package.json".',

    // Tabs
    tabDeps: 'Dependencies',
    tabDev: 'DevDependencies',
    tabOutdated: 'Outdated',
    tabBundle: 'Bundle Size',

    // Search
    searchPlaceholder: 'Search packages...',

    // Empty state
    emptyTitle: 'No package.json loaded',
    emptySub: 'Upload a',
    emptySub2: 'file to start analyzing your dependencies',

    // Footer
    footer: 'Package.json Analyzer · npm registry powered · built with React + Vite',

    // PackageInfo
    packageInfoTitle: '📋 Package Info',
    fetchingVersions: 'Fetching latest versions…',
    statPackage: 'Package',
    statVersion: 'Version',
    statLicense: 'License',
    statDeps: 'Dependencies',
    statDevDeps: 'DevDependencies',
    statTotal: 'Total Packages',
    statOutdated: 'Outdated',

    // DependencyTable
    colPackage: 'Package',
    colInstalled: 'Installed',
    colLatest: 'Latest',
    colStatus: 'Status',
    colDescription: 'Description',
    noDepsFound: 'No packages found.',
    statusLoading: 'loading…',
    statusUnknown: 'unknown',
    statusUpToDate: '✓ up to date',

    // OutdatedSection
    outdatedTitle: '⚠️ Outdated Packages',
    outdatedChecking: 'Checking npm registry for latest versions…',
    outdatedAllGood: 'All packages are up to date!',
    outdatedAllGoodSub: 'No outdated dependencies detected.',
    outdatedCount: (n) => `${n} outdated`,
    colUpdateCmd: 'Update Command',
    copyTooltip: 'Click to copy',

    // BundleEstimate
    bundleTitle: 'Estimated Bundle Size',
    bundleLevelLight: 'Lightweight',
    bundleLevelModerate: 'Moderate',
    bundleLevelHeavy: 'Heavy',
    bundleLevelVeryHeavy: 'Very Heavy',
    bundleProdDeps: 'Production deps',
    bundleDevDeps: 'Dev deps (excluded from bundle)',
    bundleTotalAnalyzed: 'Total packages analyzed',
    bundleBreakdownTitle: '📊 Size Breakdown (Production)',
    bundleDisclaimer: '* Approximate minified + gzipped sizes. Based on known package sizes; defaults to 15 KB for unlisted packages.',
    bundleEstimated: 'est.',

    // TechStack
    techStackTitle: '🧰 Tech Stack',
    techStackDetected: (n) => `${n} detected`,
    techStackEmpty: 'No known technologies detected.',
    catFramework: 'Framework',
    catBackend: 'Backend',
    catRuntime: 'Runtime',
    catLanguage: 'Language',
    catBundler: 'Bundler',
    catStyling: 'Styling',
    catUI: 'UI',
    catState: 'State',
    catDatabase: 'Database',
    catAuth: 'Auth',
    catGraphQL: 'GraphQL',
    catAPI: 'API',
    catTesting: 'Testing',
    catAnimation: 'Animation',

    // Type labels
    labelProd: 'PROD',
    labelDev: 'DEV',
  },

  tr: {
    // Header
    appSubtitle: 'npm bağımlılıklarını incele, karşılaştır ve analiz et',
    copyJSON: '⎘ JSON Kopyala',
    copied: '✓ Kopyalandı!',
    toggleTheme: 'Temayı değiştir',
    toggleLang: 'EN',

    // FileUploader
    dropHere: '',
    dropHereFile: 'package.json',
    dropHereSub: 'dosyasını buraya bırak',
    dropBrowse: 'ya da dosya seçmek için tıkla',
    dropReplace: 'Değiştirmek için tıkla veya başka dosya bırak',
    errorWrongFile: 'Yalnızca package.json dosyası kabul edilir.',
    errorWrongFileHint: '"package.json" adında bir dosya yükleyin.',

    // Tabs
    tabDeps: 'Bağımlılıklar',
    tabDev: 'Geliştirici Bağımlılıkları',
    tabOutdated: 'Güncel Değil',
    tabBundle: 'Paket Boyutu',

    // Search
    searchPlaceholder: 'Paket ara...',

    // Empty state
    emptyTitle: 'package.json yüklenmedi',
    emptySub: '',
    emptySub2: 'dosyasını yükleyerek bağımlılıklarını analiz etmeye başla',

    // Footer
    footer: 'Package.json Analyzer · npm registry destekli · React + Vite ile yapıldı',

    // PackageInfo
    packageInfoTitle: '📋 Paket Bilgisi',
    fetchingVersions: 'Son sürümler alınıyor…',
    statPackage: 'Paket',
    statVersion: 'Sürüm',
    statLicense: 'Lisans',
    statDeps: 'Bağımlılıklar',
    statDevDeps: 'Geliştirici Bağımlılıkları',
    statTotal: 'Toplam Paket',
    statOutdated: 'Güncel Değil',

    // DependencyTable
    colPackage: 'Paket',
    colInstalled: 'Yüklü',
    colLatest: 'Son Sürüm',
    colStatus: 'Durum',
    colDescription: 'Açıklama',
    noDepsFound: 'Paket bulunamadı.',
    statusLoading: 'yükleniyor…',
    statusUnknown: 'bilinmiyor',
    statusUpToDate: '✓ güncel',

    // OutdatedSection
    outdatedTitle: '⚠️ Güncel Olmayan Paketler',
    outdatedChecking: 'npm kayıt defterinde son sürümler kontrol ediliyor…',
    outdatedAllGood: 'Tüm paketler güncel!',
    outdatedAllGoodSub: 'Güncel olmayan bağımlılık tespit edilmedi.',
    outdatedCount: (n) => `${n} güncel değil`,
    colUpdateCmd: 'Güncelleme Komutu',
    copyTooltip: 'Kopyalamak için tıkla',

    // BundleEstimate
    bundleTitle: 'Tahmini Paket Boyutu',
    bundleLevelLight: 'Hafif',
    bundleLevelModerate: 'Orta',
    bundleLevelHeavy: 'Ağır',
    bundleLevelVeryHeavy: 'Çok Ağır',
    bundleProdDeps: 'Üretim bağımlılıkları',
    bundleDevDeps: 'Geliştirici bağımlılıkları (pakete dahil değil)',
    bundleTotalAnalyzed: 'Analiz edilen toplam paket',
    bundleBreakdownTitle: '📊 Boyut Dağılımı (Üretim)',
    bundleDisclaimer: '* Yaklaşık küçültülmüş + sıkıştırılmış boyutlar. Bilinen paket boyutlarına dayanır; bilinmeyen paketler için varsayılan 15 KB kullanılır.',
    bundleEstimated: 'tahmini',

    // TechStack
    techStackTitle: '🧰 Teknoloji Yığını',
    techStackDetected: (n) => `${n} tespit edildi`,
    techStackEmpty: 'Bilinen teknoloji tespit edilemedi.',
    catFramework: 'Çerçeve',
    catBackend: 'Arka Uç',
    catRuntime: 'Çalışma Ortamı',
    catLanguage: 'Dil',
    catBundler: 'Paketleyici',
    catStyling: 'Stil',
    catUI: 'Arayüz',
    catState: 'Durum Yönetimi',
    catDatabase: 'Veritabanı',
    catAuth: 'Kimlik Doğrulama',
    catGraphQL: 'GraphQL',
    catAPI: 'API',
    catTesting: 'Test',
    catAnimation: 'Animasyon',

    // Type labels
    labelProd: 'PROD',
    labelDev: 'GELİŞTİRİCİ',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('tr')
  const t = translations[lang]
  const toggleLang = () => setLang((l) => (l === 'en' ? 'tr' : 'en'))

  return (
    <LanguageContext.Provider value={{ t, lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
