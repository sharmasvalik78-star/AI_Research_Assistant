import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  exportResearchNoteMarkdown,
  exportResearchNoteWord,
  exportResearchNotePDF,
} from "../../utils/exportResearchNote";

import ResearchTags from "./ResearchTags";
import ResearchTagEditor from "./ResearchTagEditor";

import "./ResearchNoteViewer.css";

export default function ResearchNoteViewer({
  note,
  open,
  onClose,
  onTagsChange,
}) {
  const [copied, setCopied] = useState(false);
  const [editingTags, setEditingTags] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

    useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setEditingTags(false);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open || !note) {
    return null;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(note.answer);

      setCopied(true);

      toast.success("Answer copied to clipboard.");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Unable to copy the answer.");
    }
  }

  function handleExportMarkdown() {
    try {
      exportResearchNoteMarkdown(note);
      toast.success("Markdown exported.");
    } catch (err) {
      console.error(err);
      toast.error("Unable to export Markdown.");
    }
  }

  async function handleExportWord() {
    try {
      await exportResearchNoteWord(note);
      toast.success("Word document exported.");
    } catch (err) {
      console.error(err);
      toast.error("Unable to export Word document.");
    }
  }

  async function handleExportPDF() {
    try {
      await exportResearchNotePDF(note);
      toast.success("PDF exported.");
    } catch (err) {
      console.error(err);
      toast.error("Unable to export PDF.");
    }
  }

  function handleTagsUpdated(tags) {
    onTagsChange(note.id, tags);
  }

  return (
    <div
      className="research-note-viewer-overlay"
      onClick={onClose}
    >
      <div
        className="research-note-viewer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="viewer-header">
          <div>
            <h2>{note.title}</h2>

            {note.is_favorite && (
              <span className="favorite-badge">
                ⭐ Favorite
              </span>
            )}

            {!editingTags ? (
              <>
                <ResearchTags tags={note.tags} />

                <button
                  type="button"
                  className="copy-answer-btn"
                  onClick={() => setEditingTags(true)}
                  style={{ marginTop: "10px" }}
                >
                  ✏️ Edit Tags
                </button>
              </>
            ) : (
              <>
                <ResearchTagEditor
                  tags={note.tags || []}
                  onChange={handleTagsUpdated}
                />

                <button
                  type="button"
                  className="copy-answer-btn"
                  onClick={() => setEditingTags(false)}
                  style={{ marginTop: "10px" }}
                >
                  ✓ Done
                </button>
              </>
            )}
          </div>

          <button
            className="viewer-close-btn"
            onClick={onClose}
            aria-label="Close viewer"
          >
            ✕
          </button>
        </div>

        <div className="viewer-section">
          <h3>Research Question</h3>

          <p>{note.question}</p>
        </div>

        <div className="viewer-section">
          <div className="viewer-section-header">
            <h3>AI Answer</h3>

            <div className="viewer-actions">
              <button
                className="copy-answer-btn"
                onClick={handleCopy}
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>

              <button
                className="copy-answer-btn"
                onClick={handleExportMarkdown}
              >
                ⬇️ Markdown
              </button>

              <button
                className="copy-answer-btn"
                onClick={handleExportWord}
              >
                📄 Word
              </button>

              <button
                className="copy-answer-btn"
                onClick={handleExportPDF}
              >
                📕 PDF
              </button>
            </div>
          </div>

          <div className="viewer-answer">
            {note.answer}
          </div>
        </div>
      </div>
    </div>
  );
}