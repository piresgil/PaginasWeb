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

        this.tetris = tetris
        this.arena = tetris.arena

        this.dropCounter = 0 //contador de queda
        this.dropInterval = 1000 // intervalo de queda

        this.pos = { x: 0, y: 0 }
        this.matrix = null
        this.score = 0

        this.reset()
    }
    /* 
    * Metodo move(), responsavel por mover peça
    * recebe um offset como parametro que será o deslocamento,
    * incrementa na posição 
    * testa se existe colisao, ao executar este metodo,
    * se existir decrementa entao na posisao (nao sera uma posiçao valida)
    */
    move(offset) {
        this.pos.x += offset;
        if (this.arena.collide(this)) {
            this.pos.x -= offset;
        }
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
        const pieces = 'ILJOTSZ'

        this.matrix = createPiece(pieces[pieces.length * Math.random() | 0])
        this.pos.y = 0
        this.pos.x = (this.arena.matrix[0].length / 2 | 0) -
            (this.matrix[0].length / 2 | 0)
        if (this.arena.collide(this)) {
            this.arena.clear()
            this.score = 0
            updateScore()
        }
    }
    /* 
    * Metodo rotate(), responsavel por rodar uma peça
    *
    */
    rotate(dir) {
        const pos = this.pos.x
        let offset = 1
        this._rotateMatrix(this.matrix, dir)
        while (this.arena.collide(this)) {
            this.pos.x += offset
            offset = -(offset + (offset > 0 ? 1 : -1))
            if (offset > this.matrix[0].length) {
                rotate(this.matrix, -dir)
                this.pos.x = pos
                return
            }
        }
    }
    /* 
    * Metodo _rotateMatrix(), responsavel por rodar uma matrix
    */
    _rotateMatrix(matrix, dir) {
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < y; x++) {
                [
                    matrix[x][y],
                    matrix[y][x],
                ] = [
                        matrix[y][x],
                        matrix[x][y],
                    ]
            }
        }
        if (dir > 0) {
            matrix.forEach(row => row.reverse())
        } else {
            matrix.reverse()
        }
    }
    /* 
    * Metodo drop(), responsavel fazar descair a peça
    */
    drop() {
        this.pos.y++
        if (this.arena.collide(this)) {
            this.pos.y--
            this.arena.merge(this)
            this.reset()
            this.arena.sweep()
            updateScore()
        }
        this.dropCounter = 0
    }
    /* 
    * Metodo update(), responsavel por actializar dados da class
    * este metodo e chamado no constructor da class tetris, e lá na class recebe um delta time,
    * 
    * (tem um contador e um intervalo), enquanto a contagem estiver dentro do intervalo
    * esecuta o metodo drop() incrementando o contador de queda ao deltatime,
    * isto fara 
    * 
    */
    update(deltaTime) {
        this.dropCounter += deltaTime
        if (this.dropCounter > this.dropInterval) {
            this.drop()
        }
    }
}