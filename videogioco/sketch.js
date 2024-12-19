let sfondo;
let cesto;
let meleImg;
let pietreImg;
let mele = [];
let pietre = [];
let playerX;
let playerY;
let punteggio = 0;
let giocoTerminato = false;
let messaggi = [];
let obiettivi = [10, 20, 30, 40, 50];
let prossimoObiettivo = 5;
let montserratBold;

function preload() {
    sfondo = loadImage('sfondo.png');
    cesto = loadImage('cesto.png');
    meleImg = loadImage('mele.png');
    pietreImg = loadImage('pietre.png');
    montserratBold = loadFont('Montserrat-Bold.ttf');
}

function setup() {
    createCanvas(1280, 720);
    playerX = width / 2;
    playerY = height - 70;
    textFont(montserratBold);
}

function draw() {
    if (giocoTerminato) {
        gameOver();
        return;
    }

    background(sfondo);
    displayPlayer();
    gestisciMele();
    gestisciPietre();
    mostraPunteggio();
    controllaCollisioni();
    gestisciMessaggi();
}

function displayPlayer() {
    image(cesto, playerX, playerY, 60, 60);
    if (keyIsDown(LEFT_ARROW) && playerX > 0) {
        playerX -= 9;
    }
    if (keyIsDown(RIGHT_ARROW) && playerX < width - 60) {
        playerX += 9;
    }
}

function gestisciMele() {
    if (frameCount % 60 === 0) {
        mele.push({ x: random(0, width - 40), y: 0 });
    }

    for (let i = mele.length - 1; i >= 0; i--) {
        image(meleImg, mele[i].x, mele[i].y, 40, 40);
        mele[i].y += 4;

        if (mele[i].y > height) {
            mele.splice(i, 1);
        }
    }
}

function gestisciPietre() {
    if (frameCount % 90 === 0) {
        pietre.push({ x: random(0, width - 40), y: 0 });
    }

    for (let i = pietre.length - 1; i >= 0; i--) {
        image(pietreImg, pietre[i].x, pietre[i].y, 40, 40);
        pietre[i].y += 4;

        if (pietre[i].y > height) {
            pietre.splice(i, 1);
        }
    }
}

function mostraPunteggio() {
    fill(0);
    textSize(32);
    textAlign(CENTER, TOP);
    text(`PUNTEGGIO: ${punteggio}`, width / 2, 20);
}

function controllaCollisioni() {
    for (let i = mele.length - 1; i >= 0; i--) {
        if (collide(playerX, playerY, 60, 60, mele[i].x, mele[i].y, 40, 40)) {
            punteggio += 1;
            mele.splice(i, 1);
            verificaObiettivo();
        }
    }

    for (let i = pietre.length - 1; i >= 0; i--) {
        if (collide(playerX, playerY, 60, 60, pietre[i].x, pietre[i].y, 40, 40)) {
            punteggio -= 5;
            pietre.splice(i, 1);
            if (punteggio < 0) {
                giocoTerminato = true;
            }
        }
    }
}

function verificaObiettivo() {
    if (punteggio >= prossimoObiettivo) {
        messaggi.push({
            testo: scegliMessaggio(),
            x: random(50, width - 50),
            y: random(50, height - 50),
            alpha: 255
        });

        if (obiettivi.length > 0) {
            prossimoObiettivo = obiettivi.shift();
        } else {
            prossimoObiettivo += 5;
        }
    }
}

function verificaObiettivo() {
    if (punteggio >= prossimoObiettivo) {
        messaggi.push({
            testo: scegliMessaggio(),
            x: random(50, width - 50),
            y: random(50, height - 50),
            alpha: 255
        });

        if (punteggio >= 10) {
            window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
        }

        if (obiettivi.length > 0) {
            prossimoObiettivo = obiettivi.shift();
        } else {
            prossimoObiettivo += 5;
        }
    }
}


function gestisciMessaggi() {
    for (let i = messaggi.length - 1; i >= 0; i--) {
        let msg = messaggi[i];
        fill(0, msg.alpha);
        textSize(32);
        textAlign(CENTER, CENTER);
        text(msg.testo, msg.x, msg.y);
        msg.alpha -= 2;

        if (msg.alpha <= 0) {
            messaggi.splice(i, 1);
        }
    }
}

function scegliMessaggio() {
    let frasi = [
        "STAI ANDANDO ALLA GRANDE!",
        "BRAVO!",
        "CONTINUA COSÌ!",
        "OTTIMO LAVORO!",
        "FANTASTICO!",
        "ECCELLENTE!"
    ];
    return random(frasi);
}

function gameOver() {
    background(200, 0, 0);
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text('GAME OVER', width / 2, height / 2);
    textSize(24);
    text('Premi F5 per riprovare', width / 2, height / 2 + 50);
}

function collide(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
}
