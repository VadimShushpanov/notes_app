export default {
  actions: {},
  mutations: {
    addNote(state, newNote) {
      state.notes.unshift(newNote);
      localStorage.setItem("notes", JSON.stringify(state.notes));
    },
    saveEditedNote(state, editedNote) {
      state.notes[
        state.notes.findIndex((n) => n.id === editedNote.id)
      ] = editedNote;
      localStorage.setItem("notes", JSON.stringify(state.notes));
    },
    deleteNote(state, note) {
      state.notes.splice(
        state.notes.findIndex((n) => n.id === note.id),
        1
      );
      localStorage.setItem("notes", JSON.stringify(state.notes));
    },
    saveEventlog(state, stateNote) {
      localStorage.removeItem("stateNote");
      localStorage.setItem("stateNote", JSON.stringify(stateNote));
      state.eventLog.unshift(localStorage.getItem("stateNote"));
    },
    clearEventLog(state, stateNote) {
      state.eventLog = [];
    },
  },
  state: {
    notes: JSON.parse(localStorage.getItem("notes")) || [],
    todoList: [],
    noteId: "",
    eventLog: [],
  },
  getters: {
    notes: (state) => state.notes,
    noteById: (state) => (id) => state.notes.find((n) => n.id === id),
    eventLog: (state) => state.eventLog,
  },
};
