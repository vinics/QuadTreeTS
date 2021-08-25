let qt;

function setup() {
  createCanvas(400, 400);
  background(255);

  // Define QuadTree
  let boundary = new Rectangle(200, 200, 200, 200);
  qt = new QuadTree(boundary, 4);

  console.log('Start: ', qt);

  for (let i = 0; i < 500; i++) {
    let p = new Point(random(width), random(height));

    qt.insert(p);
  }
}

function draw() {
  background(0);
  qt.show();

  stroke(0, 255, 0);
  strokeWeight(1);
  rectMode('center');

  let range = new Rectangle(mouseX, mouseY, 50, 50);
  rect(range.center.x, range.center.y, range.width * 2, range.height * 2);

  let points = qt.query(range);

  for (let p of points) {
    strokeWeight(4);
    point(p.x, p.y);
  }
}
