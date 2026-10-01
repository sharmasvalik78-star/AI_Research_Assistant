import { useState } from "react";

import ResearchTags from "./ResearchTags";

import "./ResearchTagEditor.css";

export default function ResearchTagEditor({
  tags = [],
  onChange,
}) {
  const [input, setInput] = useState("");

  function addTag() {
    const value = input.trim();

    if (!value) {
      return;
    }

    if (value.length > 50) {
      return;
    }

    const exists = tags.some(
      (tag) => tag.toLowerCase() === value.toLowerCase()
    );

    if (exists) {
      setInput("");
      return;
    }

    onChange([...tags, value]);

    setInput("");
  }

  function removeTag(tagToRemove) {
    onChange(
      tags.filter((tag) => tag !== tagToRemove)
    );
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  }

  return (
    <div className="research-tag-editor">
      <ResearchTags tags={tags} />

      <div className="tag-editor-list">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="tag-remove-chip"
            onClick={() => removeTag(tag)}
          >
            #{tag}
            <span>✕</span>
          </button>
        ))}
      </div>

      <div className="tag-editor-input-row">
        <input
          type="text"
          placeholder="Add a tag..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={50}
        />

        <button
          type="button"
          onClick={addTag}
        >
          Add
        </button>
      </div>
    </div>
  );
}