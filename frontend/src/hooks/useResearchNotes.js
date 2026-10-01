import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getResearchNotes,
  updateResearchNote,
  deleteResearchNote,
} from "../services/researchNoteService";

export default function useResearchNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    try {
      const data = await getResearchNotes();
      setNotes(data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load research notes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  const fetchNotes = async () => {
    try {
      const data = await getResearchNotes();
      setNotes(data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load research notes.");
    } finally {
      setLoading(false);
    }
  };

  fetchNotes();
}, []);

  async function favoriteNote(note) {
    const previousNotes = notes;
    const newFavoriteValue = !note.is_favorite;

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

      toast.error("Unable to update note.");
    }
  }

  async function updateTags(noteId, tags) {
    const previousNotes = notes;

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

    try {
      await updateResearchNote(noteId, {
        tags,
      });

      toast.success("Tags updated.");
    } catch (err) {
      console.error(err);

      setNotes(previousNotes);

      toast.error("Unable to update tags.");
    }
  }

  async function removeNote(note) {
    const previousNotes = notes;

    setNotes((currentNotes) =>
      currentNotes.filter(
        (item) => item.id !== note.id
      )
    );

    try {
      await deleteResearchNote(note.id);

      toast.success("Research note deleted.");
    } catch (err) {
      console.error(err);

      setNotes(previousNotes);

      toast.error("Unable to delete research note.");
    }
  }

  function replaceNote(updatedNote) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === updatedNote.id
          ? updatedNote
          : note
      )
    );
  }

  return {
    notes,
    setNotes,
    loading,
    loadNotes,
    favoriteNote,
    updateTags,
    removeNote,
    replaceNote,
  };
}