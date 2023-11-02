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
        @click="alteraMarca"
      >Sim</v-btn>
    </template>

    <v-card>
      <v-card-title>
        <h4 v-if="Number(id) == 0">Nova Marca</h4>
        <h4 v-else>Código: {{ id }}</h4>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-row>
            <v-text-field
              label="Descricao da marca"
              v-model="descricao"
              prepend-icon="edit"
              :maxlength="50"
              @focus="avisoErro = ''"
            ></v-text-field>
          </v-row>

          <v-spacer></v-spacer>

          <div v-show="!avisoErro == '' ">
            <v-row justify="center" class="mt-2">
              <v-alert dense outlined border="bottom" type="error">
                <pre>{{ avisoErro }}</pre>
              </v-alert>
            </v-row>
          </div>

          <v-row>
            <v-col align="center" justify="justify-center">
              <v-btn x-small class="primary mx-0" @click="validaCampos" :loading="loading">Gravar</v-btn>
              <v-btn x-small class="primary mx-0 ml-5" @click="sair">Sair</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script>
import axios from "axios";
import cripto from "../../lib/cripto";
import caminhoAPI from "../../config/configAPI";

export default {
  data() {
    return {
      loading: false,
      dialog: false,
      avisoErro: "",
      tipoCaminho: 0,
      descricao: ""
    };
  },
  props: {
    id: Number
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
      if (this.descricao == "" || this.descricao == null) {
        this.avisoErro = "É necessário informar a descrição da marca!";
        return;
      }

      if (this.$refs.form.validate()) {
        this.loading = true;
        this.insereVeiculoMarca();
      }
    },
    async insereVeiculoMarca() {
      try {
        const token = cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const dados = {
          id: this.id,
          descricao: this.descricao
        };

        await autorizaAxios
          .post("insereVeiculoMarca", dados)
          .then(res => {
            //this.loading = false;
            //this.dialog = false;
            if (res.data.name != "error") {
              this.loading = false;
              this.dialog = false;
              this.$emit("marcaAdicionado");
              this.$emit("marcaAtualiza");
              this.limpaCampos();
            } else {
              this.avisoErro =
                "Não foi possível gravar a marca, \n tente mais tarde!";
            }
          })
          .catch(e => {
            console.log(e.error);
          });
      } catch (error) {
        this.avisoErro =
          "Não foi possível gravar a marca, \n tente mais tarde!";
        console.log("Erro no insereVeiculoMarca - " + error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(data) {
      if (!data) return null;

      const [year, month, day] = data.split("-");
      return `${day}/${month}/${year}`;
    },
    alteraMarca() {
      this.dialog = true;
      this.$emit("alteraMarca");
    },
    async retornaVeiculoMarca() {
      try {
        this.avisoErro = "";
        this.loading = true;

        const dados = {
          id: this.id
        };

        const token = cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        await autorizaAxios.post("retornaVeiculoMarca", dados).then(res => {
          if (!res.data.length == 0) {
            if (Number(this.id) > 0) {
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
    }
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.data);
    }
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
            this.retornaVeiculoMarca();
          }
        }
      }
    }
  }
};
</script>

<style>
.v-menu__content {
  box-shadow: none !important;
}
</style>


