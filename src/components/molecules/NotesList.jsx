import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import NotesModal from "@/components/organisms/NotesModal";
import { noteService } from "@/services/api/noteService";

const NOTE_CATEGORIES = {
  "Phone Call": { icon: "Phone", color: "text-blue-600 bg-blue-50" },
  "Email": { icon: "Mail", color: "text-green-600 bg-green-50" },
  "Meeting": { icon: "Users", color: "text-purple-600 bg-purple-50" },
  "Follow-up": { icon: "Clock", color: "text-orange-600 bg-orange-50" }
};

const NotesList = ({ entityType, entityId, entityName }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadNotes();
  }, [entityType, entityId]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const notesData = await noteService.getByEntity(entityType, entityId);
      setNotes(notesData);
    } catch (err) {
      setError("Failed to load notes");
      console.error("Error loading notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setIsNotesModalOpen(true);
  };

  const handleEditNote = (note) => {
    if (!noteService.canEdit(note)) {
      toast.warn("Notes can only be edited within 24 hours of creation");
      return;
    }
    setEditingNote(note);
    setIsNotesModalOpen(true);
  };

const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        await noteService.update(editingNote.Id, noteData);
        toast.success("Note updated successfully!");
      } else {
        await noteService.create(noteData);
        toast.success("Note added successfully!");
      }
      await loadNotes();
      setIsNotesModalOpen(false);
    } catch (error) {
      console.error("Error saving note:", error);
      throw error;
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await noteService.delete(noteId);
      toast.success("Note deleted successfully");
      await loadNotes();
    } catch (error) {
      toast.error("Failed to delete note");
      console.error("Error deleting note:", error);
    }
  };

  const filteredNotes = filter === "all" 
    ? notes 
    : notes.filter(note => note.category === filter);

  const categories = ["all", ...Object.keys(NOTE_CATEGORIES)];

  if (loading) {
    return <Loading message="Loading notes..." />;
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadNotes} variant="outline" size="sm">
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Communication Notes ({notes.length})
        </h3>
        <Button onClick={handleAddNote} size="sm">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Note
        </Button>
      </div>

      {/* Category Filter */}
      {notes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === category
                  ? "bg-primary-100 text-primary-700 border border-primary-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              {category === "all" ? "All" : category}
            </button>
          ))}
        </div>
      )}

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <Empty
          title={filter === "all" ? "No notes yet" : `No ${filter} notes`}
          subtitle={filter === "all" 
            ? "Start tracking communications and interactions" 
            : `No ${filter.toLowerCase()} notes have been added yet`
          }
          actionLabel="Add First Note"
          onAction={handleAddNote}
        />
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => {
            const category = NOTE_CATEGORIES[note.category];
            const canEdit = noteService.canEdit(note);
            
            return (
              <div
                key={note.Id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${category?.color || "text-gray-600 bg-gray-50"}`}>
                      <ApperIcon name={category?.icon || "FileText"} size={16} />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{note.category}</span>
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })} 
                        {note.createdBy && ` by ${note.createdBy}`}
                        {note.updatedAt !== note.createdAt && (
                          <span className="ml-1">(edited)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {canEdit && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                        title="Edit note"
                      >
                        <ApperIcon name="Edit2" size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.Id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                        title="Delete note"
                      >
                        <ApperIcon name="Trash2" size={14} />
                      </button>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Notes Modal */}
      <NotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        onSave={handleSaveNote}
        note={editingNote}
        entityType={entityType}
        entityId={entityId}
        entityName={entityName}
      />
    </div>
  );
};

export default NotesList;