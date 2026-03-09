// 1. OBTENER REFERENCIA AL CANVAS Y CONFIGURAR EL CONTEXTO 2D
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

// Ajustar el tamaño del canvas al tamaño de la ventana del navegador
var width = (canvas.width = window.innerWidth);
var height = (canvas.height = window.innerHeight);

var img = new Image();
img.src = "amor.jpeg";

// Actualizar dimensiones si el usuario cambia el tamaño de la ventana
window.addEventListener("resize", function () {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// 2. FUNCIÓN AUXILIAR: Número aleatorio entre min y max
function random(min, max) {
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// 3. CONSTRUCTOR DEL OBJETO PELOTA (Ball)
function Ball(x, y, velX, velY, color, size) {
  this.x = x;       // Posición horizontal
  this.y = y;       // Posición vertical
  this.velX = velX; // Velocidad horizontal
  this.velY = velY; // Velocidad vertical
  this.color = color; // Color de la pelota
  this.size = size;   // Radio de la pelota en píxeles
}

// 4. MÉTODO: Dibujar la pelota en el canvas
Ball.prototype.draw = function () {
  ctx.save();              // Guardar estado del canvas

  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.clip();              // Recortar en forma circular

  // Dibujar la imagen centrada en la pelota
  ctx.drawImage(
    img,
    this.x - this.size,   // Posición X (esquina superior izquierda)
    this.y - this.size,   // Posición Y
    this.size * 2,        // Ancho = diámetro
    this.size * 2         // Alto = diámetro
  );

  ctx.restore();           // Restaurar estado del canvas
};

// 5. MÉTODO: Actualizar la posición de la pelota (movimiento y rebote)
Ball.prototype.update = function () {
  // Rebote en el borde DERECHO
  if (this.x + this.size >= width) {
    this.velX = -this.velX;
  }

  // Rebote en el borde IZQUIERDO
  if (this.x - this.size <= 0) {
    this.velX = -this.velX;
  }

  // Rebote en el borde INFERIOR
  if (this.y + this.size >= height) {
    this.velY = -this.velY;
  }

  // Rebote en el borde SUPERIOR
  if (this.y - this.size <= 0) {
    this.velY = -this.velY;
  }

  // Mover la pelota sumando la velocidad a la posición actual
  this.x += this.velX;
  this.y += this.velY;
};

// 6. MÉTODO: Detección de colisiones entre pelotas
Ball.prototype.collisionDetect = function () {
  for (var j = 0; j < balls.length; j++) {
    // No comparar la pelota consigo misma
    if (!(this === balls[j])) {
      // Calcular la distancia entre los centros de las dos pelotas
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      // Si la distancia es menor que la suma de los radios → colisión!
      if (distance < this.size + balls[j].size) {
        // Cambiar el color de ambas pelotas a uno aleatorio
        balls[j].color = this.color = `rgb(
          ${random(0, 255)},
          ${random(0, 255)},
          ${random(0, 255)}
        )`;
      }
    }
  }
};

// 7. ARREGLO donde se guardarán todas las pelotas
var balls = [];

// 8. BUCLE DE ANIMACIÓN PRINCIPAL
function loop() {
  // Dibujar fondo blanco semitransparente para crear efecto de estela
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, width, height);

  // Crear nuevas pelotas hasta llegar a un máximo de 25
  while (balls.length < 25) {
    var size = random(20, 60);

    var ball = new Ball(
      random(0 + size, width - size),   // Posición X aleatoria (dentro del canvas)
      random(0 + size, height - size),  // Posición Y aleatoria (dentro del canvas)
      random(-2, 2),                    // Velocidad X aleatoria
      random(-2, 2),                    // Velocidad Y aleatoria
      `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`, // Color aleatorio
      size                              // Tamaño aleatorio entre 20 y 40
    );

    balls.push(ball); // Agregar la nueva pelota al arreglo
  }

  // Recorrer todas las pelotas: dibujar, actualizar y detectar colisiones
  for (var i = 0; i < balls.length; i++) {
    balls[i].draw();             // Dibujar la pelota
    balls[i].update();           // Actualizar posición y velocidad
    balls[i].collisionDetect();  // Detectar colisiones con otras pelotas
  }

  // Llamar de nuevo a loop() para crear animación continua (~60fps)
  requestAnimationFrame(loop);
}

// 9. INICIAR LA ANIMACIÓN
loop();
