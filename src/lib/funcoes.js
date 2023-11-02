    const convert = require('amrhextotext');

    function retornaDiaSemana(data, formato) {
        
        if (data.length > 10)
        {
            data = data.substring(0,10)
        }
 
        if (data.length == 10)
        {
            data = data + " 00:00:00" 
        }

        const data1 = new Date(data);
        let diaSemana = data1.getDay();
        let nomeSemana = "";

        if (formato === "AMDhms" | formato === "AMD") {
                if (diaSemana == 0)
                {
                    nomeSemana = "DOM";

                } else if (diaSemana == 1)
                {
                    nomeSemana = "SEG";
                } else if (diaSemana == 2)
                {
                    nomeSemana = "TER";
                }else if (diaSemana == 3)
                {
                    nomeSemana = "QUA";
                }else if (diaSemana == 4)
                {
                    nomeSemana = "QUI";
                }else if (diaSemana == 5)
                {
                    nomeSemana = "SEX";
                }else if (diaSemana == 6)
                {
                    nomeSemana = "SAB";
                }
        }

        return nomeSemana;
    }

    function formataZeroEsquerda(valor) {
        return (valor >= 10 ? valor : '0' + valor);
    }

    function converteTextoToHex(texto){
        //convert text to hex
        let hexaSample = convert.textToHex(texto);
        return hexaSample;
    }

    function converteHexToTexto(hexa)
    {
        //Convert hex to text
        let textoSample = convert.hexToUtf8(hexa);
        return textoSample;
    }

    

    function formataTexto(texto, tamanhoTexto, caracterTexto, posicaoAlinhamento){
        if (Number(tamanhoTexto) > texto.toString().length)
		{
			let tamanho = Number(tamanhoTexto) - texto.toString().length;  
			let caracter = caracterTexto;  
			let variavel1 = "";
			let variavel2 = "";
			for (let i = 0; i < tamanho; i++) {  
				if (posicaoAlinhamento == "E")
				{
					texto += caracter;	
				}
				else
				{
					variavel1 += caracter;
				}
			}
			if (posicaoAlinhamento == "D")
			{
				variavel2 = variavel1+texto;
				texto = variavel2;
			}
		}
		
		return texto;
    }

    function retornaDataHoraAtual(formato, dataLocal) {
        //const data1 = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
        //const data = new Date(data1);
        let data = new Date();
        if (dataLocal !== "")
        {
            data = new Date(dataLocal.replace(/-/g, "/"));
        }
        const dia = formataZeroEsquerda(data.getDate());
        let mes = formataZeroEsquerda(data.getMonth() + 1);
        const ano = data.getFullYear();
        const hor = formataZeroEsquerda(data.getHours());
        const min = formataZeroEsquerda(data.getMinutes());
        const seg = formataZeroEsquerda(data.getSeconds());

        let dataString = "";
    
        if (formato === "AMDhms")
        {
            dataString = `${ano}-${mes}-${dia} ${hor}:${min}:${seg}`;
        }

        if (formato === "DMAhms")
        {
            dataString = `${dia}/${mes}/${ano} ${hor}:${min}:${seg}`;
        }

        if (formato === "AMD")
        {
            dataString = `${ano}-${mes}-${dia}`;
        }

        if (formato === "DMA") {
            dataString = `${dia}${mes}${ano}`;
        }

        if (formato === "D/M/A") {
            dataString = `${dia}/${mes}/${ano}`;
        }

        if (formato === "A-M-D") {
            dataString = `${ano}-${mes}-${dia}`;
        }

        if (formato === "DM") {
            dataString = `${dia}${mes}`;
        }

        return dataString;
    }
    
    function formatDate(data) {
        if (!data) return null;
           const [ano, mes] = data.split("-");
           const [dataString] = data.split("T");
           const hora = data.substring(11, 19);
           const dia = dataString.slice(-2);
           const diaSemana = retornaDiaSemana(data, "AMDhms");
           return `${dia}/${mes}/${ano} - ${diaSemana} - ${hora}`;
    }

    function formatDate1(data) {
        if (!data) return null;
           const [ano, mes] = data.split("-");
           const [dataString] = data.split("T");
           const dia = dataString.slice(-2);
           return `${dia}/${mes}/${ano}`;
    }

    function retornaEstados() {
        let estado = [];
        estado.push("AC");
        estado.push("AL");
        estado.push("AM");
        estado.push("AP");
        estado.push("BA");
        estado.push("CE");
        estado.push("DF");
        estado.push("ES");
        estado.push("FN");
        estado.push("GO");
        estado.push("MA");
        estado.push("MG");
        estado.push("MS");
        estado.push("MT");
        estado.push("PA");
        estado.push("PB");
        estado.push("PE");
        estado.push("PI");
        estado.push("PR");
        estado.push("RJ");
        estado.push("RN");
        estado.push("RO");
        estado.push("RR");
        estado.push("RS");
        estado.push("SC");
        estado.push("SE");
        estado.push("SP");
        estado.push("TO");
        return estado;
    }

    function isNull(value)
    {
        return value == null ? "" : value
    }

    function retornaStatusRastreador(value, tipo)
    {
        let retorno = ""
        if (tipo == "LIGADO")
        {
            if (value == true)
            {
                retorno = "LIGADO"
            }
            else
            {
                retorno = "DESLIGADO"
            }
        }

        if (tipo == "BLOQUEIO")
        {
            if (value == true)
            {
                retorno = "BLOQUEADO"
            }
            else
            {
                retorno = "DESBLOQUEADO"
            }
        }

        if (tipo == "ALIMENTAÇÃO")
        {
            if (value == true)
            {
                retorno = "SEM ALIMENTAÇÃO"
            }
            else
            {
                retorno = "COM ALIMENTAÇÃO"
            }
        }

        return retorno;
    }

    function formatDate2(data) {
        if (!data) return null;
           const [ano, mes] = data.split("-");
           const [dataString] = data.split("T");
           const dia = dataString.slice(-2);
           const hora = data.substring(11, 19);
           return `${dia}/${mes}/${ano} ${hora}`;
    }

    function formatHour(data){
        //console.log(data)
        //console.log(data.substring(11, 19))
        const hora = data.substring(11, 19);
        return hora;
    }

    function converteMilesegundosTempo(milesegundos)
    {
        let horario = new Date(milesegundos);
        return horario.toLocaleTimeString();
    }

    function comparaDataFinal(dataInicial, dataFinal)
    {
        let retorno = false;
        let dataI = new Date(dataInicial); 
        let dataF = new Date(dataFinal); 

        if (dataF.getTime() < dataI.getTime()) 
        {
            retorno = true;
        }

        return retorno;
    }

    function toHexString(informacaoChave)
    {
        const hex = (Number(informacaoChave)).toString(16).toUpperCase();
        return hex;
    }

    function retornaListaContador(quantidade)
    {
        const array = [];
        for (let i = 0; i <= quantidade; i++)
        {
            array.push(formataZeroEsquerda(i).toString())
        }

        return array;
    }

    function retornaListaMes()
    {
        const mes = [];
        mes.push('01-Janeiro');
        mes.push('02-Fevereiro');
        mes.push('03-Março');
        mes.push('04-Abril');
        mes.push('05-Maio');
        mes.push('06-Junho');
        mes.push('07-Julho');
        mes.push('08-Agosto');
        mes.push('09-Setembro');
        mes.push('10-Outubro');
        mes.push('11-Novembro');
        mes.push('12-Dezembro');
        return mes;
    }

    function retornaListaAno(numero)
    {
        let data = new Date();
        const ano = data.getFullYear();
        const listaAno = [];

        if (Number(numero) > 0)
        {
            listaAno.push(Number(ano) + 1);
            for (let i = 0; i < numero; i++) {  
                listaAno.push(Number(ano) - i);
            }
        }
        else
        {
            listaAno.push(Number(ano));
        }
        
        return listaAno;
    }

    function replaceTo(mensagem, de, para)
    {
        let novaMensagem = mensagem.replace(de, para);
        return novaMensagem;
    }

    function limpaMascaraTelefone(mensagem)
    {
        let novaMensagem = mensagem.replace('(', '');
        novaMensagem = novaMensagem.replace(')', '');
        novaMensagem = novaMensagem.replace('-', '');
        return novaMensagem;
    }

    function retornaDiasNoMes(mes, ano) {
        var data = new Date(ano, mes, 0);
        return data.getDate();
    }
    
    function retornaUltimoDiaDoMes(mes, ano)    
    {
        mes = Number(mes) - 1; //os meses em javascript comecam a serem contados a partir de zero(janeiro)
        let ultimoDia = (new Date(ano, mes + 1, 0 )).getDate();
        return ultimoDia;
    }
   
    /*
    function comparaTempo(tempo1, tempo2)
    {
    var str1 = '10:20:45';
    var str2 = '5:10:10';

    str1 =  str1.split(':');
    str2 =  str2.split(':');

    totalSeconds1 = parseInt(str1[0] * 3600 + str1[1] * 60 + str1[0]);
    totalSeconds2 = parseInt(str2[0] * 3600 + str2[1] * 60 + str2[0]);

    // compare them

    //if (totalSeconds1 > totalSeconds2 ) { // etc...


    }
*/
    module.exports = {
        toHexString, retornaDiaSemana, formataZeroEsquerda, converteTextoToHex, converteHexToTexto, formataTexto, retornaDataHoraAtual, formatDate, retornaEstados, isNull, retornaStatusRastreador, formatHour, comparaDataFinal, formatDate1, retornaListaContador, retornaListaMes, retornaListaAno, converteMilesegundosTempo, replaceTo, retornaDiasNoMes, limpaMascaraTelefone, formatDate2, retornaUltimoDiaDoMes
    }
