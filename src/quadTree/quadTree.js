class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Rectangle {
  constructor(centerX, centerY, width, height) {
    this.center = new Point(centerX, centerY);
    this.width = width;
    this.height = height;
  }

  contains(point) {
    return (
      point.x >= this.center.x - this.width &&
      point.x <= this.center.x + this.width &&
      point.y >= this.center.y - this.height &&
      point.y <= this.center.y + this.height
    );
  }

  intersects(range) {
    const {x, y, width, height} = range;

    return !(x - width > this.center.x + this.width ||
            x + width < this.center.x - this.width ||
            y - height > this.center.y + this.height ||
            y + height < this.center.y - this.height
      );
  }
}

class QuadTree {
  constructor(boundary, threshold) {
    this.boundary = boundary;
    this.threshold = threshold;
    this.points = [];
    this.divided = false;
  }

  insert(point) {
    // Check is the point is within the QuadTree boundary
    if (!this.boundary.contains(point)) {
      return false;
    };

    if (this.points.length < this.threshold) {
      this.points.push(point);
      return true;
    }

    if (!this.divided) {
      this.subdivide();
    }

    if (this.nw.insert(point)) return true;
    if (this.ne.insert(point)) return true;
    if (this.sw.insert(point)) return true;
    if (this.se.insert(point)) return true;
  }

  subdivide() {
    const {center, width, height} = this.boundary;
    const { x, y } = center;

    let nw_boundary = new Rectangle( x - width / 2, y - height / 2, width / 2, height / 2);
    this.nw = new QuadTree(nw_boundary, this.threshold);

    let ne_boundary = new Rectangle(x + width / 2, y - height / 2, width / 2, height / 2);
    this.ne = new QuadTree(ne_boundary, this.threshold);

    let sw_boundary = new Rectangle(x - width / 2, y + height / 2, width / 2, height / 2);
    this.sw = new QuadTree(sw_boundary, this.threshold);

    let se_boundary = new Rectangle(x + width / 2, y + height / 2, width / 2, height / 2);
    this.se = new QuadTree(se_boundary, this.threshold);

    this.divided = true;
  }

  query(range, found) {
    if (!found) found = [];

    if (!this.boundary.intersects(range)) {
      return;
    } else {
      for (let p of this.points) {
        if (range.contains(p)) {
          found.push(p);
        }
      }

      if (this.divided) {
        this.nw.query(range, found);
        this.ne.query(range, found);
        this.sw.query(range, found);
        this.se.query(range, found);
      }
    }
    return found;
  }

  show() {
    stroke(255);
    strokeWeight(.25);
    noFill();

    rectMode('center');
    rect(this.boundary.center.x, this.boundary.center.y, this.boundary.width * 2, this.boundary.height * 2);

    if (this.divided) {
      this.nw.show();
      this.ne.show();
      this.sw.show();
      this.se.show();
    }

    for (let p of this.points) {
      strokeWeight(4);
      point(p.x, p.y);
    }
  }
}
