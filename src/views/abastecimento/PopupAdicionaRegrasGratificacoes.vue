<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <template v-slot:activator="{ on, attrs }">
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
        >Sim</v-btn
      >
    </template>

    <v-snackbar v-model="snackbarAviso" :timeout="4000" top color="success">
      <span>{{ aviso }}</span>
      <v-btn small color="black" @click="snackbarAviso = false">Fechar</v-btn>
    </v-snackbar>

    <v-snackbar v-model="snackbarErro" :timeout="4000" top color="error">
      <span>{{ aviso }}</span>
      <v-btn small color="black" @click="snackbarErro = false">Fechar</v-btn>
    </v-snackbar>

    <v-card>
      <v-card-title>
        <h4 v-if="Number(id) == 0">Nova Gratificação</h4>
        <h4 v-else>Código: {{ id }}</h4>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form" style="width: 100%">
          <v-row>
            <v-col cols="6">
              <v-select
                :items="cadastroAtivo"
                v-model="cadastroAtivoSelect"
                label="Usuário ativo"
                prepend-icon="edit"
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-text-field
              label="Descricao da gratificação"
              v-model="descricao"
              prepend-icon="edit"
              :maxlength="50"
            ></v-text-field>
          </v-row>

          <v-spacer></v-spacer>

          <v-row>
            <v-col align="center">
              <v-btn
                x-small
                class="primary mx-0"
                @click="validaCampos"
                :loading="loading"
                >Gravar</v-btn
              >

              <v-btn
                x-small
                class="primary mx-0"
                @click="validaCampos"
                :loading="loading"
                >ADICIONAR REGRA</v-btn
              >

              <v-btn x-small class="primary mx-0 ml-5" @click="sair"
                >Sair</v-btn
              >
            </v-col>
          </v-row>

          <v-row style="width: 100%">
            <v-flex style="width: 100%">
              <v-row v-if="lstLctoGratificacoes.length > 0">
                <v-col>
                  <v-row>
                    <v-col align="center" justify="justify-center">
                      <span class="caption">Lista de gratificações</span>
                    </v-col>
                  </v-row>

                  <v-simple-table
                    fixed-header
                    height="auto"
                    width="100"
                    class="table"
                  >
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th
                            class="text-right caption primary white--text"
                            width="25%"
                          >
                            Média de
                          </th>
                          <th
                            class="text-right caption primary white--text"
                            width="25%"
                          >
                            Média até
                          </th>
                          <th
                            class="text-right caption primary white--text"
                            width="25%"
                          >
                            Valor
                          </th>
                          <th
                            class="text-right caption primary white--text"
                            width="25%"
                          >
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="item in computedLstLctoGratificacoes"
                          :key="item.id"
                        >
                          <td class="caption" width="25%" align="right">
                            {{ item.mediade }}
                          </td>
                          <td class="caption" width="25%" align="right">
                            {{ item.mediaate }}
                          </td>
                          <td class="caption" width="25%" align="right">
                            {{ item.valor }}
                          </td>

                          <td class="caption">
                            <div style="display: flex; align-items: center">
                              <v-btn @click="dialog1 = true; idLcto = item.id">
                                <v-icon size="20">edit</v-icon>
                              </v-btn>

                              <v-btn
                                x-small
                                color="primary"
                                text
                                @click="eliminaLctoRegraGratificacao(item.id)"
                              >

                                <v-icon size="20" color="red">delete</v-icon>
                              </v-btn>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-flex>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog1" max-width="600px" persistent>
      <div style="background-color:white;">
      <v-row style="border-radius: 6px;">
      <v-col style="padding-left: 20px;" cols="6">
        <v-text-field
          type="number"
          label="Média de"
          hint="Média percorrida pelo motorista."
          v-model="mediadeEdit"
          prepend-icon="local_shipping"
          :maxlength="20"
        ></v-text-field>

        <v-text-field
          type="number"
          hint="Média nescessária para a gratificação."
          label="Média até"
          v-model="mediaateEdit"
          prepend-icon="pin_drop"
          :maxlength="20"
        ></v-text-field>

        <v-text-field
          type="number"
          label="Valor"
          hint="Valor da gratificação."
          v-model="valorEdit"
          prepend-icon="payments"
          :maxlength="20"
        ></v-text-field>

        <div class="buttonContainer">
          <v-btn @click="salvarEdicao" color="primary">Salvar</v-btn>
          <v-btn @click="dialog1 = false" color="primary">Fechar </v-btn>
        </div>
        
      </v-col>
    </v-row>
  </div>
    </v-dialog>
  </v-dialog>
</template>


<script>
import axios from "axios";
import cripto from "../../lib/cripto";
import Cripto from "../../lib/cripto";
import caminhoAPI from "../../config/configAPI";

export default {
  data() {
    return {
      loading: false,
      dialog: false,
      dialog1: false,
      snackbarErro: false,
      snackbarAviso: false,
      aviso: "",
      tipoCaminho: 0,
      cadastroAtivo: ["Sim", "Não"],
      cadastroAtivoSelect: null,
      descricao: "",
      idCliente: 0,
      lstLctoGratificacoes: [],
      AbrirDialogRegraGratificacoes: false,
      idAtual: 0,
      mediadeEdit: null,
      mediaateEdit: null,
      valorEdit: null,
      idLcto:0,
      
    };
  },
  props: {
    id: Number,
  },
  methods: {
    sair() {
      this.limpaCampos();
      this.dialog = false;
    },
    limpaCampos() {
      this.avisoErro = "";
      this.descricao = "";
    },
    validaCampos() {
      if (this.cadastroAtivoSelect == "" || this.cadastroAtivoSelect == null) {
        this.aviso = "Selecione se a gratificação está ativa!";
        this.snackbarErro = true;
        return;
      }

      if (this.descricao == "" || this.descricao == null) {
        this.aviso = "É necessário informar a descrição da gratificação!";
        this.snackbarErro = true;
        return;
      }

      if (this.$refs.form.validate()) {
        this.loading = true;
        this.insereGratificacao();
      }
    },
    
    async insereGratificacao() {
      try {
        console.log("insere");
        const token = cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let ativo = false;
        if (this.cadastroAtivoSelect == "Sim") {
          ativo = true;
        }

        const dados = {
          id: this.id,
          idCliente: this.idCliente,
          descricao: this.descricao,
          cadastroAtivo: ativo,
        };

        console.log(dados);

        await autorizaAxios.post("insereGratificacao", dados).then((res) => {
          console.log(res.data);
          if (res.data.name != "error") {
            this.loading = false;
            this.dialog = false;
            this.$emit("gratificacaoAdicionada");
            this.$emit("gratificacaoAtualiza");
            this.limpaCampos();
          } else {
            this.avisoErro =
              "Não foi possível gravar a gratificação, tente mais tarde!";
          }
        });
      } catch (error) {
        this.avisoErro =
          "Não foi possível gravar a gratificação, tente mais tarde!";
        console.log("Erro no insereGratificacao - " + error);
      } finally {
        this.loading = false;
      }
    },

    async insereLctoRegraGratificacao() {
      try {
        const token = cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const dados = {
        id: this.idLcto,
        idCliente: this.idCliente,
        mediade: this.mediadeEdit,
        mediaate: this.mediaateEdit,
        valor: this.valorEdit,
      };


        await autorizaAxios.post("insereLctoRegraGratificacao", dados).then((res) => {
        if (res.data.name !== "error") {
          this.loading = false;
          this.dialog1 = false;
          this.retornaListaLctoRegraGratificacao();
          this.limpaCampos(); // Limpa os campos se necessário
        } else {
          this.avisoErro =
            "Não foi possível gravar a gratificação, tente mais tarde!";
        }
      });
    } catch (error) {
      this.avisoErro =
        "Não foi possível gravar a gratificação, tente mais tarde!";
      console.log("Erro no insereLctoRegraGratificacao - " + error);
    } finally {
      this.loading = false;
    }
  },


    formatDate(data) {
      if (!data) return null;

      const [year, month, day] = data.split("-");
      return `${day}/${month}/${year}`;
    },

    alteraGratificacao(gratificacao) {
      this.dialog = true;
      this.$emit("alteraGratificacao");
      console.log(gratificacao);
      this.AbrirDialogRegraGratificacoes = true;
    },

    async retornaGratificacao() {
      try {
        this.avisoErro = "";
        this.loading = true;

        const dados = {
          id: this.id,
          idCliente: this.idCliente,
        };

        const token = cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await autorizaAxios.post("retornaGratificacao", dados).then((res) => {
          console.log(res.data);
          if (!res.data.length == 0) {
            if (Number(this.id) > 0) {
              if (res.data[0].cadastroativo) {
                this.cadastroAtivoSelect = "Sim";
              } else {
                this.cadastroAtivoSelect = "Não";
              }
              this.descricao = res.data[0].descricao;
            }
          } else {
            this.limpaCampos();
          }
        });
      } catch (error) {
        this.avisoErro = error;
      } finally {
        this.loading = false;
      }
    },

    async retornaListaLctoRegraGratificacao() {
      try {
        this.avisoErro = "";
        this.loading = true;

        const dados = {
          idCliente: this.idCliente,
          idGratificacao: this.id,
        };

        const token = cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await autorizaAxios
          .post("retornaListaLctoRegraGratificacao", dados)
          .then((res) => {
            console.log(res.data);
            if (!res.data.length == 0) {
              this.lstLctoGratificacoes = res.data;
              console.log(398, this.lstLctoGratificacoes);
            } else {
              this.lstLctoGratificacoes = [];
              this.limpaCampos();
            }
          });
      } catch (error) {
        this.avisoErro = error;
      } finally {
        this.loading = false;
      }
    },

    alteraLctoRegraGratificacao(item) {
    this.mediadeEdit = item.mediade;
    this.mediaateEdit = item.mediaate;
    this.valorEdit = item.valor;
    this.idLcto = item.id;
  },

  salvarEdicao() {
    
    const index = this.lstLctoGratificacoes.findIndex(item => item.id === this.idLcto);

    if (index !== -1) {
      
      this.$set(this.lstLctoGratificacoes, index, {
        id: this.idLcto,
        mediade: this.mediadeEdit,
        mediaate: this.mediaateEdit,
        valor: this.valorEdit,
      });
    }

    this.dialog1 = false;
    this.insereLctoRegraGratificacao();
  },


    concluirEdicao() {
      this.lstLctoGratificacoes = this.computedLstLctoGratificacoes;

      this.dialog1 = false;
    },

    async eliminaLctoRegraGratificacao(id) {
      try {
        if (this.id === 0) {
          return;
        }

        this.loading = true;
        this.dialog1 = false;

        const dados = {
          id: id,
          idCliente: this.idCliente,
        };

        console.log(dados);
        const token = Cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await autorizaAxios
          .post("eliminaLctoRegraGratificacao", dados)
          .then((res) => {
            if (res.data.name == "error") {
              this.aviso =
                "Não foi possível eliminar a gratificação, \n tente mais tarde!";
              this.snackbarAviso = true;
            }
          });
      } catch (error) {
        this.avisoErro =
          "Não foi possível eliminar a gratificação, \n tente mais tarde!";
        this.loading2 = false;
        console.log("Erro no eliminaLctoRegraGratificacao - " + error);
      } finally {
        this.loading2 = false;
        this.retornaListaLctoRegraGratificacao();
      }
    },
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.data);
    },
    computedLstLctoGratificacoes() {
      return this.lstLctoGratificacoes.map((item) => {
        if (item.id === this.idAtual) {
          item.mediade = this.mediadeEdit;
          item.mediaate = this.mediaateEdit;
          item.valor = this.valorEdit;
        }
        return item;
      });
    },
  },
  mounted() {
    if (localStorage.tipoCaminho) {
      this.tipoCaminho = localStorage.tipoCaminho;
    }
  },
  watch: {
    dialog(value) {
      this.loading = false;
      if (value) {
        this.limpaCampos();

        if (sessionStorage.idCliente) {
          this.idCliente = cripto.decrypt(sessionStorage.idCliente);
          if (Number(this.id) > 0) {
            this.retornaGratificacao().then(() => {
              this.retornaListaLctoRegraGratificacao();
            });
          }
        }
      }
    },
  },
};
</script>

<style>
.with-background-color .v-dialog__content {
  background-color: red;
}

.v-menu__content {
  box-shadow: none !important;
}
.dialog {
  height: 1000px;
}
.last-modal {
  height: 100%;
}

.last-modal .v-dialog__content {
  padding: 0;
}

.last-modal .v-dialog__container {
  height: 100%;
}

.last-modal .v-simple-table {
  height: calc(100% - 48px); /* 48px é a altura do cabeçalho da tabela */
  overflow-y: auto;
}

.buttonContainer {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  margin-bottom:10px;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>


