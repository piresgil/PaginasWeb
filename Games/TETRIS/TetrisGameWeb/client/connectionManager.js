class ConnectionManager {

    constructor(tetrisManager) {
        this.conn = null
        this.peers = new Map

        this.tetrisManager = tetrisManager
        this.localTetris = this.tetrisManager.instances[0]
    }

    connect(address) {
        this.conn = new WebSocket(address)

        this.conn.addEventListener('open', () => {
            console.log('connection establish')
            this.initSession()
        })

        this.conn.addEventListener('message', event => {
            console.log('Recevied message', event.data)
            this.receive(event.data)
        })
    }

    initSession() {
        const sessionId = window.location.hash.split('#')[1]
        if (sessionId) {
            this.send({
                type: 'join-session',
                id: sessionId,
            })
        } else {
            this.send({
                type: 'create-session',
            })
        }
    }
    
    watchEvents() {
        const local = this.tetrisManager.instances[0];

        const player = local.player;
        ['pos', 'matrix', 'score'].forEach(key => {
            player.events.listen(key, () => {
                this.send({
                    type: 'state-update',
                    fragment: 'player',
                    state: [key, player[key]],
                })
            })
        })
        const arena = local.arena;
        ['matrix'].forEach(key => {
            arena.events.listen(key, () => {
                this.send({
                    type: 'state-update',
                    fragment: 'arena',
                    state: [key, arena[key]],
                })
            })
        })
    }

    updateManager(peers) {

        const me = peers.you
        const clients = peers.clients.filter(id => me !== id)
        clients.forEach(id => {
            if (!this.peers.has(id)) {
                const tetris = this.tetrisManager.createPlayer()
                this.peers.set(id, tetris)
            }
        });

        [...this.peers.entries()].forEach(([id, tetris]) => {
            if (clients.indexOf(id)) {
                this.tetrisManager.removePlayer(tetris)
                this.peers.delete(id)
            }
        });

        const local = this.tetrisManager.instances[0];
        const sorted = peers.clients.map(client => this.peers.get(client.id) || local);
        this.tetrisManager.sortPlayers(sorted);
    }
    updatePeer(id, fragment, [key, value]) {
        if (!this.peers.has(id)) {
            throw new Error('Client does not exist', id);
        }

        const tetris = this.peers.get(id);
        tetris[fragment][key] = value;

        if (key === 'score') {
            tetris.updateScore(value);
        } else {
            tetris.draw();
        }
    }

    receive(msg) {
        const data = JSON.parse(msg)
        if (data.type === 'session-created') {
            window.location.hash = data.id
        } else if (data.type === 'session-broadcast') {
            this.updateManager(data.peers)
        }
    }

    send(data) {
        const msg = JSON.stringify(data)
        console.log(`Sending message ${msg}`)
        this.conn.send(msg)
    }
}