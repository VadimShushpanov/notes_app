<template>
  <div class="notes">
    <h3 class="header">Notes</h3>

    <form @submit.prevent="submit">
      <input type="text" placeholder="Enter note title" v-model="title" />
      <button class="button" title="Create note" type="submit">
        <i class="fa fa-plus-circle" aria-hidden="true"></i>
      </button>
    </form>

    <ul class="notes-list">
      <ol class="note" v-for="note in notes" :key="note.id">
        <DeleteNotePopup
          v-if="note.isConfirmPopupVisible"
          @closePopup="closePopupConfirm"
          @deleteNote="deleteNoteItem"
          >{{ note.title }}</DeleteNotePopup
        >

        <h5 class="note-name">{{ note.title }}</h5>
        <div class="todo-list">
          <div v-if="note.todoList">
            <div
              class="todo-item"
              v-for="todoItem in note.todoList"
              :key="todoItem.id"
            >
              <span class="todo-item__name">{{ todoItem.title }}</span>
            </div>
          </div>
        </div>

        <div class="note-setting__panel">
          <router-link :to="'/edit_note/' + note.id">
            <button title="Edit note">
              <i class="fa fa-pencil" aria-hidden="true"></i>
            </button>
          </router-link>

          <button title="Delete note" @click="showPopupConfirm(note)">
            <i class="fa fa-trash fa-lg" aria-hidden="true"></i>
          </button>
        </div>
      </ol>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import DeleteNotePopup from "./popup/DeleteNotePopup";

export default {
  name: "Notes",
  noteId: "",
  currentNote: {},
  data() {
    return {
      title: "",
    };
  },
  computed: mapGetters(["notes"]),
  components: { DeleteNotePopup },
  methods: {
    ...mapMutations(["deleteNote", "addNote"]),
    deleteNoteItem() {
      this.deleteNote(this.currentNote);
      this.currentNote.isConfirmPopupVisible = false;
    },
    submit() {
      if (this.title.trim() !== "") {
        this.addNote({
          title: this.title,
          id: Date.now(),
          todoList: [],
          isConfirmPopupVisible: false,
        });
        this.title = "";
      }
    },
    showPopupConfirm(note) {
      this.currentNote = note;
      this.currentNote.isConfirmPopupVisible = true;
    },
    closePopupConfirm() {
      this.currentNote.isConfirmPopupVisible = false;
    },
  },
};
</script>

<style scoped>
.header {
  background: #2f4858;
  text-align: center;
  color: #fff;
  font-size: 40px;
  font-weight: normal;
  margin: 0 0 20px 0;
}
ul.notes-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0;
  margin-right: -21px;
}
.note {
  height: 200px;
  border: solid 1px black;
  width: 255px;
  padding-left: 0px;
  margin: 0px 19px 15px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.note-name {
  background: #2f4858;
  color: #fff;
  padding: 10px 0px 10px 0px;
  margin: 0px;
  text-align: center;
}
.note:hover {
  box-shadow: 0 0 5px 2px;
}
.todo-item__name {
  color: #000;
  border: solid 1px #ccc;
  width: 97%;
  white-space: nowrap;
  overflow: hidden;
  padding: 13px 6px;
  text-overflow: ellipsis;
}
.todo-item {
  display: flex;
}
.todo-list {
  overflow: auto;
  height: 133px;
}
.note-setting__panel {
  border-top: solid 1px black;
  display: flex;
  justify-content: flex-end;
}
.note-setting__panel button {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
i.fa {
  font-size: 20px;
}
a {
  text-decoration: none;
}
form {
  display: flex;
  justify-content: flex-end;
}
input {
  min-height: 20px;
  min-width: 249px;
}
form button {
  margin-left: 10px;
  min-width: 28px;
  min-height: 28px;
  color: #2f4858;
}
</style>
