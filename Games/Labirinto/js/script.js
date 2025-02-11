(function () {

    var cnv = document.querySelector("canvas")
    var ctx = cnv.getContext("2d")

    var WIDTH = cnv.width, HEIGHT = cnv.height

    var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40
    var movLeft = movUp = movRight = movDown = false

    var tileSize = 64
    var tileSrcSize = 96

    var img = new Image()
    img.src = "img/img.png"
    img.addEventListener("load", function () {
        requestAnimationFrame(loop, cnv)
    }, false)

    var walls = []

    var player = {
        x: tileSize + 2,
        y: tileSize + 2,
        width: 24,
        height: 32,
        speed: 2,
        srcX: 0,
        srcY: tileSrcSize,
        countAnim: 0
    }

    var maze = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]

    var T_WIDTH = maze[0].length * tileSize,
        T_HEIGHT = maze.length * tileSize

    for (var row in maze) {
        for (var column in maze[row]) {
            var tile = maze[row][column]
            if (tile === 1) {
                var wall = {
                    x: tileSize * column,
                    y: tileSize * row,
                    width: tileSize,
                    height: tileSize
                }
                walls.push(wall)
            }
        }
    }

    var cam = {
        x: 0,
        y: 0,
        width: WIDTH,
        height: HEIGHT,
        innerLeftBoundary: function () {
            return this.x + (this.width * 0.25)
        },
        innerTopBoundary: function () {
            return this.y + (this.height * 0.25)
        },
        innerRigthBoundary: function () {
            return this.x + (this.width * 0.75)
        },
        innerBottomBoundary: function () {
            return this.y + (this.height * 0.75)
        },
    }

    function blockRectangle(objA, objB) {
        var distX = (objA.x + objA.width / 2) - (objB.x + objB.width / 2)
        var distY = (objA.y + objA.height / 2) - (objB.y + objB.height / 2)

        var sumWidth = (objA.width + objB.width) / 2
        var sumHeight = (objA.height + objB.height) / 2

        if (Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight) {
            var overlapX = sumWidth - Math.abs(distX)
            var overlapY = sumHeight - Math.abs(distY)

            if (overlapX > overlapY) {
                objA.y = distY > 0 ? objA.y + overlapY : objA.y - overlapY
            } else {
                objA.x = distX > 0 ? objA.x + overlapX : objA.x - overlapX
            }
        }
    }

    window.addEventListener("keydown", keydownHandler, false)
    window.addEventListener("keyup", keyupHandler, false)

    function keydownHandler(e) {
        var key = e.keyCode
        switch (key) {
            case LEFT:
                movLeft = true
                break
            case UP:
                movUp = true
                break
            case RIGHT:
                movRight = true
                break
            case DOWN:
                movDown = true
                break
        }
    }

    function keyupHandler(e) {
        var key = e.keyCode
        switch (key) {
            case LEFT:
                movLeft = false
                break
            case UP:
                movUp = false
                break
            case RIGHT:
                movRight = false
                break
            case DOWN:
                movDown = false
                break
        }
    }

    function update() {
        if (movLeft && !movRight) {
            player.x -= player.speed
            player.srcY = tileSrcSize + player.height * 2
        } else if (movRight && !movLeft) {
            player.x += player.speed
            player.srcY = tileSrcSize + player.height * 3
        } else if (movUp && !movDown) {
            player.y -= player.speed
            player.srcY = tileSrcSize + player.height * 1
        } else if (movDown && !movUp) {
            player.y += player.speed
            player.srcY = tileSrcSize + player.height * 0
        }

        if (movLeft || movRight || movUp || movDown) {
            player.countAnim++

            if (player.countAnim >= 40) {
                player.countAnim = 0
            }
            player.srcX = Math.floor(player.countAnim / 5) * player.width
        } else {
            player.srcX = 0
            player.countAnim = 0
        }

        for (var i in walls) {
            var wall = walls[i]
            blockRectangle(player, wall)
        }

        if (player.x < cam.innerLeftBoundary()) {
            cam.x = player.x - (cam.width * 0.25)
        }
        if (player.y < cam.innerTopBoundary()) {
            cam.y = player.y - (cam.height * 0.25)
        }
        if (player.x + player.width > cam.innerRigthBoundary()) {
            cam.x = player.x + player.width - (cam.width * 0.75)
        }
        if (player.y + player.height > cam.innerBottomBoundary()) {
            cam.y = player.y + player.height - (cam.height * 0.75)
        }

        cam.x = Math.max(0, Math.min(T_WIDTH - cam.width, cam.x))
        cam.y = Math.max(0, Math.min(T_HEIGHT - cam.height, cam.y))
    }

    function render() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT)
        ctx.save()
        ctx.translate(-cam.x, -cam.y)

        /*
                for (var row in maze) {
                    for (var column in maze[row]) {
                        var tile = maze[row][column]
                        if (tile === 1) {
                            var x = column * tileSize
                            var y = row * tileSize
                            ctx.fillRect(x, y, tileSize, tileSize)
                        }
                    }
                }

            ctx.fillStyle = "#00f"
            ctx.fillRect(player.x, player.y, player.width, player.height)
            ctx.restore()
        */

        for (var row in maze) {
            for (var column in maze[row]) {
                var tile = maze[row][column]
                var x = column * tileSize
                var y = row * tileSize
                ctx.drawImage(
                    img,
                    tile * tileSrcSize, 0, tileSrcSize, tileSrcSize,
                    x, y, tileSize, tileSize
                )
            }
        }

        ctx.drawImage(
            img,
            player.srcX, player.srcY, player.width, player.height,
            player.x, player.y, player.width, player.height
        )
        ctx.restore()
    }

    function loop() {
        update()
        render()
        requestAnimationFrame(loop, cnv)
    }

}())