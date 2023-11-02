<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-snackbar
      v-model="snackbarAviso"
      :timeout="8000"
      absolute
      centered
      color="deep-purple accent-4"
    >
      <span class="caption font-weight-bold">{{ aviso }}</span>
      <v-btn small color="black" @click="snackbarAviso = false">Fechar</v-btn>
    </v-snackbar>

    <v-card>
      <v-layout column align-center>
        <v-flex class="mt-5">
          <v-img max-height="119" max-width="300">
            <img src="logo.png" />
          </v-img>
        </v-flex>
        <v-flex class="hidden-sm-and-up">
          <v-row>
            <v-col>
              <v-btn class="mx-1" color="primary" small @click="recarregarAPP">
                <v-icon small>sync</v-icon>Recarregar
              </v-btn>
            </v-col>
          </v-row>
        </v-flex>
      </v-layout>

      <v-card-title class="ml-3">
        <v-row class="mb-4" justify="center">
          <h4>Login de Acesso</h4>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field
            label="E-mail:"
            v-model="email"
            @keyup.enter="$refs.senha.focus"
            prepend-icon="mdi-account-circle"
            @focus="avisoErro = ''"
          />
          <v-text-field
            label="Senha:"
            v-model="senha"
            ref="senha"
            @keyup.enter="acessoUsuario"
            @focus="avisoErro = ''"
            :type="mostraSenha ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            :append-icon="mostraSenha ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="mostraSenha = !mostraSenha"
          />

          <v-row class="mb-4" justify="end">
            <v-checkbox
              color="sucess"
              class="mx-0 ml-10"
              v-model="chkGravaCookies"
              :label="`Grava usuário e senha`"
            ></v-checkbox>
          </v-row>

          <v-divider></v-divider>

          <div v-show="!avisoErro == ''">
            <v-row justify="center" class="mt-2">
              <v-alert dense outlined type="error">
                <pre>{{ avisoErro }}</pre>
              </v-alert>
            </v-row>
          </div>

          <v-card-actions>
            <v-row justify="center">
              <v-btn small class="primary mx-0" @click="retornaServidorRota" :loading="loading">Acessar</v-btn>
            </v-row>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>

  </v-dialog>
</template>

<script>
import axios from "axios";
import Cripto from "../lib/cripto";
import caminhoAPI from "../config/configAPI";
import funcoes from "../lib/funcoes";

export default {
  data() {
    return {
      snackbarAviso: false,
      aviso: "",
      mostraSenha: false,
      chkGravaCookies: false,
      dialog: true,
      email: "",
      senha: "",
      avisoErro: "",
      loading: false,
      tipoCaminho: 0,
      idCliente: 0,
      versao: "1.83",
      versaoNavegadorCliente: "1.9",
      provedorGeocodificacao: "",
    };
  },
  methods: {
    recarregarAPP() {
      window.location.reload(true);
    },
    recarregar() {
      if (this.versaoNavegadorCliente != this.versao) {
        this.aviso =
          "Versão sendo atualizada para: " + this.versao + "\n aguarde!";
        //this.aviso =
        //"A ACM Tracker deseja um Feliz ano Novo," +
        //"e sucesso em nossa nova plataforma!";
        this.snackbarAviso = true;

        setTimeout(() => {
          localStorage.versaoNavegadorCliente = this.versao;
          window.location.reload(true);
        }, 4000);
      }
    },
    async retornaServidorRota() {
      try {
        this.avisoErro = "";

        const dados = {
           email: this.email.trim(),
           idCliente: 0,
        };

        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
        });

        await autorizaAxios.post("retornaServidorRota", dados).then(res => {
          if (res.data != null) {
            if (res.data > 0)
            {
              this.tipoCaminho = res.data
            }
            localStorage.tipoCaminho = this.tipoCaminho;
            this.acessoUsuario()
          }
        });
      } catch (error) {
        this.avisoErro = error;
      }
    },
    async acessoUsuario() {
      try {
        this.avisoErro = "";

        const dados = {
          email: this.email.trim(),
          senha: this.senha
        };

        const header = { headers: { "Content-Type": "application/json" } };
        let emailRetorno = "";
        let senhaRetorno = "";
        let idCliente = 0;
        let idUsuario = 0;
        let nomeAcesso = "";
        let token = "";
        let tipoUsuario = "";
        let visualizaOcorrencias = false;
        await axios
          .post(
            caminhoAPI(this.tipoCaminho) + "retornaAcessoUsuario",
            dados,
            header
          )
          .then(res => {
            if (res.data.results.rows.length != 0) {
              emailRetorno = res.data.results.rows[0].nomeacesso;
              senhaRetorno = res.data.results.rows[0].senha;
              idCliente = res.data.results.rows[0].idcliente;
              idUsuario = res.data.results.rows[0].id;
              nomeAcesso = res.data.results.rows[0].nomeacesso;
              token = res.data.token;
              tipoUsuario = res.data.results.rows[0].tipousuario;
              visualizaOcorrencias = res.data.results.rows[0].visualizaocorrencias;
              this.idCliente = idCliente;
            } else {
              console.log("Usuário ou senha não localizado!");
              this.avisoErro = "Usuário ou senha não localizado!";
            }
          });

        let senhaCodec = "";
        
        if (this.email.trim().toUpperCase() != "MASTER@ACMTRACKER.COM.BR") {
          senhaCodec = funcoes.converteTextoToHex(
            this.email.trim().toUpperCase() + "PWD:" + this.senha
          );
        }

        if (
          (this.email.trim().toUpperCase() == emailRetorno) &
          (senhaCodec == senhaRetorno)
        ) {
          this.dialog = false;
          sessionStorage.idCliente = Cripto.encrypt(idCliente.toString());
          sessionStorage.idUsuario = Cripto.encrypt(idUsuario.toString());
          sessionStorage.nomeUsuario = Cripto.encrypt(nomeAcesso);
          sessionStorage.email = Cripto.encrypt(this.email.trim());
          sessionStorage.tipoUsuario = Cripto.encrypt(tipoUsuario.toString());
          sessionStorage.token = Cripto.encrypt(token);
          sessionStorage.visualizaOcorrencias = Cripto.encrypt(visualizaOcorrencias.toString());
          this.retornaCliente();

          if (this.chkGravaCookies) {
            localStorage.email = Cripto.encrypt(this.email.trim());
            localStorage.senha = Cripto.encrypt(this.senha);
          } else {
            localStorage.removeItem("email");
            localStorage.removeItem("senha");
          }



            this.retornaClienteConfig().then( ()=> {
                sessionStorage.provedorGeocodificacao = Cripto.encrypt(this.provedorGeocodificacao);
              })
            this.avisoErro = "";
            this.$destroy();
            this.$router.push("/minhaconta");

        } else {
          this.avisoErro = "Usuário ou senha inválido!";
        }
      } catch (error) {
        this.avisoErro = "Não foi possível acessar o usuário!";
        //console.log("Erro no acessoUsuario - " + error);
      }
    },
    redefinirSenha() {},
    toUpper() {
      this.email = this.email.toUpperCase();
      this.senha = this.senha.toUpperCase();
    },
    async retornaClienteConfig() {
            try {
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

                await autorizaAxios.post("retornaClienteConfig", dados).then(res => {
                if (!res.data.length == 0) {
                    this.provedorGeocodificacao = res.data[0].provedorgeocodificacao;
                }
            });
            } catch (error) {
                this.aviso = 'Não foi possível retornar o cliente';
                this.snackbarErro = true;
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

        await autorizaAxios.post("retornaCliente", dados).then(res => {
          if (!res.data.length == 0) {
            sessionStorage.nomeCliente = Cripto.encrypt(res.data[0].nome);
          }
        });
      } catch (error) {
        this.avisoErro = error;
      }
    }
  },
  mounted() {
    if (localStorage.versaoNavegadorCliente) {
      this.versaoNavegadorCliente = localStorage.versaoNavegadorCliente;
      this.recarregar();
    } else {
      this.aviso =
        "Versão sendo atualizada para: " + this.versao + "\n aguarde!";
      this.snackbarAviso = true;

      setTimeout(() => {
        localStorage.versaoNavegadorCliente = this.versao;
        window.location.reload(true);
      }, 5000);
    }

    if (localStorage.email) {
      this.email = Cripto.decrypt(localStorage.email);
      this.senha = Cripto.decrypt(localStorage.senha);
      this.chkGravaCookies = true;
    }
    
    if (localStorage.tipoCaminho) {
      this.tipoCaminho = localStorage.tipoCaminho;
    } else {
      this.tipoCaminho = 5;
      localStorage.tipoCaminho = 5;
    }

  }
};
</script>

<style scoped></style>
