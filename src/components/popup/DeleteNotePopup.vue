<template>
  <div class="popup_wrapper">
    <div class="popup">
      <div class="popup-header">
        Do you really want to delete
        <slot></slot>?
      </div>

      <div class="popup-footer">
        <button @click="deleteNote">Yes</button>
        <button @click="closePopup">No</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DeleteNotePopup",
  data() {
    return {};
  },
  methods: {
    deleteNote() {
      this.$emit("deleteNote");
    },
    closePopup() {
      this.$emit("closePopup");
    },
  },
};
</script>

<style scoped>
.popup_wrapper {
  background: rgba(64, 64, 64, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
.popup {
  position: fixed;
  padding: 16px;
  background: #fff;
  box-shadow: 0 0 17px 0 #e7e7e7;
}
.popup-footer {
  padding-top: 10px;
  display: flex;
  justify-content: center;
}
.popup-footer button {
  margin: 0px 5px;
}
</style>
