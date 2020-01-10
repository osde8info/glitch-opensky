
function draw() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, 600, 100); // clear canvas
  ctx.fillStyle = 'skyblue';
  ctx.fillRect(0, 0, 600, 100);

  ctx.translate(300, 0);

  ctx.fillStyle = 'black';
  

  ctx.fillText('EZY1234', -200, 100-90);
  ctx.drawImage(plane, -200, 100-90);
  
  ctx.fillText('IST6786', -100, 100-60);
  ctx.drawImage(plane, -100, 100-60);

  ctx.fillText('PUL7654', 0, 100-30);
  ctx.drawImage(plane, 0, 100-30);

  ctx.fillText('RZY1234', 0, 100-30);
  ctx.fillText('KST6786', 100, 100-60);
  ctx.fillText('GUL7654', 200, 100-90);
    
}

var plane = new Image();

function init() {
  var url = "https://cdn.glitch.com/ece8f4bc-bc1f-4b12-a95f-e76ce394ccae%2Fairplane.png?v=1578679518310"
  plane.src = url;
  window.requestAnimationFrame(draw);
}

init();
