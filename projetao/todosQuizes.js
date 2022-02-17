const url='https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes'
let gabarito=[]
let acertos=0
let niveis=[]
let idQuiz=0
let informacoes = [];
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
        console.log(informacoes[0].value.length)
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
            <input type="text" placeholder="Texto da pergunta">
            <input type="text" placeholder="Cor de fundo da pergunta">
            <h1>Resposta correta</h1>
            <input type="text" placeholder="Resposta Correta">
            <input type="text" placeholder="URL da imagem">
            <h1>Respostas incorretas</h1>
            <input type="text" placeholder="Resposta incorreta 1">
            <input type="text" placeholder="URL da imagem 1">
            <br>
            <input type="text" placeholder="Resposta incorreta 2">
            <input type="text" placeholder="URL da imagem 2">
            <br>
            <input type="text" placeholder="Resposta incorreta 3">
            <input type="text" placeholder="URL da imagem 3">
            <br>
        </section>
        `       
    }


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