// This is a custom version of springyEmojiCursor from https://github.com/tholman/cursor-effects
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("nav a").forEach(function (link) {
    const label = (link.textContent || "").trim().toUpperCase();
    if (label === "PUMPFUN") {
      link.href = "https://pump.fun/explore";
      link.title = "PUMPFUN";
    } else if (label === "CODE") {
      link.href = "https://github.com/sattoorun/Sattoo";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.title = "SATTOO CODE";
    } else if (label === "X") {
      link.href = "https://x.com/sattoorun";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.title = "SATTOO ON X";
    }
  });
});
// I have edited it to use two different emojis, alternating between the two
// The original springy emoji effect has been translated over from this old
// code, to modern js & canvas
// - http://www.yaldex.com/FSMessages/ElasticBullets.htm

// export function springyEmojiPairCursor(options) {
function springyEmojiPairCursor(options) {
    let emoji1 = (options && options.emoji1) || "🤪";
    let emoji2 = (options && options.emoji2) || "😂";
    let hasWrapperEl = options && options.element;
    let element = hasWrapperEl || document.body;
  
    let nDots = 7;
    let DELTAT = 0.01;
    let SEGLEN = 10;
    let SPRINGK = 10;
    let MASS = 1;
    let GRAVITY = 50;
    let RESISTANCE = 10;
    let STOPVEL = 0.1;
    let STOPACC = 0.1;
    let DOTSIZE = 11;
    let BOUNCE = 0.7;
  
    let width = window.innerWidth;
    let height = window.innerHeight;
    let cursor = { x: width / 2, y: width / 2 };
    let particles = [];
    let canvas, context, animationFrame;
  
    let emoji1AsImage;
    let emoji2AsImage;
  
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
  
    // Re-initialise or destroy the cursor when the prefers-reduced-motion setting changes
    prefersReducedMotion.onchange = () => {
      if (prefersReducedMotion.matches) {
        destroy();
      } else {
        init();
      }
    };

    // Moved code to save emoji as an image to its own function here
    function emojiAsImage(emoji) {
      context.font = "16px serif";
      context.textBaseline = "middle";
      context.textAlign = "center";
  
      let measurements = context.measureText(emoji);
      let bgCanvas = document.createElement("canvas");
      let bgContext = bgCanvas.getContext("2d");
  
      bgCanvas.width = measurements.width;
      bgCanvas.height = measurements.actualBoundingBoxAscent * 2;
  
      bgContext.textAlign = "center";
      bgContext.font = "16px serif";
      bgContext.textBaseline = "middle";
      bgContext.fillText(
        emoji,
        bgCanvas.width / 2,
        measurements.actualBoundingBoxAscent
      );
  
      return bgCanvas;
    }

    function init() {
      // Don't show the cursor trail if the user has prefers-reduced-motion enabled
      if (prefersReducedMotion.matches) {
        console.log(
          "This browser has prefers reduced motion turned on, so the cursor did not init"
        );
        return false;
      }
  
      canvas = document.createElement("canvas");
      context = canvas.getContext("2d");
      canvas.style.top = "0px";
      canvas.style.left = "0px";
      canvas.style.pointerEvents = "none";
  
      if (hasWrapperEl) {
        canvas.style.position = "absolute";
        element.appendChild(canvas);
        canvas.width = element.clientWidth;
        canvas.height = element.clientHeight;
      } else {
        canvas.style.position = "fixed";
        document.body.appendChild(canvas);
        canvas.width = width;
        canvas.height = height;
      }
  
      // Save emojis as images for performance
      emoji1AsImage = emojiAsImage(emoji1);
      emoji2AsImage = emojiAsImage(emoji2);

      // Create emoji particles, alternating between each emoji
      let i = 0;
      for (i = 0; i < nDots; i++) {
        if (i % 2 == 0) {
            particles[i] = new Particle(emoji2AsImage);
        }
        else {
            particles[i] = new Particle(emoji1AsImage);
        }
      }
  
      bindEvents();
      loop();
    }
  
    // Bind events that are needed
    function bindEvents() {
      element.addEventListener("mousemove", onMouseMove);
      element.addEventListener("touchmove", onTouchMove, { passive: true });
      element.addEventListener("touchstart", onTouchMove, { passive: true });
      window.addEventListener("resize", onWindowResize);
    }
  
    function onWindowResize(e) {
      width = window.innerWidth;
      height = window.innerHeight;
  
      if (hasWrapperEl) {
        canvas.width = element.clientWidth;
        canvas.height = element.clientHeight;
      } else {
        canvas.width = width;
        canvas.height = height;
      }
    }
  
    function onTouchMove(e) {
      if (e.touches.length > 0) {
        if (hasWrapperEl) {
          const boundingRect = element.getBoundingClientRect();
          cursor.x = e.touches[0].clientX - boundingRect.left;
          cursor.y = e.touches[0].clientY - boundingRect.top;
        } else {
          cursor.x = e.touches[0].clientX;
          cursor.y = e.touches[0].clientY;
        }
      }
    }
  
    function onMouseMove(e) {
      if (hasWrapperEl) {
        const boundingRect = element.getBoundingClientRect();
        cursor.x = e.clientX - boundingRect.left;
        cursor.y = e.clientY - boundingRect.top;
      } else {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
      }
    }
  
    function updateParticles() {
      canvas.width = canvas.width;
  
      // follow mouse
      particles[0].position.x = cursor.x;
      particles[0].position.y = cursor.y;
  
      // Start from 2nd dot
      for (let i = 1; i < nDots; i++) {
        let spring = new vec(0, 0);
  
        if (i > 0) {
          springForce(i - 1, i, spring);
        }
  
        if (i < nDots - 1) {
          springForce(i + 1, i, spring);
        }
  
        let resist = new vec(
          -particles[i].velocity.x * RESISTANCE,
          -particles[i].velocity.y * RESISTANCE
        );
  
        let accel = new vec(
          (spring.X + resist.X) / MASS,
          (spring.Y + resist.Y) / MASS + GRAVITY
        );
  
        particles[i].velocity.x += DELTAT * accel.X;
        particles[i].velocity.y += DELTAT * accel.Y;
  
        if (
          Math.abs(particles[i].velocity.x) < STOPVEL &&
          Math.abs(particles[i].velocity.y) < STOPVEL &&
          Math.abs(accel.X) < STOPACC &&
          Math.abs(accel.Y) < STOPACC
        ) {
          particles[i].velocity.x = 0;
          particles[i].velocity.y = 0;
        }
  
        particles[i].position.x += particles[i].velocity.x;
        particles[i].position.y += particles[i].velocity.y;
  
        let height, width;
        height = canvas.clientHeight;
        width = canvas.clientWidth;
  
        if (particles[i].position.y >= height - DOTSIZE - 1) {
          if (particles[i].velocity.y > 0) {
            particles[i].velocity.y = BOUNCE * -particles[i].velocity.y;
          }
          particles[i].position.y = height - DOTSIZE - 1;
        }
  
        if (particles[i].position.x >= width - DOTSIZE) {
          if (particles[i].velocity.x > 0) {
            particles[i].velocity.x = BOUNCE * -particles[i].velocity.x;
          }
          particles[i].position.x = width - DOTSIZE - 1;
        }
  
        if (particles[i].position.x < 0) {
          if (particles[i].velocity.x < 0) {
            particles[i].velocity.x = BOUNCE * -particles[i].velocity.x;
          }
          particles[i].position.x = 0;
        }
  
        particles[i].draw(context);
      }
    }
  
    function loop() {
      updateParticles();
      animationFrame = requestAnimationFrame(loop);
    }
  
    function destroy() {
      canvas.remove();
      cancelAnimationFrame(animationFrame);
      element.removeEventListener("mousemove", onMouseMove);
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchstart", onTouchMove);
      window.addEventListener("resize", onWindowResize);
    };
  
    function vec(X, Y) {
      this.X = X;
      this.Y = Y;
    }
  
    function springForce(i, j, spring) {
      let dx = particles[i].position.x - particles[j].position.x;
      let dy = particles[i].position.y - particles[j].position.y;
      let len = Math.sqrt(dx * dx + dy * dy);
      if (len > SEGLEN) {
        let springF = SPRINGK * (len - SEGLEN);
        spring.X += (dx / len) * springF;
        spring.Y += (dy / len) * springF;
      }
    }
  
    function Particle(canvasItem) {
      this.position = { x: cursor.x, y: cursor.y };
      this.velocity = {
        x: 0,
        y: 0,
      };
  
      this.canv = canvasItem;
  
      this.draw = function (context) {
        context.drawImage(
          this.canv,
          this.position.x - this.canv.width / 2,
          this.position.y - this.canv.height / 2,
          this.canv.width,
          this.canv.height
        );
      };
    }
  
    init();
  
    return {
      destroy: destroy
    }
  }

window.addEventListener("load", () => {
  const journalDates = {
    "/journals/conversations/what-does-it-mean-to-continue/": "AUG 24, 2026 · CONVERSATION",
    "/journals/developer/what-xmr-changed/": "AUG 21, 2026 · DEVELOPER JOURNAL",
    "/journals/sattoo/learning-from-a-graveyard/": "AUG 18, 2026 · SATTOO'S JOURNAL",
    "/journals/developer/the-site-that-outlived-the-coins/": "AUG 14, 2026 · DEVELOPER JOURNAL",
    "/journals/developer/building-someone-who-can-disagree/": "AUG 10, 2026 · DEVELOPER JOURNAL",
    "/journals/sattoo/shape-of-a-remembered-loss/": "AUG 06, 2026 · SATTOO'S JOURNAL",
    "/journals/conversations/why-stay/": "AUG 02, 2026 · CONVERSATION"
  };
  const journalDate = document.querySelector(".journal-meta");
  if (journalDate && journalDates[window.location.pathname]) {
    journalDate.textContent = journalDates[window.location.pathname];
  }
  new springyEmojiPairCursor({ emoji1: "🐟", emoji2: "🐠" });
});
