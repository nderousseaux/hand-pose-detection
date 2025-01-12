function average_regroup(hand, label_points){
  let points = [];
  for (let label of label_points){
    let point = hand.keypoints.find(k => k.name == label);
    points.push(point);
  }

  // On prend chaque paire deux à deux
  let sum = 0;
  let count = 0;
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = 0; j < points.length - 1; j++) {
      if (i != j) {


        let p1 = points[i];
        let p2 = points[j];
        sum += dist(p1.x, p1.y, p2.x, p2.y);
        count++;
      }
    }
  }
  return sum / count;
}


function thumb(hand){
  // On récupère les coordonnées du haut du pouce
  let thumb = hand.keypoints.find(k => k.name == "thumb_tip");

  // On vérifie que le pouce est plus haut que les autres points
  let others = hand.keypoints.filter(k => k.name != "thumb_tip");
  for (let other of others) {
    // Si le pouce est plus bas que les autres points
    if (thumb.y > other.y) {
      return false;
    }
  }

  // Si le bout de l'index est plus à droite que la base de l'index
  let index = hand.keypoints.find(k => k.name == "index_finger_tip");
  let base_index = hand.keypoints.find(k => k.name == "index_finger_mcp");
  if (index.x < base_index.x) {
    return false;
  }  

  // Si le bout du majeur est plus à droite que la base du majeur
  let middle = hand.keypoints.find(k => k.name == "middle_finger_tip");
  let base_middle = hand.keypoints.find(k => k.name == "middle_finger_mcp");
  if (middle.x < base_middle.x) {
    return false;
  }

  // Si le bout de l'annulaire est plus à droite que la base de l'annulaire
  let ring = hand.keypoints.find(k => k.name == "ring_finger_tip");
  let base_ring = hand.keypoints.find(k => k.name == "ring_finger_mcp");
  if (ring.x < base_ring.x) {
    return false;
  }

  // Si le bout de l'auriculaire est plus à droite que la base de l'auriculaire
  let pinky = hand.keypoints.find(k => k.name == "pinky_finger_tip");
  let base_pinky = hand.keypoints.find(k => k.name == "pinky_finger_mcp");
  if (pinky.x < base_pinky.x) {
    return false;
  }

  return true;
}

function thumb_down(hand){
  // On récupère les coordonnées du haut du pouce
  let thumb = hand.keypoints.find(k => k.name == "thumb_tip");

  // On vérifie que le pouce est plus haut que les autres points
  let others = hand.keypoints.filter(k => k.name != "thumb_tip");
  for (let other of others) {
    // Si le pouce est plus haut que les autres points
    if (thumb.y < other.y) {
      return false;
    }
  }

  return true;
}

function ok(hand){
  return false;
}

function doigt(hand){
  return false;
}
