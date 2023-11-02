<template>
  <div class="minhaconta">
    <h3 class="subheading grey--text mt-2">Minha Conta</h3>

    <v-container class="my-5">
      <v-snackbar
        v-model="snackbarAviso"
        :timeout="10000"
        absolute
        centered
        top
        elevation="24"
        color="red darken-4 accent-4"
      >
        <span class="caption font-weight-black orange--text">{{ aviso }}</span>
        <v-btn class="ml-3" x-small color="black" @click="snackbarAviso = false">Fechar</v-btn>
        <v-row>
          <v-col cols="6">
            <div class="caption white--text">Nome</div>
          </v-col>
          <v-col cols="6">
            <div class="caption white--text">Validade</div>
          </v-col>
        </v-row>
        <v-row v-for="(item) in lstHabilitacao" :key="item.id">
          <v-flex xs6 sm6 md6>
            <div class="caption grey lighten-5 black--text">{{ item.nome }}</div>
          </v-flex>
          <v-flex xs6 sm6 md6>
            <div
              class="caption grey lighten-5 black--text"
            >{{ formatDate(item.validadehabilitacao) }}</div>
          </v-flex>
        </v-row>
      </v-snackbar>

      <v-layout row wrap>
        <v-row class="mt-n6" v-show="tipoPessoa == 'J'">
          <v-col cols="12">
            <v-text-field-cnpj
              v-model="cnpj"
              v-bind:label="labelCnpj"
              v-bind:properties="{
                disabled: false,
                readonly: true,
                outlined: true,
                clearable: false,
                placeholder: '',
              }"
              v-bind:options="{
                outputMask: '##############',
                empty: null,
                applyAfter: false,
              }"
              v-bind:focus="focus"
              v-on:focus="focus = false"
            />
          </v-col>
          <v-col class="mt-n6" cols="12">
            <v-text-field-simplemask
              v-model="ie"
              v-bind:label="labelIe"
              v-bind:properties="{
                readonly: true,
                disabled: false,
                outlined: true,
                clearable: false,
                placeholder: '',
              }"
              v-bind:options="{
                inputMask: '############',
                outputMask: '############',
                empty: null,
                applyAfter: false,
                alphanumeric: true,
              }"
              v-bind:focus="focus"
              v-on:focus="focus = false"
            />
          </v-col>
        </v-row>

        <v-row class="mt-n6" v-show="tipoPessoa == 'F'">
          <v-col cols="6">
            <v-text-field-cpf
              v-model="cpf"
              v-bind:label="labelCpf"
              v-bind:properties="{
                disabled: false,
                readonly: true,
                outlined: true,
                clearable: false,
                placeholder: '',
              }"
              v-bind:options="{
                outputMask: '###########',
                empty: null,
                applyAfter: false,
              }"
              v-bind:focus="focus"
              v-on:focus="focus = false"
            />
          </v-col>
          <v-col class="mt-n6" cols="6">
            <v-text-field-simplemask
              v-model="rg"
              v-bind:label="labelRg"
              v-bind:properties="{
                readonly: true,
                disabled: false,
                outlined: true,
                clearable: false,
                placeholder: '',
              }"
              v-bind:options="{
                inputMask: '##################',
                outputMask: '##################',
                empty: null,
                applyAfter: false,
                alphanumeric: true,
                lowerCase: false,
              }"
              v-bind:focus="focus"
              v-on:focus="focus = false"
            />
          </v-col>
        </v-row>

        <v-flex xs8 sm6 md6 lg5 class="ml-2"></v-flex>

        <v-flex xs8 sm6 md6 lg5 class="ml-2 mt-n6">
          <v-text-field
            class="caption"
            v-model="razaoSocial"
            v-bind:label="labelRazao"
            regular
            readonly
          ></v-text-field>
        </v-flex>

        <v-flex xs8 sm6 md6 lg5 class="ml-2 mt-n6">
          <v-text-field
            class="caption"
            v-model="nomeFantasia"
            v-bind:label="labelNome"
            regular
            readonly
          ></v-text-field>
        </v-flex>

        <v-flex xs8 sm6 md4 lg5 class="ml-2 mt-n6">
          <v-text-field class="caption" v-model="endereco" label="Endereço" regular readonly></v-text-field>
        </v-flex>

        <v-flex xs8 sm6 md4 lg2 class="ml-2 mt-n6">
          <v-text-field class="caption" v-model="numero" label="Número" regular readonly></v-text-field>
        </v-flex>

        <v-flex xs8 sm6 md4 lg3 class="ml-2 mt-n6">
          <v-text-field class="caption" v-model="bairro" label="Bairro" regular readonly></v-text-field>
        </v-flex>

        <v-flex xs8 sm6 md4 lg3 class="ml-2 mt-n6">
          <v-text-field class="caption" v-model="cep" label="Cep" regular readonly></v-text-field>
        </v-flex>

        <v-flex xs8 sm6 md4 lg5 class="ml-2 mt-n6">
          <v-text-field class="caption" v-model="cidade" label="Cidade" regular readonly></v-text-field>
        </v-flex>

        <v-flex xs8 sm6 md1 lg2 class="ml-2 mt-n6">
          <v-text-field class="caption" v-model="estado" label="Estado" regular readonly></v-text-field>
        </v-flex>

        <v-flex xs8 sm6 md1 lg3 class="ml-2 mt-n6">
          <v-text-field class="caption" v-model="telefone1" label="Telefone1" regular readonly></v-text-field>
        </v-flex>

        <v-flex xs8 sm6 md1 lg3 class="ml-2 mt-n6">
          <v-text-field class="caption" v-model="telefone2" label="Telefone2" regular readonly></v-text-field>
        </v-flex>

        <v-flex xs8 sm6 md1 lg3 class="ml-2 mt-n6">
          <v-text-field class="caption" v-model="email" label="E-mail de cobrança" regular readonly></v-text-field>
        </v-flex>

        <div v-show="!avisoErro == ''">
          <v-row justify="center" class="mt-2">
            <v-alert dense outlined type="error">
              <pre>{{ avisoErro }}</pre>
            </v-alert>
          </v-row>
        </div>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Cripto from "../lib/cripto";
import axios from "axios";
import caminhoAPI from "../config/configAPI";
import funcoes from "../lib/funcoes";

export default {
  data() {
    return {
      avisoErro: "",
      snackbarAviso: false,
      aviso:
        "Atenção evite multas, mantenha as CNHs de seus colaboradores em dia!",
      idCliente: 0,
      tipoPessoa: "",
      matricula: 0,
      labelMatricula: "Matrícula",
      razaoSocial: "",
      nomeFantasia: "",
      labelRazao: "",
      labelNome: "",
      cnpj: "",
      labelCnpj: "CNPJ",
      ie: "",
      labelIe: "Insc. Estadual",
      cpf: "",
      labelCpf: "CPF",
      rg: "",
      labelRg: "RG",
      endereco: "",
      numero: "",
      bairro: "",
      cep: "",
      cidade: "",
      estado: "",
      tipoTelefone1: "",
      telefone1: "",
      tipoTelefone2: "",
      telefone2: "",
      email: "",
      tipoCaminho: 0,
      focus: false,
      lstHabilitacao: []
    };
  },
  methods: {
    formatDate(data) {
      if (!data) return null;
      const [ano, mes] = data.split("-");
      const [dataString] = data.split("T");
      const dia = dataString.slice(-2);
      return `${dia}/${mes}/${ano}`;
    },
    selecionaTipo() {
      if (this.tipoPessoa == "J") {
        this.labelRazao = "Razão social";
        this.labelNome = "Nome fantasia";
      } else {
        this.labelRazao = "Nome";
        this.labelNome = "Apelido";
      }
    },
    async retornaCliente() {
      try {
        this.avisoErro = "";

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

        await autorizaAxios.post("retornaClienteAltera", dados).then(res => {
          if (!res.data.length == 0) {
            this.tipoPessoa = res.data[0].tipopessoa;
            if (res.data[0].tipopessoa == "J") {
              this.cnpj = funcoes.isNull(res.data[0].cnpjcnpf);
              this.ie = funcoes.isNull(res.data[0].inscrg);

              if (this.ie == "") {
                this.ie = "ISENTO";
              }
            } else {
              this.cpf = funcoes.isNull(res.data[0].cnpjcnpf);
              this.rg = funcoes.isNull(res.data[0].inscrg);
            }
            this.razaoSocial = res.data[0].nome;
            this.nomeFantasia = funcoes.isNull(res.data[0].nomefantasia);
            this.endereco = res.data[0].endereco;
            this.numero = res.data[0].numero;
            this.bairro = res.data[0].bairro;
            this.cep = res.data[0].cep;
            this.cidade = res.data[0].cidade;
            this.estado = res.data[0].estado;
            this.telefone1 = res.data[0].telefone1;
            this.telefone2 = res.data[0].telefone2;
            this.email = funcoes.isNull(res.data[0].email).toLowerCase();
            this.selecionaTipo();
          }
        });
      } catch (error) {
        this.avisoErro = error;
      }
    },
    async retornaListaHabilitacaoVencida() {
      try {
        this.avisoErro = "";

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

        await autorizaAxios
          .post("retornaListaHabilitacaoVencida", dados)
          .then(res => {
            if (!res.data.length == 0) {
              this.lstHabilitacao = res.data;
              this.snackbarAviso = true;
            }
          });
      } catch (error) {
        this.avisoErro = error;
      }
    }
  },
  created() {
    setTimeout(() => {
      //if (sessionStorage.nomeCliente) {
      //  this.nomeCliente = Cripto.decrypt(sessionStorage.nomeCliente);
      //}

      if (sessionStorage.idCliente) {
        this.idCliente = Cripto.decrypt(sessionStorage.idCliente);
      }

      if (localStorage.tipoCaminho) {
        this.tipoCaminho = localStorage.tipoCaminho;
      }

      this.retornaCliente().then(() => {
        this.retornaListaHabilitacaoVencida();
      });
    }, 500);
  },
  mounted() {}
};
</script>

<style scoped>
#habilitacao {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 8px;
  font-style: normal;
}
</style>
