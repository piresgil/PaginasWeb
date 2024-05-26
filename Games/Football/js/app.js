/*
* pega todo o documento e adiciona uma funçaõ ao metodo ready,
* ou seja corre a função assim que estiver pronto o elemento, document
*/
$(document).ready(function () {

    /*
    * armazena progresso do jogo, true para quando esta a correr
    * arazena sons para jogo
    */
    var inProgress = false
    var goalSXF = new Audio('sounds/Goal.wav')
    var crowdSXF = new Audio('sounds/crowdWembley96.wav')
    var lwSXF = new Audio('sounds/whistle.wav')
    var crowdSXF2 = new Audio('sounds/crowdWembley96.wav')

    /*
    * define controlo de bolume dos sons
    */
    goalSXF.volume = 0.5
    lwSXF.volume = 0.1
    crowdSXF2.volume = 0.3

    /*
    * Função randUpTo, responsavel por sortear um numero
    */
    function randUpTo(number) {
        return Math.floor(Math.random() * number) + 1
    }
    /*
    * SatartGame
    *
    * testa progresso do jodo, se estiver a correr retorna faso quando jogo acabar
    */
    $(`*`).click(function () {
        if (inProgress == true) {
            //game is in progress
            return false
        }
        /*
        * configurar sons do jogo, para quando nao esta em progresso o jogo
        */
        //game is not in progress
        // load sounds
        //lwSXF.play()
        //crowdSXF.play()

        /*
        * Pega o elemento .start, e seta o texto dele para 0, sera os minitos de jogo
        */
        $('.start').text('0')
        /*
        * Armazena minuto de jogo atravez do elemento .start
        * armazena var para representar o intervalo de jogo os 45min
        */
        var minute = $('.start')
        var ht = 0

        /*
        * depois de todas as funçoes carregadas começamos o jogo
        */
        inProgress = true
        /*
        * define um array com os acontecimentos de uma partida de futebol
        */
        var events = [
            'Gooooollllllooooooo',
            'shot and Missed!',
            'missed by a mile!',
            'Recived a yellow card!',
            'have had player sent off!',
            'have a corner!',
            'have a free-kick!',
            'Remate falhado!',
            'Falta!',
            'Amarelo!',
            'Vermelho',
            'Canto!',
            'Pontape de Baliza!',
            'Remate Defendido!',
            'Fora de jogo!',
            'lançamento de linha Lateral',
            'Pontapé de livre',
            'Bola na barra!',
            'Falta dura!, o arbito deixa o cartão no bolso',
        ]
        /*
        * define as equipas
        */
        var teams = [
            'Benfica',
            'Porto'
        ]
        /*
        * pega o elemento .fact_card (que a dive onde roda os acontecimentos),
        * e adiciona atravez do append o primeiro paragrafo
        */
        $('.fact_card').append('<p class="one_event">And We\'re Off! / Começou o Jogo')
        /*
        * Match
        * aqui esta toda a intelegencia do jogo
        * armazena o partida de futebol(match) e atribui o setinterval passando logo numa função,
        * que testa o final do jogo e respectivo vencedor
        * testa se existe intervalo 45min e incrementa tempo de intervalo(pausa fe intervalo)
        * 
        * ainda dentro da funçao incrementa o tempo de jogo
        * sortia um evento ou acontecimento de jogo
        * 
        * passa o parametro 200, que significa que vai correr a função de 200 em 200 milisegundos
        * ou seja sera um loop de 5x por segundo
        */
        var match = setInterval(function () {
            //loop 5 times per second

            //check if game is finished
            if (parseInt(minute.text()) == 90) {
                //is 90th minute
                crowdSXF.pause()
                clearInterval(match)
                /*
                * testa vencedor,
                * pega os elementos span respectivos do array das equipas(que é o resuldato de cada equipa) e passa para inteiro o seu texto
                * pega o elemento .fact_card e imprime o paragrafo com o resultado final (append)
                */
                //check for winner
                if (parseInt($('span[data-id="' + teams[0] + '"]').text()) > parseInt($('span[data-id="' + teams[1] + '"]').text())) {
                    //team 1 wins
                    $('.fact_card').append('<p class="one_event">' + teams[0] + ' Wins</p>')
                } else if (parseInt($('span[data-id="' + teams[1] + '"]').text()) > parseInt($('span[data-id="' + teams[0] + '"]').text())) {
                    //team 2 wins
                    $('.fact_card').append('<p class="one_event">' + teams[1] + ' Wins</p>')
                } else {
                    //draw
                    $('.fact_card').append('<p class="one_event">It\'s a Draw!</p>')
                }
                /*
                * pega fact_card e deixa a div scrollar para baixo
                * keep div scrolled to bottom
                */
                $('.fact_card').scrollTop(1E10)

                return false
            }

            //chek if it´s half time
            if (parseInt(minute.text()) == 45) {
                //is half time
                if (ht <= 20) {
                    //pause for 20 game minutes
                    if (ht == 0) {
                        $('.fact_card').append('<p class="one_event">Its is Half Time</p>')
                        //play haf time whistle
                        lwSXF.play()
                    }

                    if (ht == 20) {
                        //ready to start second half
                        $('.fact_card').append('<p class="one_event">the Second Half as Start</p>')
                        //play second haf time whistle
                        lwSXF.play()
                    }
                    /*
                    * pega fact_card e deixa a div scrollar para baixo
                    * keep div scrolled to bottom
                    */
                    $('.fact_card').scrollTop(1E10)

                    ht++

                    return false
                }

            }
            //increment time
            minute.text(parseInt(minute.text()) + 1)

            /*
            * Cria sorteio eventos
            * Armazena numa variavel a função para sortear um numero ate 100, neste caso
            * entao testa se esse nume foi maior que 20, para fazer acontecer um evento,
            * ou seja o numero tem que estar entre 1 e 20 para criar um acontecimento
            */
            var thisEvent = randUpTo(100)
            if (thisEvent > 20) {
                // number has to be between 1 and 20 to triger a event

                //decide wicth team the event is accuring with
                var whichTeam = randUpTo(2)

                // get what the event was
                var eventHappened = randUpTo(events.length)

                // add event t fact card
                $('.fact_card').append('<p class="one_event">' + minute.text() + ' - ' + teams[whichTeam - 1] + ' ' + events[eventHappened - 1] + '</p>')

                /*
                * pega fact_card e deixa a div scrollar para baixo
                * keep div scrolled to bottom
                */
                $('.fact_card').scrollTop(1E10)

                if (eventHappened - 1 == 0) {
                    //goal
                    //play sound goal
                    goalSXF.play();

                    var score = $('span[data-id="' + teams[whichTeam - 1] + '"]')

                    //add goal to scorecard
                    score.text(parseInt(score.text()) + 1)
                } else if (eventHappened - 1 == 3 || eventHappened - 1 === 4) {
                    //red or yellow card given
                    lwSXF.play()
                }
            }
        }, 200)
    })
})