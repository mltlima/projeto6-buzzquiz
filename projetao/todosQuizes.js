const url='https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes'

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
                <div class="respostas resp${k}">
            
                </div>
            </li>
        `
        const respostas=document.querySelector(`.resp${k}`)
        for(let i=0;i<perguntas[k].answers.length;i++)
            respostas.innerHTML+=`
                <div class="resposta">
                    <img src="${perguntas[k].answers[i].image}">
                    <p>${perguntas[k].answers[i].title}</p>
                </div>
            `

    }
}
