const canvas = document.getElementById("canvas");
const tools = document.getElementById("tools");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//coloreaza canvasul alb pentru a evita transparenta la salvarea in png
ctx.fillStyle = "white"; 
ctx.fillRect(0, 0, canvas.width, canvas.height); 
ctx.fillStyle = "black";

let drawingON = false;
let lineWidth = 3;
let drawingSelectedTool = "pencil";
let imgDataCanvas;

//pozitia mouse-ului in canvas
let canvasMousePozX; 
let canvasMousePozY; 

//sterge toata zona poentru desenat
function clearCanvas(event)
{
    if (event.target.id === "clearBtn"){
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
}

//actualizeaza culoarea si grosimea uneltei de desen
function changeDrawParameters(event)
{
    if (event.target.id === "stroke"){
        ctx.strokeStyle = event.target.value;
        ctx.fillStyle = event.target.value;
        console.log("stroke change");
    }

    if (event.target.id === "lineSize"){
        lineWidth = event.target.value;
        console.log("line change");
    }
}

//coloreaza canvas-ul cu o culoare aleasa
function fillCanvasColor(event)
{
    if (event.target.id === "bkgFill"){
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

//atribuie variabilei drawingSelectedTool valoarea corecta pentru unealta aleasa
function selectTool(event)
{
    if (event.target.id === "drawRectangle"){
        drawingSelectedTool = "rectangle";
    }

    if (event.target.id === "drawCicrle"){
        drawingSelectedTool = "circle";
    }

    if (event.target.id === "drawTriangle"){
        drawingSelectedTool = "triangle";
    }

    if (event.target.id === "pencilBtn"){
        drawingSelectedTool = "pencil";
    }

    if (event.target.id === "drawLine"){
        drawingSelectedTool = "line";
    }

    if (event.target.id === "drawEllipse")
    {
        drawingSelectedTool = "ellipse";
    }
}

//seteaza parametrul care verifica daca utilizatorul deseneaza ca adevarat,
//seteaza pozitia mouse-ului in canvas pentru a nu exista offset-uri din cauza toolbar-ului,
//salveaza image data-ul canvas-ului intr-o variabila pentru a evita erorile la desenarea formelor geometrice
function startDraw(event)
{
    drawingON = true;
    canvasMousePozX = event.offsetX;
    canvasMousePozY = event.offsetY;

   imgDataCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// seteaza parametrul care verifica daca utilizatorul deseneaza ca false,
// si evita creerea unei linii intre 2 puncte cand mouse-ul e ridicat de pe canvas
function stopDraw(event)
{
    drawingON = false;
    ctx.beginPath();
}

//se veridfica valoarea variabilei drawingSelectedTool si se executa 
//instructiunile necesare pentru desenearea formei alese
function draw(event)
{
    if (!drawingON) return;
    ctx.putImageData(imgDataCanvas, 0, 0);
    ctx.lineWidth = lineWidth;

    const cb = document.getElementById('fillCheck');
    
    if (drawingSelectedTool === "pencil"){
        ctx.lineCap = "round";
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    }else 
    if (drawingSelectedTool === "rectangle"){
        if (!cb.checked){
            ctx.strokeRect(event.offsetX, event.offsetY, canvasMousePozX - event.offsetX, canvasMousePozY - event.offsetY);
        }else{
            ctx.fillRect(event.offsetX, event.offsetY, canvasMousePozX - event.offsetX, canvasMousePozY - event.offsetY);
        }
    }else
    if (drawingSelectedTool === "line"){
        ctx.beginPath();
        ctx.moveTo(canvasMousePozX, canvasMousePozY);
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    }else
    if (drawingSelectedTool === "triangle"){
        ctx.beginPath();
        ctx.moveTo(canvasMousePozX, canvasMousePozY);
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.lineTo(canvasMousePozX * 2 - event.offsetX, event.offsetY);
        ctx.closePath();
        ctx.stroke();
        if (cb.checked){
            ctx.fill();
        }
    }else
    if (drawingSelectedTool === "ellipse")
    {
        ctx.beginPath();
        ctx.ellipse(canvasMousePozX, canvasMousePozY, Math.abs(canvasMousePozX - event.offsetX), 
        Math.abs(canvasMousePozY - event.offsetY), 0, 0, 2 * Math.PI);
        ctx.stroke();
        if (cb.checked){
            ctx.fill();
        }
    }
}

//se salveaza intr-un element de tip link informatia de tip URL a canvas-ului,
//apoi aceasta este descarcata pe evenimentul de click a butonului de descarcare
function savePNG(event)
{
    if (event.target.id === "savPng"){
        let imgURL = canvas.toDataURL("image/png");
        const linkImg = document.createElement('a');
        linkImg.href = imgURL;
        linkImg.download = 'Desen';
        linkImg.click();
    }

}


//event listeners pentru butoanele din toolbar
tools.addEventListener('click', fillCanvasColor); //umplerea canvas-ului cu o culoare
tools.addEventListener('change', changeDrawParameters); //actualizarea parametrilor de desen
tools.addEventListener('click', clearCanvas); //golirea canvas-ului
tools.addEventListener('click', selectTool); //selectarea uneltei de desen
tools.addEventListener('click', savePNG); //salvarea canvas-ului curent ca png

//event listeners pentru actiunile mouse-ului in canvas
canvas.addEventListener('mousedown', startDraw); //cand click-ul este apasat, se initiaza desenul
canvas.addEventListener('mouseup', stopDraw); //cand click-ul este lasat, se opreste desenul
canvas.addEventListener('mousemove', draw); //cand mouse-ul se misca, se traseaza desenul cu unealta selectata
canvas.addEventListener('mouseleave', stopDraw); //cand mouse-ul paraseste canvas-ul, se opreste desenul


