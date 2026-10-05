import { useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, Download, FileJson, FileUp, X } from 'lucide-react';

// Mirrors the server's ceiling so an oversized file is rejected instantly
// rather than after a pointless round trip.
const MAX_FILE_BYTES = 10 * 1024 * 1024;

// The exact shape the server expects. The chapter ids are placeholders — they
// have to be ids that already exist in the database, so this is a template to
// fill in rather than a file to import untouched.
const EXAMPLE_QUESTIONS = [
  {
    book_chapter_id: 1,
    question_text: 'Who created the heavens and the earth?',
    options: { a: 'Moses', b: 'God', c: 'Abraham', d: 'Noah' },
    correct_option: 'b',
  },
  {
    book_chapter_id: 2,
    question_text: 'What did God plant in Eden?',
    options: { a: 'A garden', b: 'A vineyard', c: 'An olive grove', d: 'A field of wheat' },
    correct_option: 'a',
  },
];

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Pick a JSON file of questions and hand it to the caller to import.
 *
 * This page owns the file and the feedback, but not the contents: it never
 * reads or parses what was picked. `onImport(file)` is the single seam where
 * the caller takes over — it may return a promise, and anything it throws is
 * shown to the admin as-is.
 */
export default function BulkUpload({ onBack, onImport }) {
  const inputRef = useRef(null);

  // Only the File itself is kept. Its contents are the importer's business,
  // so nothing here needs to know how many questions it holds.
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);

  // Reject the obviously unusable file before it is ever handed over. Anything
  // past this point — malformed JSON, wrong shape, bad rows — is the importer's
  // to report, since it is the one that reads the file.
  function accept(candidate) {
    if (!candidate) {
      console.warn('Bulk upload: no file reached the handler — the picker or drop was empty.');
      return;
    }

    setFile(null);
    setError(null);

    if (candidate.size > MAX_FILE_BYTES) {
      setError({
        message: `${candidate.name} is ${formatBytes(candidate.size)}. The limit is 10 MB.`,
      });
      return;
    }

    setFile(candidate);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    accept(event.dataTransfer.files?.[0]);
  }

  function clearFile() {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  async function runImport() {
    if (!file || importing) return;

    setImporting(true);
    setError(null);
    try {
      await onImport?.(file);
    } catch (err) {
      console.error('Bulk upload: the import failed.', err);
      setError({
        message: err?.message || 'The import failed. Check your connection and try again.',
        items: err?.items ?? null,
      });
    } finally {
      setImporting(false);
    }
  }

  function downloadExample() {
    const blob = new Blob([JSON.stringify(EXAMPLE_QUESTIONS, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'questions-example.json';
    // Never rendered; the anchor has to be in the document for the click to
    // count as a download in every browser.
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page stack fade-in">
      <div className="page-head">
        <div className="bulk-head">
          <button onClick={onBack} className="btn-ghost" aria-label="Back to questions">
            <ArrowLeft className="icon-20" />
          </button>
          <div>
            <h2 className="page-title serif">Bulk Upload</h2>
            <p className="page-sub">Import many questions at once from a JSON file</p>
          </div>
        </div>
      </div>

      <div className="card card-pad stack">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={dragging ? 'bulk-drop is-dragging' : 'bulk-drop'}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            className="bulk-drop-input"
            // The click bubbles back up to the zone above, which opens the
            // picker in turn; stopping it keeps that to one hop.
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => {
              const input = event.target;
              // Take the File reference before clearing the input. The File is
              // independent of the element, so it stays readable afterwards —
              // clearing only empties the picker so re-picking the same file
              // still fires a change event.
              accept(input.files?.[0]);
              input.value = '';
            }}
          />
          <div className="bulk-drop-icon">
            {dragging ? <FileUp className="icon-24" /> : <FileJson className="icon-24" />}
          </div>
          <p className="bulk-drop-title">
            {dragging ? 'Drop to select this file' : 'Drop your JSON file here'}
          </p>
          <p className="bulk-drop-sub">or tap to browse</p>
        </div>

        {error && <ErrorPanel error={error} />}

        {file && (
          <div className="bulk-file">
            <FileJson className="icon-20 bulk-file-icon" />
            <div className="bulk-file-main">
              <p className="bulk-file-name">{file.name}</p>
              <p className="bulk-file-meta">{formatBytes(file.size)}</p>
            </div>
            <button onClick={clearFile} className="btn-ghost" aria-label="Remove file">
              <X className="icon-20" />
            </button>
          </div>
        )}

        <button
          onClick={runImport}
          disabled={!file || importing}
          className="btn-primary btn-block btn-save"
        >
          {importing ? 'Uploading...' : 'Upload'}
        </button>

        <button onClick={downloadExample} className="btn-secondary btn-block">
          <Download className="icon-16" />
          Download example file
        </button>
      </div>

      <p className="bulk-note">
        Every question needs a book_chapter_id naming a chapter that already exists — the
        import never creates chapters. Nothing is imported unless every question in the file
        is valid, and uploading the same file twice adds a second copy of every question.
      </p>
    </div>
  );
}

// A single message for a file the page itself rejected, or a message plus a
// list when the caller reports per-row problems.
function ErrorPanel({ error }) {
  if (!error.items?.length) {
    return (
      <div className="form-error form-error-flush">
        <AlertCircle className="icon-16 form-error-icon" />
        {error.message}
      </div>
    );
  }

  return (
    <div className="bulk-error">
      <div className="bulk-error-head">
        <AlertCircle className="icon-16" />
        <span>
          Nothing was imported. {error.items.length} problem
          {error.items.length === 1 ? '' : 's'} found:
        </span>
      </div>
      <ul className="bulk-error-list">
        {error.items.map((item, index) => (
          <li key={`${item.row}-${item.field}-${index}`} className="bulk-error-item">
            {item.row != null && <span className="bulk-error-row">Row {item.row}</span>}
            {item.field && <span className="bulk-error-field">{item.field}</span>}
            <span className="bulk-error-text">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
