window.onload = () => {
  const maxX = window.innerWidth;
  const maxY = window.innerHeight;
  const centerX = maxX / 2;
  const centerY = maxY / 2;
  let backgroundCanv = document.getElementById("background");
  let ctx = backgroundCanv.getContext("2d");
  let mousePosition = {};
  let onPage = true;

  /* Storing user's device details in a variable*/
  // let details = navigator.userAgent;
    
  /* Creating a regular expression 
  containing some mobile devices keywords 
  to search it in details string*/
  // let regexp = /android|iphone|kindle|ipad/i;
    
  /* Using test() method to search regexp in details
  it returns boolean value*/
  // let isMobileDevice = regexp.test(details);
    
  // if (isMobileDevice) {
  //     console.log("You are using a Mobile Device");
  //     console.log("the mobile device should be forced to in landscape mode");
  // } else {
  //     console.log("You are using Desktop");
  // }
  window.onpageshow = () => {
    // console.log("back on page");
    onPage = true;
  }
  window.onpagehide = () => {
    // console.log("not on page")
    onPage = false;
  }
  
  container.width = window.innerWidth;
  container.height = window.innerHeight;
  backgroundCanv.width = container.width;
  backgroundCanv.height = container.height;

  class Star {
    constructor(x, y, z, alpha = 1, radius, fading = false) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.alpha = alpha;
      this.radius = radius;
      this.fading = fading;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(230, 230, 230, " + Math.min(this.alpha*0.4, 0.75) + ")";
      ctx.fill();
    }
    updatePos(dx, dy) {
      this.x += dx;
      this.y += dy;
    }
    updateAlphaVal(deltaAlpha) {
      this.alpha += deltaAlpha;
    }
    setAlphaVal(alphaVal) {
      this.alpha = alphaVal;
    }
    setFadingBool(isFading) {
      this.fading = isFading;
    }
  }

  let starsArray = [];
  for (let i = 0; i < 450; i++) {
    createRandomStar();
  }
  for (let i = 0; i < starsArray.length; i++) {
    starsArray[i].draw();
  }

  function clear() {
    ctx.clearRect(0, 0, backgroundCanv.width, backgroundCanv.height);
  }
  function drawStars() {
    for (let i = 0; i < starsArray.length; i++) {
      starsArray[i].draw();
    }
  }
  // function remove
  function updateStarPositionsAndAlphaVal(mP) {
    let mousePos = mP;
    for (let i = 0; i < starsArray.length; i++) {
      let star = starsArray[i];
      // let dx = ((mousePos.x - star.x) * star.z * 0.0005) / star.radius;
      // let dy = ((mousePos.y - star.y) * star.z * 0.0005) / star.radius;
      let dx = ((centerX - star.x) * star.z * -0.05) / star.radius;
      let dy = ((centerY - star.y) * star.z * -0.05) / star.radius;
      star.updatePos(dx, dy);
      // let dist = getDistance(mousePos.x, mousePos.y, star.x, star.y);
      // if (dist <= 50) {
      //   star.setFadingBool(true);
      // } else {
      //   star.setFadingBool(false);
      // }
    }
    checkAndStartFadingAllStars();
  }
  function checkAndStartFadingAllStars() {
    for (let i = 0; i < starsArray.length; i++) {
      let star = starsArray[i];
      star.updateAlphaVal(0.003);
      if (inBorder(star)) {
        starsArray.splice(i, 1);
        createCenterRandomStar();
      }
    }
  }
  function update() {
    clear();
    drawStars();
    updateStarPositionsAndAlphaVal(mousePosition);
    if (onPage) {
      requestAnimationFrame(update);
    }
  }

  // document.onmousemove = getMouseCoords;
  // document.onmouseenter = setMouseCoords;
  // document.onmouseleave = (e) => {
  //   allowMoving = false;
  // };
  setInterval(createRandomStar, 20);

  function getMouseCoords(event) {
    let eventDoc, doc, body;
    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
      eventDoc = (event.target && event.target.ownerDocument) || document;
      doc = eventDoc.documentElement;
      body = eventDoc.body;

      event.pageX =
        event.clientX +
        ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
        ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
      event.pageY =
        event.clientY +
        ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
        ((doc && doc.clientTop) || (body && body.clientTop) || 0);
    }

    mousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
    // allowMoving = true;
  }

  function setMouseCoords(event) {
    mousePosition = { x: event.clientX, y: event.clientY };
    update();
  }

  function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  function createRandomStar() {
    let newRadius = Math.floor(Math.random() * 5);
    let newZ = Math.random();
    let newX = Math.random() * (window.innerWidth - newRadius * 2);
    let newY = Math.random() * (window.innerHeight - newRadius * 2);
    createStar(newRadius, newX, newY, newZ);
  }
  function createCenterRandomStar() {
    let newRadius = Math.floor(Math.random() * 5);
    let newZ = Math.random();
    let r = Math.random();
    let r2 = Math.random();
    r = r >= 0.5 ? 1 : -1;
    r2 = r2 >= 0.5 ? 1 : -1;
    let newX = r * Math.random() * 200 + centerX;
    let newY = r2 * Math.random() * 200 + centerY;
    createStar(newRadius, newX, newY, newZ, 0);
  }

  function createStar(radius, xPos, yPos, zVal, alphaVal = 1) {
    starsArray.push(new Star(xPos, yPos, zVal, alphaVal, radius));
  }
  function inBorder(star) {
    let x = star.x;
    let y = star.y;
    let width = backgroundCanv.width;
    let height = backgroundCanv.height;
    let d = star.radius * 2;
    if (0 - d <= x || x >= height + d || 0 - d <= y || y >= width + d) {
      return false;
    }
    return true;
  }

  update();

};

function hideElement(elem) {
  elem.parentElement.style.display = "none";
}
