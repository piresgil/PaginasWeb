(function () {
    var cnv = document.querySelector('canvas')
    var ctx = cnv.getContext('2d')

    var gravity = 0.1
    var catX = catY = hyp = 0

    // estados de jogo
    var START = 1, PLAY = 2, OVER = 3
    var gameState = START

    // Pontuação
    var score = 0

    // record (2 formas), forma ternária
    var record = localStorage.getItem("record") ? localStorage.getItem("record") : 0

    /*
    var record = 0
    if(localStorage.getItem("record") !== null){
        record = localStorage.getItem("record")
    }
    */

    // obj bola
    var ball = {
        radius: 20,
        vx: 0,
        vy: 0,
        x: cnv.width / 2 - 10,
        y: 50,
        color: "#00f",
        touched: false,
        visible: false
    }

    // mensagens
    var menssages = []
    // mensagem inicial
    var startMenssage = {
        text: "TOUCH TO START",
        y: cnv.height / 2 - 100, // 100px acima da metade da alturado do  canvas
        font: "bold 30px sans-serif",
        color: "#f00",
        visible: true
    }

    menssages.push(startMenssage)

    // placard final
    var scoreText = Object.create(startMenssage)
    scoreText.visible = false
    scoreText.y = cnv.height / 2 + 50

    menssages.push(scoreText)

    //record
    var recordMessage = Object.create(startMenssage)
    recordMessage.visible = false
    recordMessage.y = cnv.height / 2 + 100

    menssages.push(recordMessage)

    // eventos
    cnv.addEventListener('mousedown', function (e) {
        catX = ball.x - e.offsetX
        catY = ball.y - e.offsetY
        hyp = Math.sqrt(catX * catX + catY * catY)

        switch (gameState) {
            case START:
                gameState = PLAY
                startMenssage.visible = false
                startGame()
                break
            case PLAY:
                if (hyp < ball.radius && !ball.touched) {
                    ball.vx = Math.floor(Math.random() * 21) - 10
                    ball.vy = -(Math.floor(Math.random() * 6) + 5)
                    ball.touched = true
                    score++
                }
                break
        }
    }, false)

    cnv.addEventListener('mouseup', function () {
        if (gameState === PLAY) {
            ball.touched = false
        }
    })

    // funçoes
    function loop() {
        requestAnimationFrame(loop, cnv)
        if (gameState === PLAY) {
            update()
        }
        render()
    }

    function update() {
        // açao da gavidade e deslocamento da bola
        ball.vy += gravity
        ball.y += ball.vy
        ball.x += ball.vx

        // bater nas paredes
        if (ball.x + ball.radius > cnv.width || ball.x < ball.radius) {
            if (ball.x < ball.radius) {
                ball.x = ball.radius
            } else {
                ball.x = cnv.width - ball.radius
            }
            ball.vx *= -0.8
        }

        // bater no tecto
        if (ball.y < ball.radius && ball.vy < 0) {
            ball.y = ball.radius
            ball.vy *= -1
        }

        // gameOver
        if (ball.y - ball.radius > cnv.height) {
            gameState = OVER
            ball.visible = false

            window.setTimeout(function () {
                startMenssage.visible = true
                gameState = START
            }, 2000)

            scoreText.text = "YOUR SCORE: " + score
            scoreText.visible = true

            if (score > record) {
                record = score
                localStorage.setItem("record", record)
            }

            recordMessage.text = "BEST SCORE: " + record
            recordMessage.visible = true
        }
    }

    function render() {
        ctx.clearRect(0, 0, cnv.width, cnv.height)

        // renderização da bola
        if (ball.visible) {
            ctx.fillStyle = ball.color
            ctx.beginPath()
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fill()
            // desenhar Placard
            ctx.font = "bold 15px Arial"
            ctx.fillStyle = "#000"
            ctx.fillText("SCORE: " + score, 10, 20)
        }

        // renderização das menssagens de texto
        for (var i in menssages) {
            var msg = menssages[i]
            if (msg.visible) {
                ctx.font = msg.font
                ctx.fillStyle = msg.color
                ctx.fillText(msg.text, (cnv.width - ctx.measureText(msg.text).width) / 2, msg.y)
            }
        }
    }

    // funçao de inicialização do jogo
    function startGame() {
        ball.vy = 0
        ball.y = 50
        ball.vx = Math.floor(Math.random() * 21) - 10
        ball.x = Math.floor(Math.random() * 261) + 20
        ball.visible = true
        score = 0
        scoreText.visible = false
        recordMessage.visible = false
    }

    loop()
}())