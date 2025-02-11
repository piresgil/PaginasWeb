const tetrisManager = new TetrisManager(document);
const tetrisLocal = tetrisManager.createPlayer();
tetrisLocal.element.classList.add('local');
tetrisLocal.run();

const connectionManager = new ConnectionManager(tetrisManager);
connectionManager.connect('ws://' + window.location.hostname + ':9000');

const keyListener = (event) => {
    [
        [65, 68, 81, 69, 83],
    ].forEach((key, index) => {
        const player = tetrisLocal.player;
        if (event.type === 'keydown') {
            if (event.keyCode === key[0]) {
                player.move(-1);
            } else if (event.keyCode === key[1]) {
                player.move(1);
            } else if (event.keyCode === key[2]) {
                player.rotate(-1);
            } else if (event.keyCode === key[3]) {
                player.rotate(1);
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
                    player.drop();
                    player.dropInterval = player.DROP_FAST;
                }
            } else {
                player.dropInterval = player.DROP_SLOW;
            }
        }
    });
};

document.addEventListener('keydown', keyListener);
document.addEventListener('keyup', keyListener);
