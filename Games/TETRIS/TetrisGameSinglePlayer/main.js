  /* 
  * Função reponsavel por criar peças, recebendo uma letra como type
  * que sao arrays, de valores 1,2,3,4,5,6,7, para atribuir cores,
  * onde 0 no array significa que nao existe peça, ajuda apenas na rotação
  */
 function createPiece(type) {
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ]
    } else if (type === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ]
    } else if (type === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ]
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ]
    } else if (type === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ]
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ]
    } else if (type === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ]
    }
}
/*
 * função actualiza o score
 * pega elemento (div) de id score e repoe atravez do innertext
 */
function updateScore() {
    document.getElementById('score').innerText = tetris.player.score
}
/*
 * armazena elemento (canvas)
 * armazena novo obj tetris, instancia recebendo o parametro (canvas que é uma div)
 */
const canvas = document.getElementById('tetris')
const tetris = new Tetris(canvas)
/*
 * fica escutando os eventos, para movimentar as peças
 */
document.addEventListener('keydown', event => {
    const player = tetris.player

    if (event.keyCode === 37) {
        player.move(-1)
    } else if (event.keyCode === 39) {
        player.move(1)
    } else if (event.keyCode === 40) {
        player.drop()
    } else if (event.keyCode === 33 | 81) {
        player.rotate(-1)
    } else if (event.keyCode === 34 | 87) {
        player.rotate(1)
    }
})
/*
 * chama função update apenas no final de iniciar todas as funções do main 
 */
updateScore()