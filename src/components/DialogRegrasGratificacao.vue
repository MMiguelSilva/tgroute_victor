<template>
    <v-dialog v-model="dialog">
        <template v-slot:activator="{ on, attrs }">
          <span>
            {{ mensagem }}
          </span>
          <v-btn
        v-if="Number(id) == 0"
        class="mx-1"
        color="primary"
        x-small
        v-bind="attrs"
        v-on="on"
        @click="dialog = true"
      >
        <v-icon x-small>note_add</v-icon>Nova Regra
      </v-btn>

          <v-btn
        x-small
        v-if="Number(id) > 0"
        color="primary"
        text
        v-bind="attrs"
        v-on="on"
        @click="alteraGratificacao"
      >Sim</v-btn>

    </template>
    </v-dialog>
  </template>
  
  <script>
  
  export default {
    props:{
      mensagem:String
    },
    data() {
      return {
        showDialog: true,
        title: 'EditarRegraGratificacao',
        message: 'Editar',
      };
    },

    methods: {
      closeDialog() {
        this.showDialog = false;
      },
    },
  };


  </script>
  
  <style scoped>
  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
  
  .dialog-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  
  .dialog-content {
    background: white;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    text-align: center;
  }
  
  button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  