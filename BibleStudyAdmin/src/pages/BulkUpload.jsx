import { useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, Download, FileJson, FileUp, X } from 'lucide-react';
import { useQuestionsContext } from '@/context/QuestionsContext';

// Mirrors the server's `max:10240` rule: rejecting an oversized file here
// saves the admin a pointless upload before the same answer comes back.
const MAX_FILE_BYTES = 10 * 1024 * 1024;

// A file that imports as-is, so the expected shape is never a guessing game.
const EXAMPLE_QUESTIONS = [
  {
    book: 'Genesis',
    chapter: 1,
    question_text: 'Who created the heavens and the earth?',
    options: { a: 'Moses', b: 'God', c: 'Abraham', d: 'Noah' },
    correct_option: 'b',
    num_verses: 31,
  },
  {
    book: 'Genesis',
    chapter: 2,
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

// The server answers a rejected import with Laravel's error bag, keyed either
// `file` or `questions.<index>.<field>`. Split that into something readable.
function describeError(err) {
  const fieldErrors = err.fieldErrors;

  if (!fieldErrors) {
    return { message: err.message || 'The upload failed. Check your connection and try again.' };
  }

  const fileMessage = Array.isArray(fieldErrors.file) ? fieldErrors.file[0] : '';
  const rowErrors = [];

  Object.entries(fieldErrors).forEach(([key, messages]) => {
    if (key === 'file') return;

    const match = key.match(/^questions\.(\d+)\.(.+)$/);
    const texts = Array.isArray(messages) ? messages : [messages];

    texts.forEach((text) => {
      rowErrors.push({
        row: match ? Number(match[1]) + 1 : null,
        field: match ? match[2] : key,
        text,
      });
    });
  });

  return { message: err.message, fileMessage, rowErrors };
}

/**
 * Import a JSON file of questions in one request. The server writes either
 * every row or none, so a failure leaves the question list untouched and the
 * page reports exactly which rows it objected to.
 */
export default function BulkUpload({ onBack, onImported }) {
  const { bulkUpload } = useQuestionsContext();
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [readyCount, setReadyCount] = useState(0);
  const [fileError, setFileError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Read the file in the browser first: a file that isn't a JSON array can be
  // reported instantly, and the count can be shown before anything is sent.
  async function accept(candidate) {
    if (!candidate) return;

    setFile(null);
    setReadyCount(0);
    setFileError('');
    setUploadError(null);

    if (candidate.size > MAX_FILE_BYTES) {
      setFileError(`${candidate.name} is ${formatBytes(candidate.size)}. The limit is 10 MB.`);
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(await candidate.text());
    } catch {
      setFileError(`We could not read ${candidate.name} as JSON. Check the file and try again.`);
      return;
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      setFileError('The file must hold a JSON array of questions, like the example file below.');
      return;
    }

    setFile(candidate);
    setReadyCount(parsed.length);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    accept(event.dataTransfer.files?.[0]);
  }

  function clearFile() {
    setFile(null);
    setReadyCount(0);
    setFileError('');
    setUploadError(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  async function upload() {
    if (!file || uploading) return;

    setUploading(true);
    setUploadError(null);
    try {
      const result = await bulkUpload(file);
      onImported(result?.created ?? readyCount);
    } catch (err) {
      console.error('Failed to bulk upload questions:', err);
      setUploadError(describeError(err));
    } finally {
      setUploading(false);
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

  const questionWord = readyCount === 1 ? 'question' : 'questions';

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
              accept(event.target.files?.[0]);
              event.target.value = '';
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

        {fileError && (
          <div className="form-error form-error-flush">
            <AlertCircle className="icon-16 form-error-icon" />
            {fileError}
          </div>
        )}

        {file && (
          <div className="bulk-file">
            <FileJson className="icon-20 bulk-file-icon" />
            <div className="bulk-file-main">
              <p className="bulk-file-name">{file.name}</p>
              <p className="bulk-file-meta">
                {formatBytes(file.size)} · {readyCount} {questionWord} ready to import
              </p>
            </div>
            <button onClick={clearFile} className="btn-ghost" aria-label="Remove file">
              <X className="icon-20" />
            </button>
          </div>
        )}

        {uploadError && <BulkErrorPanel error={uploadError} />}

        <button
          onClick={upload}
          disabled={!file || uploading}
          className="btn-primary btn-block btn-save"
        >
          {uploading ? 'Uploading...' : readyCount > 0 ? `Upload ${readyCount} ${questionWord}` : 'Upload'}
        </button>

        <button onClick={downloadExample} className="btn-secondary btn-block">
          <Download className="icon-16" />
          Download example file
        </button>
      </div>

      <p className="bulk-note">
        Nothing is imported unless every question in the file is valid, and uploading the
        same file twice adds a second copy of every question.
      </p>
    </div>
  );
}

function BulkErrorPanel({ error }) {
  if (error.fileMessage) {
    return (
      <div className="form-error form-error-flush">
        <AlertCircle className="icon-16 form-error-icon" />
        {error.fileMessage}
      </div>
    );
  }

  if (!error.rowErrors?.length) {
    return (
      <div className="form-error form-error-flush">
        <AlertCircle className="icon-16 form-error-icon" />
        {error.message || 'The upload failed. Check your connection and try again.'}
      </div>
    );
  }

  return (
    <div className="bulk-error">
      <div className="bulk-error-head">
        <AlertCircle className="icon-16" />
        <span>
          Nothing was imported. {error.rowErrors.length} problem
          {error.rowErrors.length === 1 ? '' : 's'} found:
        </span>
      </div>
      <ul className="bulk-error-list">
        {error.rowErrors.map((item, index) => (
          <li key={`${item.row}-${item.field}-${index}`} className="bulk-error-item">
            {item.row !== null && <span className="bulk-error-row">Row {item.row}</span>}
            <span className="bulk-error-field">{item.field}</span>
            <span className="bulk-error-text">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
