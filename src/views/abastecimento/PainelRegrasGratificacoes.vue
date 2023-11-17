<template>
  <div class="listagratificacao">
    <h3 class="subheading grey--text mt-2">Lista de regras de gratificações</h3>

    <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>Nova gratificação adicionada!</span>
      <v-btn small color="black" @click="snackbar = false;">Fechar</v-btn>
    </v-snackbar>

    <v-snackbar v-model="snackbarAviso" :timeout="4000" top color="error">
      <span>{{aviso}}</span>
      <v-btn small color="black" @click="snackbarAviso = false;">Fechar</v-btn>
    </v-snackbar>

    <v-dialog v-model="loading" persistent width="100" content-class="loading-dialog">
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate :width="3" color="primary"></v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>

    <v-flex class="mb-3">
      <PopupAdicionaRegrasGratificacoes
        :id="0"
        @gratificacaoAdicionada="atualizaSnackbar"
        @gratificacaoAtualiza="retornaListaGratificacao"
      />
      <v-btn
        class="mx-1"
        color="primary"
        x-small
        @click="retornaListaGratificacao"
        :loading="loadingAtualiza"
      >
        <v-icon x-small>cached</v-icon>Pesquisar
      </v-btn>
      <v-btn class="mx-1" color="primary" x-small @click="fechar">Fechar</v-btn>
    </v-flex>

    <v-layout row class="mb-3 ml-1">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn small depressed v-bind="attrs" v-on="on" @click="sortBy('id')">
            <v-icon left small>date_range</v-icon>
            <span class="caption text-lowercase grey--text lighten-1">Por Código</span>
          </v-btn>
        </template>
        <span>Classica por Código</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn small depressed v-bind="attrs" v-on="on" @click="sortBy('descricao')">
            <v-icon left small>date_range</v-icon>
            <span class="caption text-lowercase grey--text lighten-1">Por descrição</span>
          </v-btn>
        </template>
        <span>Classica por descrição</span>
      </v-tooltip>
    </v-layout>

    <v-container class="ml-1" v-for="(item, i) in lstGratificacao" :key="item.id">
      <v-card flat>
        <v-layout row wrap class="pa-1 ml-1">
          <v-flex xs12 sm6 md1>
            <div class="caption grey--text">Código</div>
            <div class="body-1 font-weight-medium">{{ item.id }}</div>
          </v-flex>

          <v-flex xs12 sm4 md4>
            <div class="caption grey--text">Descrição</div>
            <div class="body-2 font-weight-medium">{{ item.descricao }}</div>
          </v-flex>

          <v-tooltip top>
            <template v-slot:activator="{ on: tooltip }">
              <v-flex v-on="tooltip" xs2 sm4 md1>
                <div>
                  <v-dialog v-model="dialog1" :retain-focus="false" persistent max-width="290">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="ml-2"
                        icon
                        color="gray"
                        v-bind="attrs"
                        v-on="on"
                        :loading="loading1 && i==index"
                        @click="idAtual=`${item.id}`; index=i"
                      >
                        <v-icon medium>edit</v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title class="body-1">Deseja alterar a gratificação: {{idAtual}}</v-card-title>
                      <v-card-actions class="justify-space-around">
                        <v-btn small color="primary" text> 
                          <PopupAdicionaRegrasGratificacoes
                            :id="Number(idAtual)"
                            @gratificacaoAtualiza="retornaListaGratificacao"
                            @alteraGratificacao="dialog1 = false"
                          />
                        </v-btn>

                        <v-btn small color="primary" text @click="dialog1 = false">Não</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
              </v-flex>
            </template>
            <span>Altera gratificação</span>
          </v-tooltip>

          <v-tooltip top color="deep-orange">
            <template v-slot:activator="{ on: tooltip }">
              <v-flex v-on="tooltip" xs2 sm4 md1>
                <div>
                  <v-dialog v-model="dialog2" :retain-focus="false" persistent max-width="290">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="ml-2"
                        icon
                        color="deep-orange"
                        v-bind="attrs"
                        v-on="on"
                        :loading="loading2 && i==index"
                        @click="idAtual=`${item.id}`; index=i"
                      >
                        <v-icon medium>delete</v-icon>
                      </v-btn>
                    </template>

                    <v-card>
                      <v-card-title class="body-1">Confirmar apagar a gratificação: {{idAtual}} ?</v-card-title>
                      <v-card-actions class="justify-space-around">
                        <v-btn small color="primary" text @click="eliminaGratificacao()">Sim</v-btn>

                        <v-btn small color="primary" text @click="dialog2 = false">Não</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
              </v-flex>
            </template>
            <span>Elimina gratificação</span>
          </v-tooltip>
        </v-layout>
      </v-card>
    </v-container>

    <v-flex xs12 sm12 md12 class="ml-5" v-show="lstGratificacao.length > 0">
      <div class="body-2 black--text">Total de gratificações: {{ lstGratificacao.length }}</div>
    </v-flex>
  </div>
</template>


<script>

import axios from "axios";
import Cripto from "../../lib/cripto";
import caminhoAPI from "../../config/configAPI";
import PopupAdicionaRegrasGratificacoes from "./PopupAdicionaRegrasGratificacoes.vue";

export default {
  components: {
    PopupAdicionaRegrasGratificacoes,
  },
  data() {
    return {
      loadingAtualiza: false,
      dialog1: false,
      dialog2: false,
      snackbar: false,
      snackbarAviso: false,
      avisoErro: "",
      aviso: "",
      index: -1,
      lstGratificacao: [],
      loading: false,
      loading1: false,
      loading2: false,
      idAtual: 0,
      descricaoAtual: "",
      solucao: "",
      tipoCaminho: 0,
      idCliente: 0,
      senha: "",
    };
    
  },
  methods: {
    atualizaSnackbar() {
      this.snackbar = true;
    },
    async retornaListaGratificacao() {
      try {
        this.loading = true;
        this.avisoErro = "";
        this.lstGratificacao = [];

        const dados = {
          idCliente: this.idCliente
        };

        const token = Cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        await autorizaAxios.post("retornaListaGratificacao", dados).then(res => {
          if (!res.data.length == 0) {
            this.lstGratificacao = res.data;
          } else {
            this.lstGratificacao = [];
          }
        });
      } catch (error) {
        this.avisoErro = error;
      } finally {
        this.loading = false;
      }
    },
    
    sortBy: function(prop) {
      this.lstGratificacao.sort((a, b) => (a[prop] < b[prop] ? -1 : 1));
    },

    async retornaGratificacao(id, idCliente) {
  try {
    this.loading = true;
    this.avisoErro = "";

    const dados = {
      id: id,
      idCliente: idCliente,
    };

    const token = Cripto.decrypt(sessionStorage.token); // Supondo que Cripto.decrypt seja uma função válida
    const autorizaAxios = axios.create({
      baseURL: caminhoAPI(this.tipoCaminho), // Supondo que caminhoAPI seja uma função válida
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Faz uma solicitação POST para a API para buscar os dados da gratificação
    const resposta = await autorizaAxios.post("retornaGratificacao", dados);

    // Lida com os dados da resposta, por exemplo, atualiza o estado do componente
    if (resposta.data.name == "error") {
      this.aviso = "Falha ao buscar a gratificação. Tente novamente mais tarde.";
      this.snackbarAviso = true;
    } else {
      // Atualize o estado do seu componente com os dados da gratificação buscados, se necessário.
    }
  } catch (error) {
    this.avisoErro = "Falha ao buscar a gratificação. Tente novamente mais tarde.";
    console.log("Erro ao buscar a gratificação - " + error);
  } finally {
    this.loading = false;
  }
},

    async eliminaGratificacao() {
      try {
        if (this.idAtual === 0) {
          return;
        }

        this.loading2 = true;
        this.dialog2 = false;

        const dados = {
          id: this.idAtual,
          idCliente: this.idCliente
        };

        console.log(dados)
        const token = Cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        await autorizaAxios.post("eliminaGratificacao", dados).then(res => {
          if (res.data.name == "error") {
            this.aviso =
              "Não foi possível eliminar a gratificação, \n tente mais tarde!";
            this.snackbarAviso = true;
          } else {
            this.retornaListaGratificacao();
          }
        });
      } catch (error) {
        this.avisoErro =
          "Não foi possível eliminar a gratificação, \n tente mais tarde!";
        this.loading2 = false;
        console.log("Erro no eliminaGratificacao - " + error);
      } finally {
        this.loading2 = false;
      }
    },
    fechar() {
      this.dialog = false;
      this.$destroy();
      this.$router.push("/painelgeral");
    }
  },
  mounted() {
    if (localStorage.tipoCaminho) {
      this.tipoCaminho = localStorage.tipoCaminho;
    }
    if (sessionStorage.idCliente)
    {
      this.idCliente = Cripto.decrypt(sessionStorage.idCliente);
    }

    this.retornaListaGratificacao();
  }
  
};
</script>

<style>
.loading-dialog {
  background-color: #303030;
}
</style>