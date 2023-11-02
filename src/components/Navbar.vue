<template>
  <nav>
    <v-app-bar app flat class="mx-2 mt-2 mb-4 primary lighten-1">
      <v-app-bar-nav-icon @click="abreNavegacao"></v-app-bar-nav-icon>
      <v-toolbar-title class="white--text" v-if="idCliente != 249">
        <img class="mt-3" src="logo2.png" width="108px" height="36px" />
        <p class="fonte01 white--text">Serviço de rastreamento</p>
        <p class="mt-n2 fonte01 yellow--text"> {{ nomeServidor }}</p>
        
      </v-toolbar-title>
      
      <v-spacer></v-spacer>

      <v-badge
        color="error"
        :content="qtdeMsg"
        overlap v-if="qtdeMsg != ''"
      >
       <Blink> 
       <v-btn icon large color="yellow" @click="retornaListaEmailEnviado(); dialogMsg = true">
        <v-icon right>warning</v-icon>
       </v-btn>
       </Blink>
      </v-badge>
      

      <v-btn x-small class="grey lighten-3 ml-5" @click="sair">
        <span>Sair</span>
        <v-icon small right>exit_to_app</v-icon>
      </v-btn>
          
    </v-app-bar>

    <!-- gaveta de navegação -->
    <v-navigation-drawer app v-model="drawer" class="primary mt-2">
      <v-layout column align-center>
        <v-flex>
            <v-avatar class="mt-2">
              <v-img v-if="imageAsBase64 == '' | imageAsBase64 == null" src="50x65_avatarPadrao.png" />
            </v-avatar>
            <div>            
              <v-img v-if="imageAsBase64 != '' & imageAsBase64 != null" height="60" width="200" class="grey lighten-3 mt-n10" :src="`data:image/png;base64,${imageAsBase64}`"  />
            </div>

        </v-flex>

        <v-flex class="mt-1">
          <p class="white--text text-center" id="usuario">{{ nomeUsuario }}</p>
          <div class="white--text text-center" id="versao">Versão: {{ versao }}</div>
        </v-flex>
      </v-layout>

      <v-divider></v-divider>


      <v-list>
        
        <v-list-item-group color="primary">
          <v-list-item router :to="`/minhaconta`">
            <v-list-item-icon>
              <v-icon class="white--text pl-4">account_box</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text">Minha Conta</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          
          <v-list-item router :to="`/painelregrasgratificacoes`">
            <v-list-item-content>
              <v-list-item-title class="yellow--text ml-16">Regras de Gratificações</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list-item-group>

       

        <!-- MENU AJUDA -->
        <v-list-group :value="false">
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon class="white--text">info</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="white--text">AJUDA</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item href="http://acmtracker.com.br/manuais/manual basico.pdf" target="_blank">
            <v-list-item-content>
              <v-list-item-title class="yellow--text ml-16">Manual Básico</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            href="http://acmtracker.com.br/manuais/perguntas frequentes.pdf"
            target="_blank"
          >
            <v-list-item-content>
              <v-list-item-title class="yellow--text ml-16">Perguntas frequentes</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>


        <v-list-item-group color="primary">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="white--text text-center">© ACM Tracker 2022</v-list-item-title>
              <v-list-item-title class="white--text text-center">Todos os direitos reservados</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

 <v-dialog v-model="dialogMsg" max-width="700px" persistent>
<v-flex xs12 sm12 md12>
      <v-row v-show="lstMsg.length > 0">

          <v-data-table 
            :headers="headers"
            :items="lstMsg"     
            item-key="id"
            class="elevation-1"
            :items-per-page="15"
            >

          <template #item="{ item }">
              <tr>
                <td>{{ formatDate(item.datalcto) }}</td>
                <td>{{ item.placa }}</td>
                <td>{{ item.motivo }}</td>
          <td>
            <v-tooltip top color="deep-orange">
            <template v-slot:activator="{ on, attrs }">
              <v-flex xs2 sm4 md1>
                <div>
                      <v-btn
                        class="ml-2"
                        icon
                        color="deep-orange"
                        v-bind="attrs"
                        v-on="on"
                        @click="
                          dataLctoAtual = `${item.datalcto}`;
                          idDeviceAtual = `${item.iddevice}`;
                          eliminaEmailEnviado(false);
                        "
                      >
                        <v-icon small>done</v-icon>
                      </v-btn>


                </div>
              </v-flex>
            </template>
            <span>Ocorrência visualizada</span>
          </v-tooltip>
          </td>
          </tr>

          </template>
          
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title class="primary--text caption">Lista de ocorrências</v-toolbar-title>
              <v-col class="ml-10">
                 <v-dialog v-model="dialog" persistent  max-width="290">
                 <template v-slot:activator="{ on, attrs }">
                    <v-btn x-small color="primary" v-bind="attrs" v-on="on">
                      Todas Lidas
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="caption red--text">
                    Deseja marcar todas as ocorrências como lidas?
                    </v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn x-small color="primary" @click="dialog = false; eliminaEmailEnviado(true);" >
                          Sim
                      </v-btn>
                      <v-btn x-small color="primary" @click="dialog = false" >
                          Não
                      </v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>  


                  <v-btn x-small class="ml-3" color="primary" @click="dialogMsg = false">Fechar</v-btn>
              </v-col>
            </v-toolbar>
          </template>
    </v-data-table>

    </v-row>
</v-flex>
</v-dialog>

</nav>
  
</template>

<script>
import Cripto from "../lib/cripto";
import axios from "axios";
import caminhoAPI from "../config/configAPI";
import funcoes from "../lib/funcoes";
import Blink from 'vue-blink'

export default {
  data() {
    return {
      loading1: false,
      dialogMsg: false,
      dialog: false,
      drawer: false,
      menus: [],
      menuPrincipal: [],
      subMenu1: [],
      menuOpcao: [],
      snackbar: false,
      nomeUsuario: "",
      nomeCliente: "",
      item: "",
      tipoCaminho: 0,
      idCliente: 0,
      idUsuario: 0,
      email: "",
      idMenu: 0,
      tipoUsuario: "",
      visualizaOcorrencias: false,
      versao: "",
      menuCarregado: false,
      qtdeMsg: '',
      lstMsg: [],
      headers: [
          { text: 'Data', sortable: false},
          { text: 'Placa', sortable: false},
          { text: 'Motivo', sortable: false},
        ],
      dataLctoAtual: "",
      idDeviceAtual: "",
      provedorGeocodificacao: "",
      imageAsBase64: "",
      nomeServidor: "",
    };
  },
  components: {
      Blink
  },
  methods: {
    formatDate(data) {
      if (!data) return null;
      const [ano, mes] = data.split("-");
      const [dataString] = data.split("T");
      const dia = dataString.slice(-2);
      const diaSemana = funcoes.retornaDiaSemana(data, "AMDhms");
      const hora = data.substring(11, 19);
      return `${dia}/${mes}/${ano} ${hora} - ${diaSemana}`;
    },
    conta(){
      let today = new Date();
      let milliseconds = today.getMilliseconds();
      //console.log(milliseconds)
      return milliseconds;
    },
    sair() {
      this.drawer = false;
      this.menuCarregado = false;
      this.qtdeMsg = "";
      this.menus = [];
      this.menuPrincipal = [];
      this.subMenu1 = [];
      this.menuOpcao = [];
      this.lstMsg = [];
      this.nomeServidor = "";
      sessionStorage.removeItem("idCliente");
      sessionStorage.removeItem("idUsuario");
      sessionStorage.removeItem("nomeUsuario");
      sessionStorage.removeItem("tipoUsuario");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("nomeCliente");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("provedorGeocodificacao");
      sessionStorage.removeItem("visualizaOcorrencias");
      this.$router.push("/");
    },
    minimiza() {
      this.drawer = !this.drawer;
    },
    abreNavegacao() {
      this.nomeUsuario = Cripto.decrypt(sessionStorage.nomeUsuario);
      this.drawer = !this.drawer;

      if (sessionStorage.nomeCliente) {
        this.nomeCliente = Cripto.decrypt(sessionStorage.nomeCliente);
      }

      if (localStorage.versaoNavegadorCliente) {
        this.versao = localStorage.versaoNavegadorCliente;
      }

      if (sessionStorage.idCliente) {
        this.idCliente = Cripto.decrypt(sessionStorage.idCliente);
      }

      if (sessionStorage.idUsuario) {
        this.idUsuario = Cripto.decrypt(sessionStorage.idUsuario);
      }

      if (sessionStorage.tipoUsuario) {
        this.tipoUsuario = Cripto.decrypt(sessionStorage.tipoUsuario);
      }

      if (localStorage.tipoCaminho) {
        this.tipoCaminho = localStorage.tipoCaminho;
      }

      if (sessionStorage.provedorGeocodificacao) {
        this.provedorGeocodificacao = Cripto.decrypt(sessionStorage.provedorGeocodificacao);
      }

      if (sessionStorage.email) {
        this.email = Cripto.decrypt(sessionStorage.email).toUpperCase();
      }

      if (sessionStorage.visualizaOcorrencias) {
        this.visualizaOcorrencias = Cripto.decrypt(sessionStorage.visualizaOcorrencias);
      }

      if (this.menuCarregado == false)
      {
        this.retornaLogomarca().then( ()=> {
          this.retornaMenuSistema().then(() =>
          {
            if (this.visualizaOcorrencias == "true")
            {
              this.retornaListaEmailEnviado();
            }
          })
        })
      }
    },
    async retornaMenuPrincipal() {
      try {
        const token = Cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const dados = {
          idCliente: this.idCliente,
          idUsuario: this.idUsuario,
          tipoUsuario: this.tipoUsuario
        };

        await autorizaAxios.post("retornaMenuPrincipal", dados).then(res => {
          if (!res.data.length == 0) {
            this.menuPrincipal = res.data;
          } else {
            console.log("Não foi possível localizar menu!");
          }
        });
      } catch (error) {
        console.log("Erro no retornaMenuAcesso - " + error);
      }
    },
    async retornaSubMenu1() {
      try {
        const token = Cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const dados = {
          idCliente: this.idCliente,
          idUsuario: this.idUsuario,
          tipoUsuario: this.tipoUsuario
        };

        await autorizaAxios.post("retornaSubMenu1", dados).then(res => {
          if (!res.data.length == 0) {
            this.subMenu1 = res.data;
          } else {
            console.log("Não foi possível localizar menu!");
          }
        });
      } catch (error) {
        console.log("Erro no retornaMenuAcesso - " + error);
      }
    },
    async retornaMenuOpcao() {
      try {
        const token = Cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const dados = {
          idCliente: this.idCliente,
          idUsuario: this.idUsuario,
          tipoUsuario: this.tipoUsuario
        };

        await autorizaAxios.post("retornaMenuOpcao", dados).then(res => {
          if (!res.data.length == 0) {
            this.menuOpcao = res.data;
          } else {
            console.log("Não foi possível localizar menu!");
          }
        });
      } catch (error) {
        console.log("Erro no retornaMenuOpcao - " + error);
      }
    },
    async retornaMenuSistema() {
      try {
        const token = Cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const dados = {
          idCliente: this.idCliente,
          idUsuario: this.idUsuario,
          tipoUsuario: this.tipoUsuario
        };

        await autorizaAxios.post("retornaMenuSistema", dados).then(res => {
          if (!res.data.length == 0) {
            this.menuPrincipal = res.data[0];
            this.subMenu1 = res.data[1];
            let array = []
            res.data[2].forEach(element => {
              //quando tiver provedor de geocodificacao, permite Mapa-Enderecos
              if (this.provedorGeocodificacao != null & this.provedorGeocodificacao != '')
              {
                this.menuOpcao = res.data[2];
              }
              else
              { //quando não tiver provedor de geocodificacao não permite Mapa-Enderecos
                if (element.opcao !== 'Mapa-Endereços')
                {
                  array.push(element);
                }
                this.menuOpcao = array;
              }
            });
            
            this.menuCarregado = true;

            
          } else {
            console.log("Não foi possível localizar menu!");
          }
        });
      } catch (error) {
        console.log("Erro no retornaMenuOpcao - " + error);
      }
    },
    async retornaListaEmailEnviado() {
      try {
        this.lstMsg = [];
        const token = Cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const dados = {
          idCliente: this.idCliente,
        };

        await autorizaAxios.post("retornaListaEmailEnviado", dados).then(res => {
          if (!res.data.length == 0) {
            this.qtdeMsg = res.data.length
            this.lstMsg = res.data
            this.dialogMsg = true;
          }
          else
          {
            this.qtdeMsg = ''
            this.dialogMsg = false;
          }
        });
      } catch (error) {
        console.log("Erro no retornaListaEmailEnviado - " + error);
      }
    },
    async eliminaEmailEnviado(eliminaTotal) {
      try {
        const token = Cripto.decrypt(sessionStorage.token);
        const autorizaAxios = axios.create({
          baseURL: caminhoAPI(this.tipoCaminho),
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const dados = {
          eliminaTotal: eliminaTotal,
          idCliente: this.idCliente,
          idDevice: this.idDeviceAtual,
          dataLcto: this.dataLctoAtual,
          idUsuario: this.idUsuario,
        };

        await autorizaAxios.post("eliminaEmailEnviado", dados).then(
          await this.retornaListaEmailEnviado()
        );
      } catch (error) {
        console.log("Erro no eliminaEmailEnviado - " + error);
      }
      finally {
        if (eliminaTotal)
        {
          this.dialogMsg = false;
          this.qtdeMsg = '';
        }
      }
     
    },
    async retornaLogomarca() {
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

          await autorizaAxios.post("retornaLogomarca", dados).then(res => {
          if (res.data != '') {
             this.nomeServidor = res.data.nomeservidor
             this.imageAsBase64 = res.data.logomarca;
            }
          });
      } catch (error) {
                this.aviso = 'Não foi possível retornar a logomarca';
                this.snackbarErro = true;
      }
    },
  },
  mounted() {
    
    
  },
  watch: {

  }
};
</script>

<style scoped>
.v-list-item {
  min-height: 0;
}

.v-list-item__title.yellow--text.body-2 {
  padding: 0 20px;
}
.v-list-item--link {
  padding: 0 1px;
}

.theme--light.v-divider {
  border-color: rgb(255, 255, 255) !important;
}

/*
.html {
  font-size: 14px;
}

.v-list-item__title {
  font-size: 14px;
}
*/

#usuario {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 12px;
  font-style: normal;
}

#versao {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 10px;
  font-style: normal;
}

#nomeCliente {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 10px;
  font-style: normal;
}
.v-list-item__title {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 12px;
  font-style: normal;
}

.v-list-item__content {
  font-family: "Roboto";
  font-weight: 100;
  font-size: 16px;
  font-style: normal;
  padding-bottom: 10px;
}

.v-list-item {
  font-family: "Roboto";
  font-weight: 100;
  font-size: 14px;
  font-style: normal;
}
.fonte01 {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 10px;
  font-style: normal;
  line-height: 0px;
}

.v-data-table>.v-data-table__wrapper>table>tbody>tr>td{
  font-size: 12px !important;
  color: red;
}


</style>

