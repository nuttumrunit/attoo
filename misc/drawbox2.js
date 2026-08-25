/*

// Drawbox was orignally created by https://drawbox.nekoweb.org - u can see the archived site at: https://web.archive.org/web/20251224062205/https://drawbox.nekoweb.org/
  
                   _ |\_
                   \` ..\
              __,.-" =__Y=
            ."        )
      _    /   ,    \/\_
     ((____|    )_-\ \_-`  
jgs  `-----'`-----` `--`

https://oldcompcz.github.io/jgs/joan_stark/

  FILL IN THESE VARIABLES BASED ON THE GUIDE AT https://3maqi.art/a/drawbox_guide.html
*/

const GOOGLE_FORM_ID = "1FAIpQLSf9NZVwxB2Rdyimgz6pAOWPMtA_SPc1bA0eO1QQU7uT_OWtMQ";
const ENTRY_ID = "entry.1318466765";
const GOOGLE_SHEET_ID = "1pQUdkd9wJNkoD7TD8t1LiFcsC4YUxe6HZU-OgnrVqLA";
const NAME_ID = "entry.1318466765";
// turn on or off gallery
const DISPLAY_IMAGES = true;
// post approval - make false if you dont want to approve images
const IMAGE_APPROVAL = false;

// optional I recommend getting your own client ID https://apidocs.imgur.com/ */
const CLIENT_ID = "bfaaee57f0b78f1";

/*
        
        DONT EDIT BELOW THIS POINT IF YOU DONT KNOW WHAT YOU ARE DOING.
       
*/

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/" + GOOGLE_SHEET_ID + "/export?format=csv";
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/" + GOOGLE_FORM_ID + "/formResponse";

 let canvas = document.getElementById("drawboxcanvas");
 let context = canvas.getContext("2d");
 context.fillStyle = "white";
 context.fillRect(0, 0, canvas.width, canvas.height);



function CreateCanvasMobile(x) {
  if (x.matches) { // If screensize is less then 500px
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetWidth;
     context.fillStyle = "white";
     context.fillRect(0, 0, canvas.width, canvas.height);
     console.log("resizing canvas");
  }
}

// Create a MediaQueryList object
var x = window.matchMedia("(max-width: 499px)")

// Call listener function at run time
CreateCanvasMobile(x);

// Attach listener function on state changes
x.addEventListener("change", function() {
  CreateCanvasMobile(x);
});


let restore_array = [];
let start_index = -1;
let stroke_color = "black";
let stroke_width = "3";
let is_drawing = false;
let line_opacity = "1";


//added stroke_join and Line_cap to modify line
let stroke_join = "round";
let line_cap = "round";


//added username field as well
let user_name = "anonymous";


// code for pen
// thank you to https://stackoverflow.com/questions/66780623/custom-cursor-drawn-on-canvas-in-javascript for making this wonderful code!
const pos = { x: 0, y: 0 };
// a simple object to keep the current pen styles
const pen_style = {
  color: "black",
  cap: "round",
  radius: "2",
  canvas: document.createElement("canvas"),
  cursor_url: null,
  opacity: "1"
};
// update the pen-style object, and the cursor 
document.querySelector( "fieldset" ).oninput = updatePenStyle;
// do it once now to update the cursor
updatePenStyle();

function updatePenStyle() {
  // grab the new values
  const rad = pen_style.radius = stroke_width;
  const color = pen_style.color = stroke_color;
  const cap = pen_style.cap = line_cap;
  const opacity = pen_style.opacity = line_opacity;
  // reuse the same canvas every time
  const cursor_canvas = pen_style.canvas;
  const cursor_ctx = cursor_canvas.getContext( "2d" );

  // update the canvas's drawing
  cursor_canvas.width = cursor_canvas.height = rad;
  cursor_ctx.fillStyle = color;
  if( cap === "round" ) {
    cursor_ctx.arc( rad / 2, rad / 2, rad / 2, 0, Math.PI * 2 );
  }
  else {
    cursor_ctx.rect( 0, 0, rad, rad );
  }
  cursor_ctx.fill();
  // extract it as a png image
  cursor_canvas.toBlob( function( blob ) {
    // revoke the previous blob URL we created (if any)
    URL.revokeObjectURL( pen_style.cursor_url );
    // store the new one
    pen_style.cursor_url = URL.createObjectURL( blob );
    // use it as CSS 'cursor'
    canvas.style.cursor = `url(${ pen_style.cursor_url }) ${ rad/2 } ${ rad/2 }, auto`;
  });  
}


function setPosition(e) {
  const rect = canvas.getBoundingClientRect();
  pos.x = e.clientX - rect.left
  pos.y = e.clientY - rect.top
}


function change_color(element) {
  stroke_color = element.style.background;
}

function start(event) {
  is_drawing = true;
  context.beginPath();
  context.moveTo(getX(event), getY(event));
  event.preventDefault();
}


function draw(event) {
  if (!is_drawing) return;
  context.lineTo(getX(event), getY(event));
  context.strokeStyle = stroke_color;
  context.lineWidth = stroke_width;
  context.lineCap = line_cap;
  context.lineJoin = stroke_join; 
 context.globalAlpha = line_opacity;
  context.stroke();
  setPosition(event);
  event.preventDefault();
}

function stop(event) {
  if (!is_drawing) return;
  context.stroke();
  context.closePath();
  is_drawing = false;
  restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
  start_index++;
  event.preventDefault();
}

function getX(event) {
  return event.pageX
    ? event.pageX - canvas.offsetLeft
    : event.targetTouches[0].pageX - canvas.offsetLeft;
}

function getY(event) {
  return event.pageY
    ? event.pageY - canvas.offsetTop
    : event.targetTouches[0].pageY - canvas.offsetTop;
}

canvas.addEventListener("touchstart", start, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stop, { passive: false });
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);









function Undo() {
  if (start_index <= 0) {
    Clear();
  } else {
    start_index--;
    restore_array.pop();
    context.putImageData(restore_array[start_index], 0, 0);
  }
}



// i kept accidently clearing my image when i meant to do /undo haha
function Clear() {

  
  context.fillStyle = "white";
  context.globalAlpha = 1;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);
  restore_array = [];
  start_index = -1;
  context.globalAlpha = line_opacity;

  
}

// code to upload image 
document.getElementById("submit").addEventListener("click", async function () {
    if (confirm("Are you ready to submit your image?") == true) {

  if (start_index <= -1) { alert("I know art is subjective and all, but you can't submit an empty canvas!"); }

  else {   
  const submitButton = document.getElementById("submit");
  const statusText = document.getElementById("status");

  submitButton.disabled = true;
  statusText.textContent = "Uploading...";

  const imageData = canvas.toDataURL("image/png");
  const blob = await (await fetch(imageData)).blob();
  const formData = new FormData();
  formData.append("image", blob, "drawing.png");

  try {
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: { Authorization: `Client-ID ${CLIENT_ID}` },
      body: formData,
    });

    const data = await response.json();
    if (!data.success) throw new Error("Imgur upload failed");

    const imageUrl = data.data.link;
    console.log("Uploaded image URL:", imageUrl);

    const googleFormData = new FormData();
    googleFormData.append(ENTRY_ID, imageUrl);
    googleFormData.append(NAME_ID,user_name);

    await fetch(GOOGLE_FORM_URL, {
      method: "POST",
      body: googleFormData,
      mode: "no-cors",
    });

    statusText.textContent = "Upload successful!";
    if(IMAGE_APPROVAL){
      alert("Image uploaded and submitted successfully! It will post once I approve the image :)");
    }
    else {
      alert("Image uploaded and submitted successfully!");
    };
    
    location.reload();
  } catch (error) {
    console.error(error);
    statusText.textContent = "Error uploading image.";
    alert("Error uploading image or submitting to Google Form. If this continues to happen, you can right click save the image and send it to me elsewhere!");
  } finally {
    submitButton.disabled = false;
  }
  }}});


// display gallery of images
async function fetchImages() {
  if (!DISPLAY_IMAGES) {
    document.getElementById("gallery").textContent = "images Display is disabled.";
    console.log("Image display is disabled.");
    return;
  }

  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    const csvText = await response.text();
    const rows = csvText.split("\n").slice(1);

    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";
    rows.reverse().forEach((row) => {
      const columns = row.split(",");
      console.log("Row:", row);
      console.log("Columns:", columns);
      if (columns.length < 2) return;

      const timestamp = columns[0].trim();
      const imgUrl = columns[1].trim().replace(/"/g, "");
      const author =columns[2].trim().replace(/"/g, "");
      const approved =columns[3].trim().replace(/"/g, "");
      const myComment =columns[4].trim().replace(/"/g, "");
 
      function loadImages() {
        const div = document.createElement("div");
        div.classList.add("image-container");
        // inner html is a bit... insecure. Id like to fix this at some point
        div.innerHTML = `
                    <img src="${imgUrl}" alt="drawing" class="drawbox" title="${myComment}">
                    <p>${timestamp}</p>
                    <p><span>By: <span>${author}</p>             
                `;
        gallery.appendChild(div);
      }
      
      if(IMAGE_APPROVAL){
         if (imgUrl.startsWith("http") && approved=="TRUE") {
           loadImages();
          }
      }
       else{
        if (imgUrl.startsWith("http")){
           loadImages();
        }
       }
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    document.getElementById("gallery").textContent = "Failed to load images.";
  }

  // lets drawbox images get bigger when clicked
  document.querySelectorAll('.drawbox').forEach(img => {
  img.addEventListener('click', function() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.8)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 10000;
    overlay.addEventListener('click', () => document.body.removeChild(overlay));

    // Create large image
    const bigImg = document.createElement('img');
    bigImg.src = img.src;
    bigImg.style.maxWidth = '90vw';
    bigImg.style.maxHeight = '90vh';
    bigImg.style.borderRadius = '10px';
    bigImg.style.boxShadow = '0 0 20px #000';

    overlay.appendChild(bigImg);
    document.body.appendChild(overlay);
  });
}); 
}

fetchImages();
// allow crtl z to UNDO!
function keyPressHandler(e) {
      var evtobj = window.event ? window.event : e;

      if (evtobj.ctrlKey && evtobj.keyCode == 90) {
          Undo();
      }
}

window.addEventListener('keydown', keyPressHandler);