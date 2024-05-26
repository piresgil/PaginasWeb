

/* 
* Update function() player
*/
var super_update = self.update;
self.update = function () {
    super_update()
    /* 
    * Sobrepocisão
    * responsavel por verificar se existe gameOver
    * vai ser chamado no loop update()
    */
    if (self.hp <= 0) {
        var timeSurvived = Date.now() - timeWhenGameStarted
        alert("You lost! You survived for " + timeSurvived + " ms.")
        startNewGame()
    }
}

/* 
 * update function() enemy
 */
var super_update = self.update;
self.update = function () {
    /* 
    * Sobrepocisao
    * chamada no loop update
    */
    super_update()
    self.performAttack()

    var isColliding = player.testCollision(self)
    if (isColliding) {
        player.hp = player.hp - 1
    }
}

/*
* update function() upgrades
*/
var super_update = self.update
self.update = function () {
    super_update()
    var isColliding = player.testCollision(self);
    if (isColliding) {
        if (self.category === 'score')
            score += 1000
        if (self.category === 'atkSpd')
            player.atkSpd += 3
        delete upgradeList[self.id]
    }
}

/*
     * update function() bullet
     */
var super_update = self.update
self.update = function () {
    /*
     * Sobreposição
     * chamada no loop update
     * Lista de bullets recebe entity criada
     */
    super_update()
    var toRemove = false  // variavel para poder remover no final de todo o loop, testa tempo de bullet, e colosao
    self.timer++
    self.timer++
    if (self.timer > 75) {
        toRemove = true
    }

    for (var key2 in enemyList) {
        /*
        var isColliding = self.testCollision(enemyList[key2]);
        if(isColliding){
                toRemove = true;
                delete enemyList[key2];
                break;
        }      
        */
    }
    if (toRemove) {
        delete bulletList[self.id]
    }
}










    
}