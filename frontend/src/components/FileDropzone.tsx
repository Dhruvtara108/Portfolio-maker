import { useRef, useState } from 'react'

interface FileDropzoneProps {
  accept: string
  acceptedLabel: string
  file: File | null
  onFileChange: (file: File | null) => void
  error?: string
}

export function FileDropzone({
  accept,
  acceptedLabel,
  file,
  onFileChange,
  error,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (selectedFile: File | undefined) => {
    if (selectedFile) onFileChange(selectedFile)
  }

  return (
    <div>
      <input
        ref={inputRef}
        accept={accept}
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
        type="file"
      />
      <div
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-slate-200 bg-slate-50/70 hover:border-indigo-300 hover:bg-indigo-50/40'
        }`}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          handleFile(event.dataTransfer.files[0])
        }}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-xl text-indigo-600">
          ↑
        </div>
        <p className="font-semibold text-slate-800">
          Drop your file here, or{' '}
          <button
            className="text-indigo-600 underline decoration-indigo-200 underline-offset-4 hover:text-indigo-700"
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            browse
          </button>
        </p>
        <p className="mt-2 text-sm text-slate-500">{acceptedLabel} · Maximum 10 MB</p>
      </div>
      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
      {file && (
        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">{file.name}</p>
            <p className="mt-1 text-xs text-slate-500">{formatFileSize(file.size)}</p>
          </div>
          <button
            className="shrink-0 text-sm font-semibold text-slate-500 hover:text-red-600"
            onClick={() => onFileChange(null)}
            type="button"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}

export function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}
