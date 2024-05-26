var player
/*
* Entity function()
*/
Entity = function (type, id, x, y, width, height, img) {
    /*
    * Função a ser chamada quando criada uma entidade,
    * contem dentro dela outras funçoes de sua responsabilidade,
    * qualquer entidade e responsavel por si propria, daí a criação da variavel SELF
    */
    var self = {
        /*
       * Atributos:
       * tipo
       * pocisao x e y
       * velocidade x e y, que na verdade e o deslocamento de x e y
       * id, altura, largura, cor
       */
        type: type,
        id: id,
        x: x,
        y: y,
        width: width,
        height: height,
        img: img,
    }
    /* 
    * Update function()
    */
    self.update = function () {
        /* 
        * Responsavel por actualizar entidades, e imprimir,
        * vai ser chamado no loop update() para cada entidade
        * existe sobreposição
        */
        self.updatePosition()
        self.draw()
    }
    /* 
    * draw function()
    */
    self.draw = function () {
        /* 
        * Responsavel por imprimir uma entidade,
        * vai ser chamado na função update() de entidade
        * existe sobrepocição em Actor que por sua vez e sobreposto em um Super_draw para Enemys
        */
        ctx.save()
        var x = self.x - player.x
        var y = self.y - player.y

        x += WIDTH / 2
        y += HEIGHT / 2

        x -= self.width / 2
        y -= self.height / 2

        ctx.drawImage(self.img, 0, 0, self.img.width, self.img.height,
            x, y, self.width, self.height
        )

        ctx.restore()
    }
    /*
    * getDistance function(),
    */
    self.getDistance = function (entity2) {   //return distance (number)
        /*
         * Responsavel por obter a distancia entre entidades,
         * relembrando que representamos as entidades por pontos e nao rectangilos ou circulos,
         * por isso utiliza o math.sqrt
         * retorna uma distancia(number)
         */
        var vx = self.x - entity2.x
        var vy = self.y - entity2.y
        return Math.sqrt(vx * vx + vy * vy)
    }
    /*
     * testCollision function(),
     */
    self.testCollision = function (entity2) { //return if colliding (true/false)
        /*
         * responsavel por verificar se existe colisao de entidades
         * retorna true/false
         */
        var rect1 = {
            x: self.x - self.width / 2,
            y: self.y - self.height / 2,
            width: self.width,
            height: self.height,
        }
        var rect2 = {
            x: entity2.x - entity2.width / 2,
            y: entity2.y - entity2.height / 2,
            width: entity2.width,
            height: entity2.height,
        }
        return testCollisionRectRect(rect1, rect2)

    }

    /*
     * updatePosition function(),
     * esta função é apenas para ser sobreposta
     */
    self.updatePosition = function () { }

    return self
}

/*
 * Player function()
 */
Player = function () {
    /*
    * Instancia um Actor para player
    */
    var self = Actor('player', 'myId', 50, 40, 50 * 1.5, 70 * 1.5, Img.player, 10, 1)

    var super_update = self.update
    /*
    * Sobrepocisao de update(), de Actor, que e uma entity
    */
    self.update = function () {
        super_update()
        /*
        * testa se alguma tecla foi pressionada incrementa contador de animação(movimentação)
        * testa ainda clicks do mouse, para executar ataques
        */
        if (self.pressingRight || self.pressingLeft || self.pressingDown || self.pressingUp)
            self.spriteAnimCounter += 0.2

        if (self.pressingMouseLeft)
            self.performAttack()

        if (self.pressingMouseRigth)
            self.performSpecialAttack()
    }

    /*
    * Sobrepocisao de onDeath(), de Actor
    */
    self.onDeath = function () {
        /*
        * Testa GameOver
        */
        if (player.hp <= 0) {
            var timeSurvived = Date.now() - timeWhenGameStarted
            console.log("You lost! You survived for " + timeSurvived + " ms.")
            self.pressingDown = false
            self.pressingUp = false
            self.pressingLeft = false
            self.pressingRight = false

            self.pressingMouseLeft = false
            self.pressingMouseRigth = false
            startNewGame()
        }
    }

    /*
    * clicks
    * funções oncontextmenu(), onmouseup(), onmousdown() que testam clicks do mouse
    * são testadas na função updatePosition() de player
    */
    self.maxMoveSpd = 10

    self.pressingMouseLeft = false
    self.pressingMouseRigth = false

    return self
}
/*
 * Actor function()
 */
Actor = function (type, id, x, y, width, height, img, hp, atkSpd) {
    /*
    * função é chamada, quando criada uma entidade de player ou de enemy
    * pois estas entidades teem atributos semelhantes
    */
    var self = Entity(type, id, x, y, width, height, img)
    /*
    * Adiciona
    * Atributos Especiais:
    * HP ou vida
    * velocidade de ataque
    * contador de ataque
    * angulo de ataque
    */
    self.hp = hp
    self.hpMax = hp
    self.atkSpd = atkSpd
    self.attackCounter = 0
    self.aimAngle = 0

    self.spriteAnimCounter = 0
    /*
    * Teclas
    * atributos para teclas de jogo são acessadas pelas funçoes onkeydown(), onkeyup() que testam teclas pressionadas,
    * são testadas na função updatePosition() de Actor
    */
    self.maxMoveSpd = 3

    self.pressingDown = false
    self.pressingUp = false
    self.pressingLeft = false
    self.pressingRight = false

    /*
    * Sobrepocisao de updatePosition(), de Entity
    */
    self.updatePosition = function () {
        /*  
        * responsavel por calcular a posisao do actor,
        * armazena pocições x e y, testa se alguma tecla de movimento foi pressionada,
        * incrementadando ou decrementado consoante
        * testa posição valida para manter dentro do canvas
        * e no final testa se existe algum obstaculo (parede, wall) no mapa
        */
        var oldX = self.x
        var oldY = self.y
        /*  
        * Logica para prevenir transpor obstaculos
        * if bumper touches a wall, you cant go rigth
        * valores tem a ver com o tamanho das imagens,
        * acrescentando valores par a sua deslocação e forma da imagem
        * 
        */
        var rightBumper = { x: self.x + 40, y: self.y }
        var LeftBumper = { x: self.x - 40, y: self.y }
        var downBumper = { x: self.x, y: self.y + 64 }
        var upBumper = { x: self.x, y: self.y - 16 }
        /*
        * aqui testa se ao movimentar no mapa existe um obstaculo, 
        * utilzando as variaveis criadas anteriormente que representado outros rectangulos
        * Testa e incrementa/decrementa para passar obstaculo em vez de empancar num obj
        * caso contrario move para a pocisao, pois nao existe onstculo no mapa
        */
        if (Maps.current.isPositionWall(rightBumper)) {
            self.x -= 5
        } else {
            if (self.pressingRight)
                self.x += self.maxMoveSpd
        }
        if (Maps.current.isPositionWall(LeftBumper)) {
            self.x += 5
        } else {
            if (self.pressingLeft)
                self.x -= self.maxMoveSpd
        }
        if (Maps.current.isPositionWall(downBumper)) {
            self.y -= 5
        } else {
            if (self.pressingDown)
                self.y += self.maxMoveSpd
        }
        if (Maps.current.isPositionWall(upBumper)) {
            self.y += 5
        } else {
            if (self.pressingUp)
                self.y -= self.maxMoveSpd
        }

        // is position valid
        if (self.x < self.width / 2)
            self.x = self.width / 2
        if (self.x > Maps.current.width - self.width / 2)
            self.x = Maps.current.width - self.width / 2
        if (self.y < self.height / 2)
            self.y = self.height / 2
        if (self.y > Maps.current.height - self.height / 2)
            self.y = Maps.current.height - self.height / 2
    }

    /* 
    * draw function()
    * Sobrepocisão
    */
    self.draw = function () {
        /* 
        * Responsavel por imprimir uma entidade,
        * Sobrepocisão de Entity(), 
        * esta função e novamente sopreposta em um Super_draw para Enemys
        */
        ctx.save()
        var x = self.x - player.x
        var y = self.y - player.y

        x += WIDTH / 2
        y += HEIGHT / 2

        x -= self.width / 2
        y -= self.height / 2
        /* 
        * divide por 3 porque a imagem esta assim feita 3x4 (3 imagens para selecionar na horizontal, 4 na vertical)
        */
        var frameWidth = self.img.width / 3
        var frameHeigth = self.img.height / 4

        var aimAngle = self.aimAngle
        if (aimAngle < 0)
            aimAngle = 360 + aimAngle
        /* 
        * Logica para angulo
        */
        var directionMod = 3 // right
        if (aimAngle >= 45 && aimAngle < 135)  // down
            directionMod = 2
        else if (aimAngle >= 135 && aimAngle < 225)  // left
            directionMod = 1
        else if (aimAngle >= 225 && aimAngle < 315)  // up
            directionMod = 0

        var walkingMod = Math.floor(self.spriteAnimCounter) % 3 // 1,2,3 (max 3)

        ctx.drawImage(self.img,
            walkingMod * frameWidth, directionMod * frameHeigth, frameWidth, frameHeigth,
            x, y, self.width, self.height
        )

        ctx.restore()
    }

    /* 
    * update function()
    */
    var super_update = self.update;
    self.update = function () {
        /* 
        * Sobrepocisao de entity
        * incrementa contador de ataque,
        * quanto mais alto for a velocidade de ataque do Actor,
        * maior será a incrementação
        */
        super_update()
        self.attackCounter += self.atkSpd
        /*
        * Testa HP e corre onDeath() function
        */
        if (self.hp <= 0) {
            self.onDeath()
        }
    }
    /*
    * onDeath() function, função a ser sobreposta em Player e Enemy
    */
    self.onDeath = function () {
    }
    /* 
    * performAttack function()
    */
    self.performAttack = function () {
        /*
        * responsavel por gerar bullet
        * testa contador de ataque, acima de 25 deixa gerar bullet e reseta contador
        */
        if (self.attackCounter > 25) {    //every 1 sec
            self.attackCounter = 0
            Bullet.generate(self)
        }
    }

    /* 
    * performSpecialAttack function()
    */
    self.performSpecialAttack = function () {
        /* 
        * responsavel por gerar special attack
        * testa contador de ataque, acima de 50 deixa gerar special ataque reseta contador,
        * 2 logicas, 
        * a 1ª gera um circulo enorme desde o centro do angulo ao final, ocupando todo canvas (GREAT SPECIAL)
        * a 2ª gera 3 bullets de 5 em 5 graus, conforme o angulo
        */
        if (self.attackCounter > 50) {    //every 1 sec
            self.attackCounter = 0
            /*
            for(var i = 0 ; i < 360; i++){
                    generateBullet(self,i);
            }
            */
            Bullet.generate(self, self.aimAngle - 5)
            Bullet.generate(self, self.aimAngle)
            Bullet.generate(self, self.aimAngle + 5)
        }
    }


    return self
}
/*
 * Enemy function()
 */
Enemy = function (id, x, y, width, height, img, hp, atkSpd) {
    /*
    * Função chamada no randomGenerateEnemy atraves do constructor
    * cria um enemy recebendo parametros de actor no construtor
    * cria lista de enemys e recebe a entity criada com indice e id
    */
    var self = Actor('enemy', id, x, y, width, height, img, hp, atkSpd)

    Enemy.list[id] = self

    self.toRemove = false

    var super_update = self.update
    /*
    * Função update() sobrepocição,
    * incrementa animação, actualiza o angulo
    */
    self.update = function () {
        super_update()
        self.spriteAnimCounter += 0.2
        self.updateAim()
        self.updateKeyPress()
        self.performAttack()
    }
    /*
    * Função updateAim(),
    * responsavel por actualizar angulo, 
    * verifica posição do player e direciona para lá
    */
    self.updateAim = function () {
        var diffX = player.x - self.x
        var diffY = player.y - self.y

        self.aimAngle = Math.atan2(diffY, diffX) / Math.PI * 180
    }
    /*
    * Função updateKeyPress(),
    * responsavel por actualizar as teclas a ser premidas pelo enemy, 
    * verifica posição do player e direciona para lá
    */
    self.updateKeyPress = function () {
        // para saber se o player esta ha direita ou a esquerda
        // para saber se o player esta em cima ou em baixo
        var diffX = player.x - self.x
        var diffY = player.y - self.y

        self.pressingRigth = diffX > 3
        self.pressingLeft = diffX > - 3
        self.pressingDown = diffY > 3
        self.pressingUp = diffY > - 3
    }

    var super_draw = self.draw
    /*
    * Função super_draw(),
    * sobreposição
    */
    self.draw = function () {
        super_draw()

        var x = self.x - player.x + WIDTH / 2
        var y = self.y - player.y + HEIGHT / 2 - self.height / 2 - 20

        ctx.save()

        ctx.fillStyle = 'red'
        var width = 100 * self.hp / self.hpMax

        if (width < 0)
            width = 0

        ctx.fillRect(x - 50, y, width, 10)
        ctx.strokeStyle = 'black'
        ctx.strokeRect(x - 50, y, 100, 10)

        ctx.restore()
    }

    /*
    * Função onDeath(),
    * sobreposição
    */
    self.onDeath = function () {
        self.toRemove = true
    }
    /*
    * Função updatePosition(),
    * sobreposição
    * encontra diferença da pocisao do player e dirige-se para lá,
    * testa obstaculos
    */
    self.updatePosition = function () {
        var oldX = self.x
        var oldY = self.y

        var diffX = player.x - self.x // para saber se o player esta ha direita ou a esquerda
        var diffY = player.y - self.y // para saber se o player esta em cima ou em baixo

        if (diffX > 0)
            self.x += 3
        else
            self.x -= 3

        if (diffY > 0)
            self.y += 3
        else
            self.y -= 3

        if (Maps.current.isPositionWall(self)) {
            self.x = oldX
            self.y = oldY
        }
    }
}
/*
* Enemy.list passa a ser uma lista com os enemys criados
*/
Enemy.list = {}
/*
* METODO update() de Enemy 
*/
Enemy.update = function () {
    // testa mod % 100, para adicionar enemys a cada 4s
    if (frameCount % 100 === 0)      //every 4 sec
        Enemy.randomlyGenerate()
    /*
    * corre lista de Enemys executa update() e ataques,
    * testa ainda se existe necessidade de remover o enemy da lista
    */
    for (var key in Enemy.list) {
        Enemy.list[key].update()
        Enemy.list[key].performAttack()
    }
    for (var key in Enemy.list) {
        if (Enemy.list[key].toRemove)
            delete Enemy.list[key]
    }
}
/* 
* randomGenerateEnemy function(),
*/
Enemy.randomlyGenerate = function () {
    /* 
    * esta função sorteia um numero aleatorio,
    * Math.random() returns a number between 0 and 1
    * para os atributos a ser recebidos na construção de enemys
    * instancia enemy com os atributos recebidos
    */
    // Posicionamento
    var x = Math.random() * Maps.current.width
    var y = Math.random() * Maps.current.height
    // Tamanho
    var height = 64 * 1.5
    var width = 64 * 1.5
    // ID
    var id = Math.random();
    if (Math.random() < 0.5)
        // Constructor
        Enemy(id, x, y, width, height, Img.bat, 2, 1)
    else
        Enemy(id, x, y, width, height, Img.bee, 1, 3)
}
/*
* upgrade function()
*/
Upgrade = function (id, x, y, width, height, category, img) {
    /*
    * Função chamada no randomGenerateUpgrade atraves do constructor
    * cria uma entidade de upgrade recebendo parametros no construtor
    * lista d upgrades recebe entity criada
    */
    var self = Entity('upgrade', id, x, y, width, height, img)

    /*
   * Adiciona
   * Atributos Especiais:
   * categoria
   */
    self.category = category

    Upgrade.list[id] = self
}
/*
* Upgrade.list passa a ser uma lista com os upgrades criados
*/
Upgrade.list = {}

Upgrade.update = function () {
    // testa modd 75 para adicionar update a cada 3s
    if (frameCount % 75 === 0)       //every 3 sec
        Upgrade.randomlyGenerate()
    /*
    * Testa colisoes upgrades com o player, actualiza score ou velocidade de ataque
    */
    for (var key in Upgrade.list) {
        Upgrade.list[key].update()
        var isColliding = player.testCollision(Upgrade.list[key])
        if (isColliding) {
            if (Upgrade.list[key].category === 'score')
                score += 1000
            if (Upgrade.list[key].category === 'atkSpd')
                player.atkSpd += 3
            delete Upgrade.list[key]
        }
    }
}
/* 
* randomGenerateUpgrade function(),
*/
Upgrade.randomlyGenerate = function () {
    /* 
    * esta função sorteia um numero aleatorio,
    * Math.random() returns a number between 0 and 1
    * para os atributos a ser recebidos na construção de upgrades
    * instancia upgrade com atributos recebidos
    */
    // Posicionamento
    var x = Math.random() * Maps.current.width
    var y = Math.random() * Maps.current.height
    // Tamanho
    var height = 32
    var width = 32
    // ID
    var id = Math.random()
    // Randomiza cor e categoria
    if (Math.random() < 0.5) {
        var category = 'score'
        var img = Img.upgrade1
    } else {
        var category = 'atkSpd'
        var img = Img.upgrade2
    }
    // Constructor
    Upgrade(id, x, y, width, height, category, img)
}
/*
* Bullet function()
*/
Bullet = function (id, x, y, spdX, spdY, width, height, combatType) {
    /*
    * Função chamada no generateBullet atraves do constructor
    * cria uma entidade de bullet recebendo parametros no construtor
    */
    var self = Entity('bullet', id, x, y, width, height, Img.bullet)
    /*
    * Adiciona
    * Atributos Especiais:
    * contador para temporizar bullets
    */
    self.timer = 0
    self.combatType = combatType
    self.spdX = spdX
    self.spdY = spdY
    self.toRemove = false

    var super_update = self.update
    self.update = function () {
        super_update()

        self.timer++
        if (self.timer > 75) {
            self.toRemove = true
        }

        if (self.combatType === 'player') {
            for (var key2 in Enemy.list) {
                if (self.testCollision(Enemy.list[key2])) {
                    self.toRemove = true
                    Enemy.list[key2].hp -= 1
                }
            }
        } else if (self.combatType === 'enemy') {
            if (self.testCollision(player)) {
                player.hp -= 1
            }
        }

        if (Maps.current.isPositionWall(self)) {
            self.toRemove = true
        }
    }

    /* 
    * UpdatePosition function()
    */
    self.updatePosition = function () {
        /* 
        * 
        */
        self.x += self.spdX
        self.y += self.spdY

        if (self.x < 0 || self.x > Maps.current.width) {
            self.spdX = -self.spdX
        }
        if (self.y < 0 || self.y > Maps.current.height) {
            self.spdY = -self.spdY
        }
    }

    Bullet.list[id] = self
}

Bullet.list = {}

Bullet.update = function () {
    /*
    * Testa colisoes bullets
    */
    for (var key in Bullet.list) {
        var b = Bullet.list[key]
        b.update()

        if (b.toRemove) {
            delete Bullet.list[key]
        }
    }
}

/* 
* generateBullet function(),
*/
Bullet.generate = function (actor, aimOverwrite) {
    /* 
    * esta função sorteia um numero aleatorio,
    * Math.random() returns a number between 0 and 1
    * para os atributos a ser recebidos na construção de bullets
    * instancia bullet com atributos recebidos
    */
    // Posicionamento
    var x = actor.x
    var y = actor.y
    // Tamanho
    var height = 24
    var width = 24
    // ID
    var id = Math.random()
    // Verifica angulo
    var angle
    if (aimOverwrite !== undefined)
        angle = aimOverwrite
    else angle = actor.aimAngle
    // Velocidade, que na verdade e o deslocamento de x e y
    var spdX = Math.cos(angle / 180 * Math.PI) * 5
    var spdY = Math.sin(angle / 180 * Math.PI) * 5
    // Constructor
    Bullet(id, x, y, spdX, spdY, width, height, actor.type)
}
