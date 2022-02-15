const url='https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes'

function buscarQuizes(){
    const promessa= axios.get(url)
    promessa.then(separarObjetos)
}
buscarQuizes()

function separarObjetos(resposta){
    const lista=resposta.data
    lista.forEach(dissecarQuiz)
}

function dissecarQuiz(objeto){
    printarTodosQuizes(objeto.image,objeto.title)
}

function printarTodosQuizes(imagem,titulo){
    const listaTodos=document.querySelector('.todosQuizes ul')
    listaTodos.innerHTML+=`
    <li class="quiz">
        <img src="${imagem}">
        <p>${titulo}</p>
    </li>
    `
}