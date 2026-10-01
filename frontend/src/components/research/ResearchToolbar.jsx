import "./ResearchToolbar.css";

export default function ResearchToolbar({
  search,
  setSearch,
  showFavorites,
  setShowFavorites,
  sortBy,
  setSortBy,
  filteredCount,
  totalCount,
  selectedTag,
  onClearTag,
}) {
  return (
    <>
      <div className="research-toolbar">
        <div className="toolbar-search">
          <input
            type="text"
            placeholder="🔍 Search research notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearch("")}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <label className="favorite-toggle">
          <input
            type="checkbox"
            checked={showFavorites}
            onChange={(e) =>
              setShowFavorites(e.target.checked)
            }
          />

          Favorites Only
        </label>

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
        >
          <option value="newest">
            Newest
          </option>

          <option value="oldest">
            Oldest
          </option>

          <option value="az">
            A-Z
          </option>

          <option value="za">
            Z-A
          </option>
        </select>

        <div className="toolbar-counter">
          Showing{" "}
          <strong>{filteredCount}</strong> of{" "}
          <strong>{totalCount}</strong> notes
        </div>
      </div>

      {selectedTag && (
        <div className="active-tag-filter">
          <span>
            Filtering by tag: <strong>#{selectedTag}</strong>
          </span>

          <button
            type="button"
            className="clear-search-btn"
            onClick={onClearTag}
          >
            Clear Tag
          </button>
        </div>
      )}
    </>
  );
}