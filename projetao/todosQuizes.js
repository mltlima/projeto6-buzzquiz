const url='https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes'
let gabarito=[]
let acertos=0
let niveis=[]
let idQuiz=0
let informacoes = [];
let perguntasGeradas = [];
let niveisGerados = [];
let quizzesSalvos = [];
function buscarQuizes(){
    const promessa= axios.get(url)
    promessa.then(separarListaObjetos)
}
buscarQuizes()

function separarListaObjetos(resposta){
    const lista=resposta.data
    lista.forEach((objeto)=>{printarTodosQuizes(objeto.image,objeto.title,objeto.id)})
}

function printarTodosQuizes(imagem,titulo,id){
    const listaTodos=document.querySelector('.todosQuizes ul')
    listaTodos.innerHTML+=`
    <li class="quiz" onclick="buscarQuizEspecifico('${id}')">
        <img style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${imagem})">
        <div><p>${titulo}</p></div>
    </li>
    `
}

function buscarQuizEspecifico(id){
    const promessa= axios.get(url+`/${id}`)
    promessa.then(separarObjeto)
}

function separarObjeto(resposta){
    const objeto=resposta.data
    console.log(objeto) // RETIRAR DEPOIS 
    printarQuiz(objeto.image,objeto.title,objeto.questions)
    document.querySelector('main').classList.add('some')
    document.querySelector('.quizEspecifico').classList.remove('some')
    niveis=objeto.levels
    idQuiz=objeto.id
}

function printarQuiz(imagem,titulo,perguntas){
    const quizEspecifico=document.querySelector('.quizEspecifico')
    quizEspecifico.innerHTML=`
        <div class="imagemTitulo">
            <img src="${imagem}">
            <p>${titulo}</p>
            <div class="escurecedor"></div>
        </div>
        <ul class="listaPerguntas">
        </ul>
    `
    const listaPerguntas=document.querySelector('.listaPerguntas')
    for(let k=0;k<perguntas.length;k++){
        listaPerguntas.innerHTML+=`
            <li class="divPergunta perg${k}">
                <div class="impedidorDeClique imp${k} some"></div>
                <div style="background-color:${perguntas[k].color}" class="tituloPergunta">
                    <span>${perguntas[k].title}</span>
                </div>
                <div class="respostas">
                
                </div>
            </li>
        `
        const listaRespostas=perguntas[k].answers.sort(()=>{return Math.random() - 0.5;})
        const respostas=document.querySelector(`.perg${k} .respostas`)
        for(let i=0;i<listaRespostas.length;i++){
            respostas.innerHTML+=`
                <div class="resposta perg${k}resp${i}" onclick="checarResposta(${k},${i},${listaRespostas.length})">
                    <img src="${listaRespostas[i].image}">
                    <p>${listaRespostas[i].title}</p>
                </div>
            `
            if(listaRespostas[i].isCorrectAnswer==true){
                gabarito.push(i)
            }
        }
    }
}

function checarResposta(iPergunta,iResposta,qtdRespostas){
    if(iResposta==gabarito[iPergunta]){ acertos++ }
    for(let j=0;j<qtdRespostas;j++){
        if(j!=iResposta){
            document.querySelector(`.perg${iPergunta}resp${j}`).classList.add('opacidade')
        }
        if(j!=gabarito[iPergunta]){
            document.querySelector(`.perg${iPergunta}resp${j} p`).classList.add('vermelho')
        }
        if(j==gabarito[iPergunta]){
            document.querySelector(`.perg${iPergunta}resp${j} p`).classList.add('verde')
        }
    }
    document.querySelector(`.imp${iPergunta}`).classList.remove('some')
    const proximaPergunta=document.querySelector(`.perg${iPergunta+1}`)
    const perguntaNaoRespondida=document.querySelector('.impedidorDeClique.some')
    if(proximaPergunta!=null && perguntaNaoRespondida!=null){
        setTimeout(()=>{proximaPergunta.scrollIntoView()},2000)
    }else{checarSeTodasForamRespondidas(perguntaNaoRespondida)}  
}

function checarSeTodasForamRespondidas(perguntaNaoRespondida){
    if(perguntaNaoRespondida!=null){
        perguntaNaoRespondida.scrollIntoView()
    }else{
        printarResultado()
    }
}

function printarResultado(){
    const porcentagem=Math.round(acertos*100/gabarito.length)
    let k=niveis.length-1
    while(porcentagem<parseInt(niveis[k].minValue)){k--}
    const objeto=niveis[k]
    document.querySelector('.quizEspecifico').innerHTML+=`
        <div class="divPergunta resultadoQuiz">
            <div class="tituloPergunta">
                <span>${porcentagem}% de acerto: ${objeto.title}</span>
            </div>
            <img src="${objeto.image}">
            <p>${objeto.text}</p>
        </div>
        <button onclick="reiniciarQuiz()" class="reiniciarQuiz">Reiniciar Quizz</button>
        <button onclick="voltarHome()" class="voltarHome">Voltar para home</button>
    `
    setTimeout(()=>{document.querySelector('.resultadoQuiz').scrollIntoView()},2000)
}

function reiniciarQuiz(){
    gabarito=[]
    acertos=0
    niveis=[]
    buscarQuizEspecifico(idQuiz)
    document.querySelector('.imagemTitulo').scrollIntoView()
}
function voltarHome(){
    gabarito=[]
    acertos=0
    niveis=[]
    idQuiz=0
    document.querySelector(".quizzPronto").classList.add("some");
    document.querySelector('.quizEspecifico').classList.add('some')
    document.querySelector('main').classList.remove('some')
    document.querySelector('main').scrollIntoView();
}


function paginaCriacaoQuiz() {
    //Desabilita outras classes
    document.querySelector('.todosQuizes').classList.add('some');
    document.querySelector('.nenhumQuizCriado').classList.add('some');
    document.querySelector('.meusQuizes').classList.add('some');
    //Habilita a classe de criacaoQuiz
    document.querySelector('.criacaoQuiz').classList.remove('some');
}

function criarQuiz() {
    informacoes = document.querySelectorAll(".criacaoQuiz input");
    let informacaoValida = true;

    //Valida informacoes
    informacaoValida = verificaURL(informacoes[1].value);
    
    if (informacoes[0].value.length < 20 || informacoes[0].value.length > 65) {
        informacaoValida = false;
    }
    
    
    if (informacoes[2].value < 3) {
        informacaoValida = false;
    }
    
    if (informacoes[3].value < 2) {
        informacaoValida = false;
    }

    if (!informacaoValida) {
        alert("Por favor, preencha dos dados corretamente");
        informacoes.forEach((info) => {
            info.value = "";
        })
    }else {
        criarPerguntas();
    }
}

function criarPerguntas() {
    document.querySelector(".criacaoQuiz").classList.add("some");
    const criacaoPerguntasHTML = document.querySelector(".criacaoPerguntas");
    criacaoPerguntasHTML.classList.remove("some");

    for (let i = 1; i <= informacoes[2].value; i++) {

        criacaoPerguntasHTML.querySelector(".perguntas").innerHTML += 
        `
        <section class="pergunta">
            <h1>Pergunta ${i}</h1>
            <input class="textoPergunta" type="text" placeholder="Texto da pergunta">
            <input class="corPergunta" type="text" placeholder="Cor de fundo da pergunta">
            <h1>Resposta correta</h1>
            <input class="respostaCorreta" type="text" placeholder="Resposta Correta">
            <input class="urlImagemRespostaCorreta" type="text" placeholder="URL da imagem">
            <h1>Respostas incorretas</h1>
            <input class="respostaIncorreta" type="text" placeholder="Resposta incorreta 1">
            <input class="urlImagemRespostaIncorreta" type="text" placeholder="URL da imagem 1">
            <br>
            <input class="respostaIncorreta" type="text" placeholder="Resposta incorreta 2">
            <input class="urlImagemRespostaIncorreta" type="text" placeholder="URL da imagem 2">
            <br>
            <input class="respostaIncorreta" type="text" placeholder="Resposta incorreta 3">
            <input class="urlImagemRespostaIncorreta" type="text" placeholder="URL da imagem 3">
            <br>
        </section>
        `       
    }


}

function validarPerguntas() {
    let informacaoValida = true;
    let haRespostaIncorreta = false;
    //let haUrlRespostaIncorreta = false;
    const regex = /^#(?:[0-9a-fA-F]{3}){1,2}$/

    document.querySelectorAll(".pergunta").forEach((pergunta) => {
        if (pergunta.querySelector(".textoPergunta").value.length < 20) {informacaoValida = false};
        if (!regex.test(pergunta.querySelector(".corPergunta").value)) {informacaoValida = false};
        if (pergunta.querySelector(".respostaCorreta").value == null) {informacaoValida = false};
        if (!verificaURL(pergunta.querySelector(".urlImagemRespostaCorreta").value)) {informacaoValida = false};
        
        let respostasIncorretas = pergunta.querySelectorAll(".respostaIncorreta")
        let urlRespostasIncorretas = pergunta.querySelectorAll(".urlImagemRespostaIncorreta")
        for (let i = 0; i < 3; i++) {
            if (!(respostasIncorretas[i].value == null) && verificaURL(urlRespostasIncorretas[i].value)) {
                haRespostaIncorreta = true;
            }
        }
        
        if (!haRespostaIncorreta) {informacaoValida = false};
    })

    if (!informacaoValida) {
        alert("Por favor, preencha dos dados corretamente");
    }else {
        perguntasGeradas = document.querySelectorAll(".pergunta");
        criarNiveis();
    }
}

function criarNiveis() {
    document.querySelector(".criacaoPerguntas").classList.add("some");
    const criacaoNiveisHTML = document.querySelector(".criacaoNiveis");
    criacaoNiveisHTML.classList.remove("some");

    for (let i = 1; i <= informacoes[3].value; i++) {

        criacaoNiveisHTML.querySelector(".niveis").innerHTML += 
        `
        <section class="nivel">
            <h1>Nível ${i}</h1>
            <input class="tituloNivel" type="text" placeholder="Título do nível">
            <input class="porcentagemAcerto" type="number" placeholder="% de acerto mínima">
            <input class="urlImagemNivel" type="text" placeholder="URL da imagem do nível">
            <input class="descricaoNivel" type="text" placeholder="Descrição do nível">
        </section>
        `   
    }
}

function validarNiveis() {
    let informacaoValida = true;
    let nivelCom0 = 0;

    document.querySelectorAll(".nivel").forEach((nivel) => {
        if (nivel.querySelector(".tituloNivel").value.length < 10) {informacaoValida = false};
        if (nivel.querySelector(".porcentagemAcerto").value < 0 || nivel.querySelector(".porcentagemAcerto").value > 100) {informacaoValida = false};
        if (nivel.querySelector(".porcentagemAcerto").value == 0) {nivelCom0++};
        if (!verificaURL(nivel.querySelector(".urlImagemNivel").value)) {informacaoValida = false};
        if (nivel.querySelector(".descricaoNivel").value.length < 30) {informacaoValida = false};
    })

    if (!informacaoValida || nivelCom0 == 0) {
        alert("Por favor, preencha dos dados corretamente");
    }else {
        niveisGerados = document.querySelectorAll(".nivel");
        postQuizz();
    }
}

function postQuizz() {
    
    let quizz = [];
    let questoesQuizz = [];
    let niveisQuizz = [];

    perguntasGeradas.forEach((pergunta) => {
        let respostasIncorretas = pergunta.querySelectorAll(".respostaIncorreta")
        let urlRespostasIncorretas = pergunta.querySelectorAll(".urlImagemRespostaIncorreta")
        let respostas = [];

        respostas.push({
            text: pergunta.querySelector(".respostaCorreta").value,
            image: pergunta.querySelector(".urlImagemRespostaCorreta").value,
            isCorrectAnswer: true
        })

        for (let i = 0; i < 3; i++) {
            if (!(respostasIncorretas[i].value.length === 0)) {
                //(respostasIncorretas[i].value != null)
                respostas.push({
                    text: respostasIncorretas[i].value,
                    image: urlRespostasIncorretas[i].value,
                    isCorrectAnswer: false
                })
            }
        }

        let perguntaGerada =  {
            title: pergunta.querySelector(".textoPergunta").value,
            color: pergunta.querySelector(".corPergunta").value,
            answers: respostas
        }
        questoesQuizz.push(perguntaGerada);
    })
    
    niveisGerados.forEach((nivel) => {
        niveisQuizz.push({
			title: nivel.querySelector(".tituloNivel").value,
			image: nivel.querySelector(".urlImagemNivel").value,
			text: nivel.querySelector(".descricaoNivel").value,
			minValue: nivel.querySelector(".porcentagemAcerto").value
		})
    })

    quizz = {
        title: informacoes[0].value,
        image: informacoes[1].value,
        questions: questoesQuizz,
        levels: niveisQuizz
    }

    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", quizz);
        promessa.then((resposta) =>{
            document.querySelector(".criacaoNiveis").classList.add("some");
            const quizzPronto = document.querySelector(".quizzPronto");
            quizzPronto.classList.remove("some");
            quizzPronto.querySelector("img").src=`${informacoes[1].value}`;
            console.log(resposta.data);
            salvarQuizz(resposta.data);
        })
        promessa.catch((error) => {
            console.log("Status code: " + error.response.status); 
	        console.log("Mensagem de erro: " + error.response.data);
        })
}

function salvarQuizz(quizz) {
    quizzesSalvos.push(quizz);
    localStorage.setItem("MeusQuizzes",JSON.stringify(quizzesSalvos));
}

function verificaURL(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return true;
}