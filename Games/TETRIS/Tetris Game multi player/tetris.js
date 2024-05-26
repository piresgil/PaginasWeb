/*
* class responsavel criar uma partida de Tetris
*/
class Tetris {
    /* 
    * Recebe um canvas como parametro no constructor
    * armazena atributos de canvas, pegando o contexto e setando a escala
    * armazena e instancia uma nova arena de jogo
    * armazena e instancia um novo jogador referenciado a esta partida de tetris
    * armazena atributo de cores
    * armazena função de update, que faz iniciar um contador, que vai contar o tempo de jogo,
    * e imprimir a partida de tetris utilizando o metodo interno requestAnimationFrame
    */
    constructor(element) {

        this.element = element
        this.canvas = element.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
        this.context.scale(20, 20);

        this.arena = new Arena(12, 20)
        this.player = new Player(this)

        this.colors = [
            null,
            '#FF0D72',
            '#0DC2FF',
            '#0DFF72',
            '#F538FF',
            '#FF8E0D',
            '#FFE138',
            '#3877FF',
        ]

        let lastTime = 0
        const update = (time = 0) => {
            const deltaTime = time - lastTime
            lastTime = time
            this.player.update(deltaTime)

            this.draw()
            requestAnimationFrame(update)
        }
        update()

        this.updateScore(0)
    }
    /* 
    * Metodo Draw(), responsavel por imprimir canvas, arena e player
    * pega atributos do canvas para fazer a impressao do rectangulo de jogo,
    * pega atributos da arena para fazer impressao,
    * pega atributos do jogador para fazer impressao
    */
    draw() {
        this.context.fillStyle = '#000'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.drawMatrix(this.arena.matrix, { x: 0, y: 0 })
        this.drawMatrix(this.player.matrix, this.player.pos)
    }
    /*
    * Metodo drawMatrix(), responsavel por imprimir matrizes
    * ForEach para correr matrix
    * testa valor do array diferente de zero,(zero (vazio) é o valor de transparencia da peça)
    * pega atributos de context(canvas) para imprimie,
    * mais o offset que representa o deslocamento
    */
    drawMatrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.context.fillStyle = this.colors[value]
                    this.context.fillRect(x + offset.x,
                        y + offset.y,
                        1, 1)
                }
            })
        })
    }
    /*
    * Metodo que actualiza Score
    * pega elemento (div) de id score e repoe atravez do innertext
    */
    updateScore(score) {
        this.element.querySelector('.score').innerText = score
    }
}
