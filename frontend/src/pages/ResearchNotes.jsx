import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  getResearchNotes,
  deleteResearchNote,
  updateResearchNote,
} from "../services/researchNoteService";

const ResearchNoteViewer = lazy(
  () => import("../components/research/ResearchNoteViewer")
);

import ResearchToolbar from "../components/research/ResearchToolbar";
import ResearchNoteCard from "../components/research/ResearchNoteCard";

import ResearchLoadingSkeleton from "../components/research/ResearchLoadingSkeleton";
import WorkspaceStats from "../components/research/WorkspaceStats";
import ResearchEmptyState from "../components/research/ResearchEmptyState";

import DeleteConfirmationModal from "../components/common/DeleteConfirmationModal";

import "./ResearchNotes.css";

export default function ResearchNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const [selectedNote, setSelectedNote] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function loadNotes() {
    try {
      const data = await getResearchNotes();
      setNotes(data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load research notes.");
    } finally {
      setLoading(false);
    }
  }

 useEffect(() => {
  const timer = setTimeout(() => {
    loadNotes();
  }, 0);

  return () => clearTimeout(timer);
}, []);

  function handleDelete(note) {
    setNoteToDelete(note);
    setDeleteModalOpen(true);
  }

  function handleCancelDelete() {
    setDeleteModalOpen(false);
    setNoteToDelete(null);
  }

  async function handleConfirmDelete() {
    if (!noteToDelete) return;

    setDeleting(true);

    const previousNotes = notes;
    const deletedNote = noteToDelete;

    setNotes((currentNotes) =>
      currentNotes.filter(
        (note) => note.id !== deletedNote.id
      )
    );

    if (
      selectedNote &&
      selectedNote.id === deletedNote.id
    ) {
      setViewerOpen(false);
      setSelectedNote(null);
    }

    try {
      await deleteResearchNote(deletedNote.id);

      toast.success("Research note deleted.");
    } catch (err) {
      console.error(err);

      setNotes(previousNotes);

      toast.error("Unable to delete research note.");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setNoteToDelete(null);
    }
  }

  async function handleFavorite(note) {
    const newFavoriteValue = !note.is_favorite;

    const previousNotes = notes;

    setNotes((currentNotes) =>
      currentNotes.map((item) =>
        item.id === note.id
          ? {
              ...item,
              is_favorite: newFavoriteValue,
            }
          : item
      )
    );

    if (
      selectedNote &&
      selectedNote.id === note.id
    ) {
      setSelectedNote((current) => ({
        ...current,
        is_favorite: newFavoriteValue,
      }));
    }

    try {
      await updateResearchNote(note.id, {
        is_favorite: newFavoriteValue,
      });

      toast.success(
        newFavoriteValue
          ? "Added to favorites."
          : "Removed from favorites."
      );
    } catch (err) {
      console.error(err);

      setNotes(previousNotes);

      if (
        selectedNote &&
        selectedNote.id === note.id
      ) {
        setSelectedNote(note);
      }

      toast.error("Unable to update note.");
    }
  }

  async function handleTagsChange(noteId, tags) {
    const previousNotes = notes;

    const updatedNote = {
      ...selectedNote,
      tags,
    };

    setNotes((currentNotes) =>
      currentNotes.map((item) =>
        item.id === noteId
          ? {
              ...item,
              tags,
            }
          : item
      )
    );

    setSelectedNote(updatedNote);

    try {
      await updateResearchNote(noteId, {
        tags,
      });

      toast.success("Tags updated.");
    } catch (err) {
      console.error(err);

      setNotes(previousNotes);

      const previousSelected = previousNotes.find(
        (n) => n.id === noteId
      );

      if (previousSelected) {
        setSelectedNote(previousSelected);
      }

      toast.error("Unable to update tags.");
    }
  }

  function handleView(note) {
    setSelectedNote(note);
    setViewerOpen(true);
  }

  function handleCloseViewer() {
    setViewerOpen(false);
    setSelectedNote(null);
  }

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (showFavorites) {
      result = result.filter((n) => n.is_favorite);
    }

    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.question.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "oldest":
        result.reverse();
        break;

      case "az":
        result.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      case "za":
        result.sort((a, b) =>
          b.title.localeCompare(a.title)
        );
        break;

      default:
        break;
    }

    return result;
  }, [notes, search, showFavorites, sortBy]);

  const totalNotes = notes.length;
  const favoriteCount = notes.filter(
    (note) => note.is_favorite
  ).length;
  const filteredCount = filteredNotes.length;

  let emptyStateProps = {};

  if (notes.length === 0) {
    emptyStateProps = {
      icon: "📚",
      title: "No Research Notes Yet",
      description:
        "Your saved AI research notes will appear here. Create notes from your research chat to build your personal knowledge base.",
      showButton: true,
    };
  } else if (showFavorites && search.trim()) {
    emptyStateProps = {
      icon: "⭐",
      title: "No Favorite Notes Found",
      description:
        "None of your favorite research notes match your current search.",
      showButton: false,
    };
  } else if (showFavorites) {
    emptyStateProps = {
      icon: "⭐",
      title: "No Favorite Notes Yet",
      description:
        "Mark important research notes as favorites to access them quickly.",
      showButton: false,
    };
  } else if (search.trim()) {
    emptyStateProps = {
      icon: "🔍",
      title: "No Search Results",
      description:
        "Try a different keyword or clear your search to view all notes.",
      showButton: false,
    };
  }

  if (loading) {
    return <ResearchLoadingSkeleton />;
  }

  return (
    <>
      <div className="research-notes-page">
        <div className="workspace-header">
          <div>
            <h1>📚 Research Workspace</h1>

            <p>
              Organize, search and manage all your AI
              research notes in one place.
            </p>
          </div>
        </div>

        <WorkspaceStats
          totalNotes={totalNotes}
          favoriteCount={favoriteCount}
          filteredCount={filteredCount}
        />

        <ResearchToolbar
          search={search}
          setSearch={setSearch}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filteredCount={filteredCount}
          totalCount={totalNotes}
        />

        {filteredNotes.length === 0 ? (
          <ResearchEmptyState {...emptyStateProps} />
        ) : (
          <div className="workspace-notes-grid">
            {filteredNotes.map((note) => (
              <ResearchNoteCard
                key={note.id}
                note={note}
                onView={handleView}
                onFavorite={handleFavorite}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <Suspense fallback={null}>
        <ResearchNoteViewer
          note={selectedNote}
          open={viewerOpen}
          onClose={handleCloseViewer}
          onTagsChange={handleTagsChange}
        />
      </Suspense>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        loading={deleting}
        title="Delete Research Note"
        message="Are you sure you want to permanently delete this research note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}