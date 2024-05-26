Inventory = function () {
    var self = {
        itens: [] // {id:"itemId", amount}
    }
    /*
    * addItem function()
    * corre lista de itens se existir item incrementa amount
    * se nao existir esse item na lista, adiciona push()
    */
    self.addItem = function (id, amount) {
        for (var i = 0; i < self.itens.length; i++) {
            if (self.itens[i].id === id) {
                self.itens[i].amount += amount
                return
            }
        }
        self.itens.push({ id: id, amount: amount })
        self.refreshRender()
    }

    /*
    * removeItem function()
    * corre lista de itens se existir item decrementa amount
    * se o amount for menor que zero, remove item splice()
    */
    self.removeItem = function (id, amount) {
        for (var i = 0; i < self.itens.length; i++) {
            if (self.itens[i].id === id) {
                self.itens[i].amount -= amount
                if (self.itens[i].amount <= 0)
                    self.itens.splice(i, 1)
                self.refreshRender()
                return
            }
        }
    }

    /*
    * hasItem function()
    * corre lista de itens se existir item coparando amount
    * retornando sempre o item com maior amount
    * retorna falso se nao encontrar id na lista
    */
    self.hasItem = function (id, amount) {
        for (var i = 0; i < self.itens.length; i++) {
            if (self.itens[i].id === id) {
                return self.itens[i].amount >= amount
            }
        }
        return false
    }

    /*
    * refreshRender function()
    * 
    */
    self.refreshRender = function (id, amount) {
        var str = ""
        for (var i = 0; i < self.itens.length; i++) {
            let item = Item.List[self.itens[i].id]
            let onclick = "Item.List['" + item.id + "'].event()"
            str += "<button onclick =\"" + onclick + "\">" + item.name + "x" + self.itens[i].amount + "</button><br>"
        }
        document.getElementById("inventory").innerHTML = str
    }

    return self
}

Item = function (id, name, event) {
    var self = {
        id: id,
        name: name,
        event: event
    }
    Item.List[self.id] = self
    return self
}

Item.List = {}

Item('potion', 'potion', function () {
    player.hp = 10
    playerInventory.removeItem('potion', 1)
})

Item('enemy', 'spawn Enemy', function () {
    Enemy.randomlyGenerate()
})