<template>
  <div class="cadlimitevelocidade">
    <h3 class="subheading grey--text mt-2">
      Cadastro de parâmetros de troca de óleo
    </h3>

    <v-dialog
      v-model="loading"
      persistent
      width="100"
      content-class="loading-dialog"
    >
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular
            indeterminate
            :width="3"
            color="primary"
          ></v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>

    <v-snackbar v-model="snackbarAviso" :timeout="4000" top color="success">
      <span>{{ aviso }}</span>
      <v-btn small color="black" @click="snackbarAviso = false">Fechar</v-btn>
    </v-snackbar>

    <v-snackbar v-model="snackbarErro" :timeout="4000" top color="error">
      <span>{{ aviso }}</span>
      <v-btn small color="black" @click="snackbarErro = false">Fechar</v-btn>
    </v-snackbar>

    <v-flex xs12 sm4 md6>
      <v-row>
        <v-col>
          <v-select
            :items="lstVeiculos"
            v-model="veiculoSelecionado"
            :item-text="descricao"
            item-value="idrastreador"
            label="Selecione o veículo"
            prepend-icon="filter_alt"
            @mousedown="retornaListaVeiculoRastreado"
            @change="retornaParametroTrocaOleo"
          ></v-select>
        </v-col>
      </v-row>
    </v-flex>

    <v-flex xs12 sm5 md5>
      <v-row>
        <v-col cols="5">
          <v-text-field-dotnumber
            v-model="qtdeMes"
            label="Quantidade meses para troca"
            v-bind:properties="{
              readonly: false,
              disabled: false,
              outlined: true,
              clearable: true,
              placeholder: '',
            }"
            v-bind:options="{ length: 5, empty: null, applyAfter: false }"
          />

          <v-text-field-dotnumber
            v-model="qtdeKm"
            label="Quantidade Km para troca"
            v-bind:properties="{
              readonly: false,
              disabled: false,
              outlined: true,
              clearable: true,
              placeholder: '',
            }"
            v-bind:options="{ length: 5, empty: null, applyAfter: false }"
          />
        </v-col>
      </v-row>
    </v-flex>

    <v-flex xs12 sm4 md4>
      <v-row>
        <v-col align="center" justify="justify-center">
          <v-btn x-small class="primary mx-0" @click="confirmar"
            >Confirmar</v-btn
          >
          <v-btn x-small class="primary mx-0 ml-5" @click="fechar"
            >Fechar</v-btn
          >
        </v-col>
      </v-row>
    </v-flex>
  </div>
</template>

<script>
import cripto from "../../lib/cripto";
import axios from "axios";
import caminhoAPI from "../../config/configAPI";
import funcoes from "../../lib/funcoes";

export default {
  data() {
    return {
      snackbarAviso: false,
      snackbarErro: false,
      idCliente: 0,
      idUsuario: 0,
      tipoCaminho: 0,
      lstVeiculos: [],
      veiculoSelecionado: "",
      limiteVelocidade: "0",
      aviso: "",
      loading: false,
      qtdeMes: 0,
      qtdeKm: 0,
    };
  },
  methods: {
    fechar() {
      this.$destroy();
      this.$router.push("/painelgeral");
    },
    cancela() {
      this.limpaCampos();
    },
    limpaCampos() {
      this.lstVeiculos = [];
      this.veiculoSelecionado = "";
      this.qtdeMes = "0";
      this.qtdeKm = "0";
    },
    descricao(item) {
      return (
        funcoes.formataTexto(item.placa, 10, " ", "E") +
        " - " +
        funcoes.formataTexto(item.descricao, 20, " ", "E") +
        " - " +
        funcoes.isNull(item.apelido)
      );
    },
    async retornaListaVeiculoRastreado() {
      try {
        this.aviso = "";

        const dados = {
          idCliente: this.idCliente,
          idGrupoRastreador: "",
          idUsuario: this.idUsuario,
        };

        const token = cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await autorizaAxios
          .post("retornaListaVeiculoRastreado", dados)
          .then((res) => {
            if (!res.data.length == 0) {
              this.lstVeiculos = res.data;
            } else {
              this.lstVeiculos = [];
            }
          });
      } catch (error) {
        this.aviso = error;
      }
    },
    async retornaParametroTrocaOleo() {
      try {
        this.aviso = "";

        const dados = {
          idCliente: this.idCliente,
          idRastreador: this.veiculoSelecionado,
        };

        const token = cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await autorizaAxios
          .post("retornaParametroTrocaOleo", dados)
          .then((res) => {
            if (!res.data.length == 0) {
            //console.log(res.data)
              if (Number(res.data[0].qtdemes) > 0 && Number(res.data[0].qtdekm)) {
                this.qtdeMes = res.data[0].qtdemes;
                this.qtdeKm = res.data[0].qtdekm;
              } else {
                this.qtdeMes = "0";
                this.qtdeKm = "0";
              }
            } else {
              this.qtdeMes = "0";
              this.qtdeKm = "0";
            }
          });
      } catch (error) {
        this.aviso = error;
      }
    },
    confirmar() {
      if (this.veiculoSelecionado == "") {
        this.aviso = "Precisa selecionar o veículo!";
        this.snackbarErro = true;
        return;
      }

      this.gravaParametroTrocaOleo();
    },
    async gravaParametroTrocaOleo() {
      try {
        this.aviso = "";
        this.loading = true;

        const dados = {
          idCliente: this.idCliente,
          idRastreador: this.veiculoSelecionado,
          qtdeMes: this.qtdeMes,
          qtdeKm: this.qtdeKm,
        };

        const token = cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await autorizaAxios
          .post("gravaParametroTrocaOleo", dados)
          .then((res) => {
            if (res.data.name != "error") {
              this.aviso =
                "Parâmetros de troca de óleo adicionados com sucesso ";
              this.snackbarAviso = true;
              this.limpaCampos();
            } else {
              this.aviso =
                "Não foi possível gravar os parâmetros, tente mais tarde!";
              this.snackbarErro = true;
            }
          });
      } catch (error) {
        this.aviso = error;
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    if (sessionStorage.idCliente) {
      this.idCliente = cripto.decrypt(sessionStorage.idCliente);
    }
    if (sessionStorage.idUsuario) {
      this.idUsuario = cripto.decrypt(sessionStorage.idUsuario);
    }
    if (localStorage.tipoCaminho) {
      this.tipoCaminho = localStorage.tipoCaminho;
    }
    this.retornaParametroTrocaOleo();
  },
};
</script>

<style scoped>
.v-select__selection--comma {
  font-size: 14px;
}
</style>
