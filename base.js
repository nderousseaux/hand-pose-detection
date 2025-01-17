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

// A chaque click, on affiche les points de la main
function mouseClicked() {
  console.log(hands);
}

// On charge la preview vidéo
function setup() {
  createCanvas(windowWidth, windowWidth * 0.75);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();
  handPose.detectStart(video, gotHands);
}

// Ligne entre deux points
function dline_label(keypoints, label1, label2, color){
  // On cherche le point "label1"
  let point1 = keypoints.find(k => k.name == label1);

  // On cherche le point "label2"
  let point2 = keypoints.find(k => k.name == label2);

  // On trace un trait entre les deux points
  stroke(color);
  strokeWeight(2);
  line(point1.x, point1.y, point2.x, point2.y);
}

// On trace un trait entre les points de la main
function dline(keypoints, color){
  // Pouce
  dline_label(keypoints, "thumb_cmc", "thumb_mcp", color);
  dline_label(keypoints, "thumb_mcp", "thumb_ip", color);
  dline_label(keypoints, "thumb_ip", "thumb_tip", color);

  // Index
  dline_label(keypoints, "index_finger_mcp", "index_finger_pip", color);
  dline_label(keypoints, "index_finger_pip", "index_finger_dip", color);
  dline_label(keypoints, "index_finger_dip", "index_finger_tip", color);

  // Majeur
  dline_label(keypoints, "middle_finger_mcp", "middle_finger_pip", color);
  dline_label(keypoints, "middle_finger_pip", "middle_finger_dip", color);
  dline_label(keypoints, "middle_finger_dip", "middle_finger_tip", color);

  // Annulaire
  dline_label(keypoints, "ring_finger_mcp", "ring_finger_pip", color);
  dline_label(keypoints, "ring_finger_pip", "ring_finger_dip", color);
  dline_label(keypoints, "ring_finger_dip", "ring_finger_tip", color);

  // Auriculaire
  dline_label(keypoints, "pinky_finger_mcp", "pinky_finger_pip", color);
  dline_label(keypoints, "pinky_finger_pip", "pinky_finger_dip", color);
  dline_label(keypoints, "pinky_finger_dip", "pinky_finger_tip", color);

  // Pouce et index
  dline_label(keypoints, "thumb_cmc", "index_finger_mcp", color);

  // index et majeur
  dline_label(keypoints, "index_finger_mcp", "middle_finger_mcp", color);

  // majeur et annulaire
  dline_label(keypoints, "middle_finger_mcp", "ring_finger_mcp", color);

  // annulaire et auriculaire
  dline_label(keypoints, "ring_finger_mcp", "pinky_finger_mcp", color);

  // Poignet et pouce
  dline_label(keypoints, "wrist", "thumb_cmc", color);

  // Poignet et auriculaire
  dline_label(keypoints, "wrist", "pinky_finger_mcp", color);
}


function ddot(keypoints, color){
  // Pour chaque point de la main, on place un cercle
  for (let i = 0; i < keypoints.length; i++) {
    let keypoint = keypoints[i];
      // On dessine le cercle avec la couleur appropriée
      noStroke();
      fill(color);
      circle(keypoint.x, keypoint.y, 16);
  }
}



// Mouvement
function dmove(hand){
  let center;

  // Si c'est un pouce levé
  if (thumb(hand)) {
    center = "👍";
  }
  else if (thumb_down(hand)) {
    center = "👎";
  }
  else if (ok(hand)) {
    center = "👌";
  }
  else if (doigt(hand)) {
    center = "🖕"
  } else {
    center = "rien";
  }
 
  return center;

}

function dhand(hand){
  // Rouge si la main est gauche, bleu si la main est droite
  let color = hand.handedness == "Left" ? [255, 0, 0] : [0, 0, 255];

  // Si la main est assez visible, on la dessine
  if (hand.confidence > 0.1) {

    ddot(hand.keypoints, color);
    dline(hand.keypoints, color);


  }
}

// Écart entre le bout du pouce et le bout de l'index
function distance_thumb_index(hand){
  let thumb = hand.keypoints.find(k => k.name == "thumb_tip");
  let index = hand.keypoints.find(k => k.name == "index_finger_tip");

  return dist(thumb.x, thumb.y, index.x, index.y);
}

// Fonction qui vérifie si le pouce est levé
function thumb_up_all(hand){
  // Si le bout du pouce est plus haut que tout les autres points
  let thumb = hand.keypoints.find(k => k.name == "thumb_tip");
  let others = hand.keypoints.filter(k => k.name != "thumb_tip");
  for (let other of others) {
    if (thumb.y < other.y) {
      return false;
    }
  }
  return true;
}

// On écrit le texte
function dtext(){
  let t = "";
  if (hands.length == 0) {
    t = "Pas de main détectée";
  }
  else {
    for (let hand of hands) {
      t += hand.handedness + " mouvement : " + dmove(hand) + "\n";
    }
  }

  // On modifie le contenu de la balise label
  document.getElementById("label").innerText = t;
}

// On dessine dans le canva
function draw(){
  // // On remet le fond du canva à blanc
  background(255);
  // On met la vidéo dans le fond du canva
  // image(video, 0, 0);
  
  // Si on voit une main
  if (hands.length > 0) {
    
    // Pour chaque main
    for (let hand of hands) {

      dhand(hand);
    }
  }
  dtext();

}