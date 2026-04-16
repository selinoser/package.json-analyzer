import { useState, useRef, useCallback, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import styles from './FileUploader.module.css'

export default function FileUploader({ onUpload }) {
  const { t } = useLanguage()
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [fileError, setFileError] = useState(null)
  const inputRef = useRef(null)
  const errorTimerRef = useRef(null)

  useEffect(() => {
    if (!fileError) return
    errorTimerRef.current = setTimeout(() => setFileError(null), 3500)
    return () => clearTimeout(errorTimerRef.current)
  }, [fileError])

  const validate = (file) => {
    if (!file) return false
    if (file.name !== 'package.json') {
      setFileError({ name: file.name })
      setFileName(null)
      if (inputRef.current) inputRef.current.value = ''
      return false
    }
    setFileError(null)
    return true
  }

  const handleFile = useCallback((file) => {
    if (!validate(file)) return
    setFileName(file.name)
    onUpload(file)
  }, [onUpload])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setDragging(false), [])

  const handleChange = useCallback((e) => {
    handleFile(e.target.files[0])
  }, [handleFile])

  const isError = !!fileError

  return (
    <div
      className={`${styles.dropzone} dropzone-area${dragging ? ' is-dragging' : ''}${isError ? ' is-error' : ''}`}
      style={{ animation: 'fadeUp 0.4s var(--ease-out)' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={handleChange}
      />

      {isError ? (
        <>
          <div className={`dropzone-icon-box ${styles.iconBox}`}>❌</div>
          <div
            className={styles.errorContent}
            style={{ animation: 'popIn 0.28s var(--ease-spring)' }}
          >
            <span className={styles.errorTitle}>{t.errorWrongFile}</span>
            <span className={styles.errorFileName}>&ldquo;{fileError.name}&rdquo;</span>
            <span className={styles.hintText}>{t.errorWrongFileHint}</span>
          </div>
        </>
      ) : fileName ? (
        <>
          <div className={`dropzone-icon-box ${styles.iconBox}`}>✅</div>
          <div className={styles.successContent}>
            <span
              className={styles.fileName}
              style={{ animation: 'popIn 0.35s var(--ease-spring)' }}
            >
              {fileName}
            </span>
            <span className={styles.hintText}>{t.dropReplace}</span>
          </div>
        </>
      ) : (
        <>
          <div className={`dropzone-icon-box ${styles.iconBox}`}>📄</div>
          <div className={styles.dropContent}>
            <span className={styles.dropTitle}>
              {t.dropHere}{' '}
              <strong className={styles.dropAccent}>{t.dropHereFile}</strong>{' '}
              {t.dropHereSub}
            </span>
            <span className={styles.dropBrowse}>{t.dropBrowse}</span>
          </div>
        </>
      )}
    </div>
  )
}
