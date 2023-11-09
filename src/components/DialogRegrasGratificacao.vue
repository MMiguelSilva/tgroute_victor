<template>
    <v-dialog v-model="dialog" max-width="300px">
        <template>
          <span>
          Teste
          </span>
    </template>
    </v-dialog>
  </template>
  
  <script>
  
  export default {
    props:{
      idRegrasGratificacao: Number,
    },
    data() {
      return {
        dialog: false,
        title: 'EditarRegraGratificacao',
        message: 'Editar',
      };
    },

    methods: {
      closeDialog() {
        
      },
    },
    mounted(){
      console.log("id: " + this.idRegrasGratificacao)
    }
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
  