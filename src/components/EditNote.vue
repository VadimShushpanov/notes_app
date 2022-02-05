<template>
  <div class="edit-note">
    <div class="header">
      <div class="note-title" :class="{ editNoteTitle: note == editedNote }">
        <div
          class="circle"
          title="Return to notes page"
          @click="returnToPageNotes()"
        >
          &larr;
        </div>

        <label
          @dblclick="editNoteTitle(note)"
          title="Double click for edit note title"
          >{{ note.title }}</label
        >

        <input
          class="edit"
          type="text"
          v-model="note.title"
          v-todo-focus="note == editedNote"
          @blur="doneEditNoteTitle(note)"
          @keyup.enter="doneEditNoteTitle(note)"
          @keyup.esc="cancelEditNoteTitle(note)"
        />
      </div>
    </div>

    <div class="note-setting__panel">
      <form @submit.prevent="submit">
        <input
          type="text"
          placeholder="What needs to be done?"
          v-model="title"
        />
        <button title="Create todo" type="submit">
          <i class="fa fa-plus-circle" aria-hidden="true"></i>
        </button>
      </form>

      <button title="Undo" @click="cancelPreviousChange()">
        <i class="fa fa-undo" aria-hidden="true"></i>
      </button>

      <button title="Redo" @click="returnDiscardedChange()">
        <i class="fa fa-undo fa-flip-horizontal" aria-hidden="true"></i>
      </button>

      <button title="Cancel edit" @click="showCancelEditPopup()">
        <i class="fa fa-history" aria-hidden="true"></i>
      </button>

      <button title="Save" @click="saveNote(note)">
        <i class="fa fa-floppy-o" aria-hidden="true"></i>
      </button>

      <button title="Delete note" @click="showDeleteNotePopup()">
        <i class="fa fa-trash fa-lg" aria-hidden="true"></i>
      </button>
    </div>

    <div v-if="note.todoList">
      <ul class="todo-list">
        <li
          class="todo-item"
          :class="{
            completed: todoItem.completed,
            editing: todoItem == editedTodo,
          }"
          v-for="todoItem in note.todoList"
          :key="todoItem.id"
        >
          <div class="view">
            <input
              class="toggle"
              title="Mark as done"
              @change="stateCheckbox()"
              type="checkbox"
              v-model="todoItem.completed"
            />
            <label
              @dblclick="editTodoTitle(todoItem)"
              title="Double click for edit"
              >{{ todoItem.title }}</label
            >
            <button @click="removeTodoItem(todoItem)" title="Delete todo">
              <i class="fa fa-trash fa-lg" aria-hidden="true"></i>
            </button>
          </div>

          <input
            class="edit"
            type="text"
            v-model="todoItem.title"
            v-todo-focus="todoItem == editedTodo"
            @blur="doneEditTodoTitle(todoItem)"
            @keyup.enter="doneEditTodoTitle(todoItem)"
            @keyup.esc="cancelEditTodoTitle(todoItem)"
          />
        </li>
      </ul>

      <DeleteNotePopup
        v-if="isConfirmPopupVisible"
        @closePopup="closePopupConfirm"
        @deleteNote="deleteNoteItem"
        >{{ note.title }}</DeleteNotePopup
      >

      <CancelEditPopup
        v-if="isCancelEditPopupVisible"
        @closePopup="closeCancelEditPopup"
        @previousStateNote="previousStateNote"
        >{{ note.title }}</CancelEditPopup
      >
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import DeleteNotePopup from "./popup/DeleteNotePopup";
import CancelEditPopup from "./popup/CancelEditPopup";

export default {
  name: "EditNote",
  data() {
    return {
      title: "",
      editedTodo: null,
      editedNote: null,
      isConfirmPopupVisible: false,
      isCancelEditPopupVisible: false,
      indexChange: 0,
    };
  },
  components: { DeleteNotePopup, CancelEditPopup },
  methods: {
    ...mapMutations([
      "saveEditedNote",
      "deleteTodoItem",
      "deleteNote",
      "saveEventlog",
      "clearEventLog",
    ]),
    submit() {
      if (this.title.trim() !== "") {
        let newTodoItem = {
          title: this.title,
          id: Date.now(),
          completed: false,
          noteId: this.note.id,
        };

        this.note.todoList.push(newTodoItem);
        this.saveChanges();
        this.title = "";
      }
    },
    stateCheckbox() {
      this.saveChanges();
    },
    cancelPreviousChange() {
      if (this.indexChange < this.eventLog.length - 1) {
        this.indexChange++;
        this.note.todoList = [...JSON.parse(this.eventLog[this.indexChange])];
      }
    },
    returnDiscardedChange() {
      if (this.indexChange > 0) {
        this.indexChange--;
        this.note.todoList = [...JSON.parse(this.eventLog[this.indexChange])];
      }
    },
    returnToPageNotes() {
      this.previousStateNote();
      this.$router.push("/");
    },
    checkChangeIndexEventLog() {
      if (this.indexChange !== 0) {
        for (let key in this.eventLog) {
          if (this.eventLog.hasOwnProperty(key)) {
            if (this.indexChange > key) {
              this.eventLog.shift();
            }
          }
        }
        this.indexChange = 0;
      }
    },
    saveChanges() {
      this.checkChangeIndexEventLog();
      this.saveEventlog(this.note.todoList);
    },
    previousStateNote() {
      this.notes = JSON.parse(localStorage.getItem("notes")) || "[]";

      let notChangedNote =
        this.notes[this.notes.findIndex((n) => n.id === this.note.id)];

      this.note.title = notChangedNote.title;
      this.note.todoList = notChangedNote.todoList;
      this.clearEventLog();
      this.closeCancelEditPopup();
    },
    showDeleteNotePopup() {
      this.isConfirmPopupVisible = true;
    },
    showCancelEditPopup() {
      this.isCancelEditPopupVisible = true;
    },
    deleteNoteItem() {
      this.deleteNote(this.note);
      this.isConfirmPopupVisible = false;
      this.$router.push("/");
    },
    removeTodoItem(todoItem) {
      this.note.todoList.splice(
        this.note.todoList.findIndex((n) => n.id === todoItem.id),
        1
      );

      this.saveChanges();
    },
    closePopupConfirm() {
      this.isConfirmPopupVisible = false;
    },
    closeCancelEditPopup() {
      this.isCancelEditPopupVisible = false;
    },
    editTodoTitle: function (todo) {
      this.beforeEditCache = todo.title;
      this.editedTodo = todo;
    },
    editNoteTitle: function (note) {
      this.beforeEditCache = note.title;
      this.editedNote = note;
    },
    cancelEditTodoTitle: function (todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },
    cancelEditNoteTitle: function (note) {
      this.editedNote = null;
      note.title = this.beforeEditCache;
    },

    doneEditTodoTitle: function (todo) {
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = null;
      todo.title = todo.title.trim();
      this.saveChanges();
    },
    doneEditNoteTitle: function (note) {
      if (!this.editedNote) {
        return;
      }
      this.editedNote = null;
      note.title = note.title.trim();
    },
    saveNote(editNote) {
      this.saveEditedNote(editNote);
    },
  },
  mounted() {
    this.saveChanges();
  },
  computed: {
    note() {
      return this.$store.getters.noteById(+this.$route.params.id);
    },
    eventLog() {
      return this.$store.getters.eventLog;
    },
  },
  directives: {
    "todo-focus": function (el, binding) {
      if (binding.value) {
        el.focus();
      }
    },
  },
};
</script>

<style scoped>
.header {
  font-weight: normal;
  background: #2f4858;
  color: #fff;
  font-size: 40px;
}
.circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 50px;
  color: #fff;
  line-height: 70%;
  text-align: center;
  background: #000;
  text-decoration: none;
  position: absolute;
  margin-left: 20px;
  display: flex;
  justify-content: center;
}
.note-title {
  text-align: center;
  width: 100%;
  display: flex;
  align-items: center;
}
.header .note-title label {
  flex-grow: 1;
  padding: 20px;
}
.note-setting__panel {
  border-top: solid 1px black;
  border-bottom: solid 1px black;
  display: flex;
  background: #ffffff;
}
.note-setting__panel form {
  display: flex;
  flex-grow: 1;
}
.note-setting__panel form input {
  width: 100%;
}
.note-setting__panel button,
.todo-item button {
  min-width: 48px;
  min-height: 48px;
  order: 1;
  background-color: #fff;
  color: #2f4858;
  border: unset;
  margin: 2px;
}
.todo-item button {
  background-color: transparent;
}
.note-setting__panel button:hover {
  background-color: #f2f2f2;
}
.note-setting__panel input {
  min-height: 42px;
}
.circle {
  cursor: pointer;
}
@-moz-document url-prefix() {
  .circle {
    line-height: 50px !important;
  }
}
a {
  text-decoration: none;
}
.edit-note {
  border: solid 1px black;
  max-width: 800px;
}
.todo-list {
  padding: 0;
  margin: 0px;
}
.todo-list li.editing .view,
.header .editNoteTitle label {
  display: none;
}
.todo-list li .edit,
.header .note-title .edit {
  display: none;
}
.todo-list li.editing .edit {
  display: block;
  width: 100%;
  padding: 12px 16px;
  margin: 0;
}
.header .note-title.editNoteTitle .edit {
  display: block;
  width: 85%;
  padding: 15px 0px;
  margin: 16px 0 16px 90px;
  font-size: 18px;
  text-align: center;
}
.todo-list li.completed label {
  color: #d9d9d9;
  text-decoration: line-through;
}
.todo-item {
  border: solid 1px #ccc;
  display: flex;
  min-height: 43px;
  align-items: center;
}
.todo-item .view label {
  flex-grow: 1;
  word-break: break-all;
  padding: 12px 16px;
}
.todo-item .view {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.toggle,
.todo-item .view label,
.header .note-title label {
  cursor: pointer;
  word-break: break-all;
}
.header .note-title label {
  margin-left: 8%;
  max-width: 80%;
}
.todo-item input.edit {
  width: 100%;
}
@media (max-width: 500px) {
  .note-setting__panel {
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .note-setting__panel form {
    width: 100%;
  }
  .note-setting__panel form button {
    border: solid 1px #ccc;
  }
  .note-setting__panel form input {
    margin: 2px;
  }
}
</style>
