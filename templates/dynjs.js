function draw() {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, 600, 300) // clear canvas
  ctx.fillStyle = 'skyblue'
  ctx.fillRect(0, 0, 600, 300)

  ctx.translate(300, 0)

  ctx.fillStyle = 'black'

  //%planes%
}

var plane = new Image()

function init() {
  var url =
    'https://cdn.glitch.com/ece8f4bc-bc1f-4b12-a95f-e76ce394ccae%2Fairplane.png?v=1578679518310'
  plane.src = url
  window.requestAnimationFrame(draw)
}

init()
