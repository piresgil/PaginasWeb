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
 * armazena tetris que se sera um array, pois iremos ter mais que um tetris agora
 * armazena elementos do jogador, atravez do querySelectorAll
 * corre os elementos dos jogadores e para cada elemento
 * instancia um novo tetris na div element ('.player')
 */
const tetri = []
const playerElementes = document.querySelectorAll('.player');
[...playerElementes].forEach(element => {
    const tetris = new Tetris(element)
    tetri.push(tetris)
});
/*
 * fica escutando os eventos, para movimentar as peças
 * array com as key cod de cada jogador, corre array, e distribui teclas para cada index do array(neste caso so tem 2 jogadores)
 */
const keyListener = (event) => {
    [
        [65, 68, 81, 69, 83],//esq,dir, rodar esq, rodar dir, baixo
        [37, 39, 33, 34, 40], //esq,dir, rodar esq, rodar dir, baixo
    ].forEach((key, index) => {

        const player = tetri[index].player

        if (event.type === 'keydown') {
            //esq,dir, rodar esq, rodar dir, baixo

            if (event.keyCode === key[0]) {
                player.move(-1)
            } else if (event.keyCode === key[1]) {
                player.move(1)
            } else if (event.keyCode === key[2]) {
                player.rotate(-1)
            } else if (event.keyCode === key[3]) {
                player.rotate(1)
            }
        }
    /* logica para teclas pressas no drop, basicamente faz uma condição ao fazer drop(),
    * para que a peça nao fique presa, e desca fast continuamente, bloqueando o outro jogador
    * e assim podem descer os 2 jogadores ao mesmo tempo mantendo uma velocidade estavel,
    * ora um com o maximo ora o outro, alterna.
    *
    * testa se o intervalo da peça e diferente de drop fast,
    * ou seja se a peça estiver dentro do intervalo de descida, entao faz o drop() e atribui fast ao intervalo
    * caso o intervalo seja igual a fast, entao atribui slow, e faz com que a velocidade diminua
    */
            if (event.keyCode === key[4]) {
                if (event.type === 'keydown') {
                    if (player.dropInterval !== player.DROP_FAST) {
                        player.drop()
                        player.dropInterval = player.DROP_FAST
                    }
                } else {
                    player.dropInterval = player.DROP_SLOW
                }
            }
        })
}

document.addEventListener('keydown', keyListener)
document.addEventListener('keyup', keyListener)