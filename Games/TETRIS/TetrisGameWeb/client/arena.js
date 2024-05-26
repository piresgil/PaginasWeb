/*
 * Class arena, responsavel por criar uma Arena de jogo
 */
class Arena {
    /* 
    * Recebe uma altura e largura como parametros no constructor
    * armazena numa matrix com o comprimento e largura passados
    * enquanto a alttura(h) for menor que 0, adiciona comprimento (w) no array valor(0 para vazio)
    */
    constructor(w, h) {
        const matrix = [];
        while (h--) { // atenção, enquanto h não for zero (h--) e vai decrementando)
            matrix.push(new Array(w).fill(0));
        }
        this.matrix = matrix;

        this.events = new Events;
    }
    /* 
    * Metodo clear()
    * limpa matix, basicamente atribui (0 para vazio) a todos os campos
    */
    clear() {
        this.matrix.forEach(row => row.fill(0));
        this.events.emit('matrix', this.matrix);
    }
    /* 
    * Metodo Colide(), responsavel por colidir (peças na arena)
    *
    * armazena numa matrix a matrix do jogador e a posisao do jogador
    * 
    * corre um for para correr a matrix do jogador
    * corre outro for para correr ate ha posicao do jogador,
    * 
    * testa se a pocisão jogador dentro do array do jogador não é zero,
    * se o deslocamento tem lugar no array da desta arena
    * e se os deslocamentos estao dentro do array da desta arena e retorna true
    * 
    * caso nao cumpra com a condição retorna false, e nao existe colisao
    */
    collide(player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                    (this.matrix[y + o.y] &&
                        this.matrix[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }
    /* 
    * Metodo merge(), responsavel por representar as pociçoes do jogador na tabela da matrix desta arena
    * 
    * forEach para matrix do jogador, recebendo uma linha de index y
    * forEach para a linha, recebenndo um valor, de index x
    * 
    * testa entao se o valor nao for zero, e atribui esse valor na matrix desta arena
    */
    merge(player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.matrix[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
        this.events.emit('matrix', this.matrix);
    }
    /* 
    * metodo sweep(), responsavel por verificar se existe teris(peças juntas) e destroi
    * corre no PlayerDrop()
    * 
    * for outer: primeiro analisa linha, depois verifica se a posisao x é 0(vazio),
    * e contina outer:(volta a correr a "tag" outer:) ate encontrar valores no array(que significa k existe peças),
    * ou seja ate encontrar uma linha com valores no array, significa que existe tetris
    * 
    * entao elemina a linha,
    * com o splice armazenando numa const row vazia(que e a linha a ser eliminada (0 vazio))
    * em seguida usa o unshift, para deslocar as linha para cima,
    * incrementa posisao na linha para fazer correr o for ate existir linhas a ser eliminadas
    * 
    * em seguida atribui score
    * e multiplica contador de linha(logica de pontos), 
    * vai multiplicar o numero de linhas a ser eliminadas por 2, e atribuir ao score do jogador, multiplicando por 10
    */
    sweep() {
        let rowCount = 1;
        let score = 0;
        outer: for (let y = this.matrix.length - 1; y > 0; --y) {
            for (let x = 0; x < this.matrix[y].length; ++x) {
                if (this.matrix[y][x] === 0) {
                    continue outer;
                }
            }

            const row = this.matrix.splice(y, 1)[0].fill(0);
            this.matrix.unshift(row);
            ++y;

            score += rowCount * 10;
            rowCount *= 2;
        }
        this.events.emit('matrix', this.matrix);
        return score;
    }
}
