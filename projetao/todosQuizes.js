const url='https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes'
const gabarito=[]
let contagem=0
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
        <img src="${imagem}">
        <p>${titulo}</p>
    </li>
    `
}

function buscarQuizEspecifico(id){
    const promessa= axios.get(url+`/${id}`)
    promessa.then(separarObjeto)
}

function separarObjeto(resposta){
    const objeto=resposta.data
    console.log(objeto)
    printarQuiz(objeto.image,objeto.title,objeto.questions)
    document.querySelector('.todosQuizes').classList.add('some')
    document.querySelector('.quizEspecifico').classList.remove('some')
}

function printarQuiz(imagem,titulo,perguntas){
    const quizEspecifico=document.querySelector('.quizEspecifico')
    quizEspecifico.innerHTML=`
        <div class="imagemTitulo">
            <img src="${imagem}">
            <p>${titulo}</p>
        </div>
        <ul class="listaPerguntas">
        </ul>
    `
    const listaPerguntas=document.querySelector('.listaPerguntas')
    for(let k=0;k<perguntas.length;k++){
        listaPerguntas.innerHTML+=`
            <li class="divPergunta">
                <div class="tituloPergunta">
                    <span>${perguntas[k].title}</span>
                </div>
                <div class="respostas perg${k}">
            
                </div>
            </li>
        `
        const listaRespostas=perguntas[k].answers.sort(()=>{return Math.random() - 0.5;})
        const respostas=document.querySelector(`.perg${k}`)
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
    if(iResposta==gabarito[iPergunta]){ contagem++ }
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
}
