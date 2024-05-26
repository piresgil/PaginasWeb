/* 
* Class responsavel por um jogador
*/
class Player {
    /* 
   * Recebe uma partida de Tetris como parametro no constructor
   * armazena nos atributos, o tetris, a arena
   * armazena dropCounter e drop interval para fazer o deslocamento vertical da peça,
   * armazena uma pocisao
   * armazena uma matrix
   * armazena uma pontuação
   * corre o metodo reset() para resetar todas
   */
    constructor(tetris) {
        this.DROP_SLOW = 1000;
        this.DROP_FAST = 50;

        this.events = new Events;

        this.tetris = tetris;
        this.arena = tetris.arena;

        this.dropCounter = 0;
        this.dropInterval = this.DROP_SLOW;

        this.pos = { x: 0, y: 0 };
        this.matrix = null;
        this.score = 0;

        this.reset();
    }
    /* 
    * Metodo createPiece(), reponsavel por criar peças, recebendo uma letra como type
    * que sao arrays, de valores 1,2,3,4,5,6,7, para atribuir cores,
    * onde 0 no array significa que nao existe peça, ajuda apenas na rotação
    */
    createPiece(type) {
        if (type === 'T') {
            return [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ];
        } else if (type === 'O') {
            return [
                [2, 2],
                [2, 2],
            ];
        } else if (type === 'L') {
            return [
                [0, 3, 0],
                [0, 3, 0],
                [0, 3, 3],
            ];
        } else if (type === 'J') {
            return [
                [0, 4, 0],
                [0, 4, 0],
                [4, 4, 0],
            ];
        } else if (type === 'I') {
            return [
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
            ];
        } else if (type === 'S') {
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0],
            ];
        } else if (type === 'Z') {
            return [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0],
            ];
        }
    }
    /* 
* Metodo drop(), responsavel fazar descair a peça
*/
    drop() {
        this.pos.y++;
        this.dropCounter = 0;
        if (this.arena.collide(this)) {
            this.pos.y--;
            this.arena.merge(this);
            this.reset();
            this.score += this.arena.sweep();
            this.events.emit('score', this.score);
            return;
        }
        this.events.emit('pos', this.pos);
    }
    /* 
    * Metodo move(), responsavel por mover peça
    * recebe um offset como parametro que será o deslocamento,
    * incrementa na posição 
    * testa se existe colisao, ao executar este metodo,
    * se existir decrementa entao na posisao (nao sera uma posiçao valida)
    */
    move(dir) {
        this.pos.x += dir;
        if (this.arena.collide(this)) {
            this.pos.x -= dir;
            return;
        }
        this.events.emit('pos', this.pos);
    }
    /* 
    * Metodo reset(), 
    *
    * cria array de char´s, para sortear tipo de peça
    * recebe peça criada pelo metodo createPiece(), e atribui na matrix deste jogador
    * posisao no eixo y resetada ao topo(0)
    * posisao no eixo x resetada ao meio da matrix da arena deste jogador,
    * assim como reseta ao meio da matrix, para alinhar peça ao centro
    * 
    * testa se existe cosisao, ao executar este metodo,
    * se existeir, lempa a arena, reseta score
    */
    reset() {
        const pieces = 'ILJOTSZ';
        this.matrix = this.createPiece(pieces[pieces.length * Math.random() | 0]);
        this.pos.y = 0;
        this.pos.x = (this.arena.matrix[0].length / 2 | 0) -
            (this.matrix[0].length / 2 | 0);
        if (this.arena.collide(this)) {
            this.arena.clear();
            this.score = 0;
            this.events.emit('score', this.score);
        }

        this.events.emit('pos', this.pos);
        this.events.emit('matrix', this.matrix);
    }
    /* 
    * Metodo rotate(), responsavel por rodar uma peça
    *
    */
    rotate(dir) {
        const pos = this.pos.x;
        let offset = 1;
        this._rotateMatrix(this.matrix, dir);
        while (this.arena.collide(this)) {
            this.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.matrix[0].length) {
                this._rotateMatrix(this.matrix, -dir);
                this.pos.x = pos;
                return;
            }
        }
        this.events.emit('matrix', this.matrix);
    }
    /* 
    * Metodo _rotateMatrix(), responsavel por rodar uma matrix
    */
    _rotateMatrix(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [
                    matrix[x][y],
                    matrix[y][x],
                ] = [
                        matrix[y][x],
                        matrix[x][y],
                    ];
            }
        }

        if (dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    update(deltaTime) {
        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.drop();
        }
    }
}
