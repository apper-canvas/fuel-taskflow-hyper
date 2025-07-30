import notesData from "@/services/mockData/notes.json";

let notes = [...notesData];
let nextId = Math.max(...notes.map(n => n.Id), 0) + 1;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const noteService = {
  async getAll() {
    await delay(200);
    return [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    await delay(150);
    const note = notes.find(n => n.Id === parseInt(id));
    if (!note) {
      throw new Error("Note not found");
    }
    return { ...note };
  },

  async getByEntity(entityType, entityId) {
    await delay(200);
    return notes
      .filter(n => n.entityType === entityType && n.entityId === parseInt(entityId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(n => ({ ...n }));
  },

  async create(noteData) {
    await delay(300);
    
    // Validate required fields
    if (!noteData.entityType || !noteData.entityId || !noteData.category || !noteData.content?.trim()) {
      throw new Error("Entity type, entity ID, category, and content are required");
    }

    const now = new Date().toISOString();
    const newNote = {
      Id: nextId++,
      entityType: noteData.entityType,
      entityId: parseInt(noteData.entityId),
      category: noteData.category,
      content: noteData.content.trim(),
      createdAt: now,
      updatedAt: now,
      createdBy: noteData.createdBy || "Current User"
    };

    notes.push(newNote);
    return { ...newNote };
  },

  async update(id, updateData) {
    await delay(250);
    const index = notes.findIndex(n => n.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Note not found");
    }

    // Only allow updating content and category
    const allowedUpdates = {
      content: updateData.content?.trim(),
      category: updateData.category,
      updatedAt: new Date().toISOString()
    };

    // Remove undefined values
    Object.keys(allowedUpdates).forEach(key => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key];
      }
    });

    notes[index] = { ...notes[index], ...allowedUpdates };
    return { ...notes[index] };
  },

  async delete(id) {
    await delay(200);
    const index = notes.findIndex(n => n.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Note not found");
    }
    
    const deletedNote = notes.splice(index, 1)[0];
    return { ...deletedNote };
  },

  // Helper method to check if note can be edited (within 24 hours)
  canEdit(note) {
    const noteTime = new Date(note.createdAt);
    const now = new Date();
    const hoursDiff = (now - noteTime) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  }
};