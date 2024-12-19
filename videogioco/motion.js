let poseNet;
let poses = [];
let video;
let modelLoaded = false;

function setup() {
    createCanvas(1280, 720);
    console.log('Chiedo il permesso per la webcam...');

    // Richiede esplicitamente l'accesso alla webcam
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(startVideo)
        .catch(handleError);
}

function startVideo(stream) {
    console.log('Accesso webcam consentito, avvio il video...');
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    // Inizializza PoseNet
    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', function(results) {
        poses = results;
    });
}

function modelReady() {
    modelLoaded = true;
    console.log('PoseNet Model Loaded!');
    select('#status').html('Model Loaded');
}

function handleError(err) {
    console.error('Errore nella richiesta della webcam:', err);
    alert('Errore: Devi consentire l’accesso alla webcam per usare questa applicazione.');
}

function draw() {
    if (!modelLoaded) {
        background(0);
        fill(255);
        textSize(32);
        textAlign(CENTER, CENTER);
        text('Loading Model...', width / 2, height / 2);
        return;
    }

    image(video, 0, 0, width, height);
    drawKeypoints();
    drawSkeleton();
}

function drawKeypoints() {
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            if (keypoint.score > 0.2) {
                fill(255, 0, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }
    }
}

function drawSkeleton() {
    for (let i = 0; i < poses.length; i++) {
        let skeleton = poses[i].skeleton;
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(255, 0, 0);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}
