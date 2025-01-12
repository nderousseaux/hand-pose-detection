let handPose; // Modèle
let video; // Flux vidéo
let hands = []; // Position des mains

// On charge le modèle
function preload() {
  handPose = ml5.handPose({ flipped: true });
}

// Fonction qui récupère les résultars
function gotHands(results) {
  hands = results;
}

// On charge la preview vidéo
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();
  handPose.detectStart(video, gotHands);
}

// On dessine dans le canva
function draw(){
  // On met la vidéo dans le fond du canva
  image(video, 0, 0);

  // On dessine les mains
  
  // Si on voit une main
  if (hands.length > 0) {
    
    // Pour chaque main
    for (let hand of hands) {

      // Si la main est assez visible
      if (hand.confidence > 0.1) {

        // Pour chaque point de la main
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Si la main est gauche, on met un cercle violet
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else { // Sinon, on met un cercle jaune
            fill(255, 255, 0);
          }
          // On dessine le cercle
          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }
      }
    }
  }
}