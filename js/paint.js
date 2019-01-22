const first = selector => document.querySelector(selector);

const canvas = first('#canvas');
const pensilButton = first('.pensil');
const clearButton = first('.clear-button');
const eraserButton = first('.eraser');
const lineSize = first('.line-size');
const saveButton = first('.save');
const loadButton = first('.load');
const backButton = first('.back-changes');
const prewButton = first('.prew-changes');
const panel = first('.panel');
const fileButton = first('.file');
const greyscaleFilter = first('.grayscale');
const contrastFilter = first('.contrast');
const sepiaFilter = first('.sepia');
const noFilter = first('.no-filter');

let isMouseDown = false;
let drawTool = 'pen';
let savedImage = [];
let coords = [];
let deleteLine = [];
let inRange = true;
let imgSrc = '';

const drawEraser = (x, y) => drawLine(x, y, true, '#ffffff');

const drawLine = (x, y, isDraw, color, radius = lineSize.value) => {
    const ctx = canvas.getContext('2d');
    const colorEl = first('#color-change');

    color = !color ? colorEl.value : color;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = radius * 2;
    ctx.lineTo(x, y);
    ctx.stroke()
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (isDraw) {
        coords.push({
            coordX: x,
            coordY: y,
            pointColor: color, 
            pointRadius: radius
        });
    }
};

const draw = ({ offsetX, offsetY }) => {
    if (!isMouseDown) {
        return false;
    }
    (drawTool === 'pen' ? drawLine : drawEraser)(offsetX, offsetY, true); 
};

const clearCanvas = () => {
    localStorage.setItem('clear', JSON.stringify(savedImage));
    savedImage = [];
    imgSrc = '';
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
};

const onDrawToolChanged = () => {
    const isPen = drawTool === 'pen';

    canvas.classList.add(isPen ? 'pensil-cursor' : 'eraser-cursor');
    canvas.classList.remove(isPen ? 'eraser-cursor' : 'pensil-cursor');

    pensilButton.classList[isPen ? 'add' : 'remove']('active');
    eraserButton.classList[isPen ? 'remove' : 'add']('active');
};

const selectDrawTool = newDrawTool => {
    drawTool = newDrawTool;
    onDrawToolChanged();
};

const onLineSizeChange = ({ target }) => first('.show-line-size').innerHTML = target.value;

const onMouseUp = () => {
    isMouseDown = false;
    canvas.getContext('2d').beginPath();
    
    deleteLine = [];
    coords.length > 0 && savedImage.push(coords);
    coords = [];
};

const saveCanvas = data => {
    localStorage.setItem(data, JSON.stringify(savedImage));
    imgSrc.length && localStorage.setItem('image', JSON.stringify(imgSrc));
};

const loadCanvas = async data => {
    let savedCanvas = localStorage.getItem(data);
    let savedImg = localStorage.getItem('image');
    let isImageDraw = false;

    if (!savedCanvas) {
        return false;
    }
    
    clearCanvas();

    savedImage = JSON.parse(savedCanvas);

    if(savedImg) {
        const SRC = JSON.parse(savedImg);
        const img = await loadImage(SRC);
        drawImage(canvas, img);
    }  
    
    
    const processPoint = ({ coordX, coordY, pointColor, pointRadius }) => {
        drawLine(coordX, coordY, false, pointColor, pointRadius)
    };

    const procesLine = line => {
        line.map(processPoint);
        canvas.getContext('2d').beginPath();
    };
    
    savedImage.map(procesLine);
    coords = [];
};

const backChanges = () => {
    const savedCanvas = localStorage.getItem('clear');
    const isEmpty = !savedImage.length && !savedCanvas;
    
    if (isEmpty) {
        return false;
    }

    const reloadCanvas = () => savedImage = JSON.parse(savedCanvas);
    const popLast = () => {
        const lastLine = savedImage.pop();
        deleteLine.push(lastLine);
    };

    const isCanReload = !savedImage.length && savedCanvas;
    isCanReload ? reloadCanvas() : popLast();

    saveCanvas('undoChanges');
    loadCanvas('undoChanges');
};

const prewChanges = () => {
    if (!deleteLine.length) {
        return false;
    }

    const lastLine = deleteLine.pop();
    lastLine && savedImage.push(lastLine);

    saveCanvas('undoChanges');
    loadCanvas('undoChanges');
};


const uploadFile = () => {
    const file = fileButton.files[0];
    const imgUploader = new FileReader();

    const onReceivedResult = async ({ currentTarget }) => {
        imgSrc = currentTarget.result;
        const img = await loadImage(imgSrc);
        drawImage(canvas, img);
    };
        
    imgUploader.addEventListener('load', onReceivedResult, false);
    
    file && imgUploader.readAsDataURL(file);
};


canvas.addEventListener('mousedown', () => isMouseDown = true, false);
canvas.addEventListener('mouseup', onMouseUp, false);
canvas.addEventListener('mouseout', onMouseUp, false);
fileButton.addEventListener('change', uploadFile, false);
clearButton.addEventListener('click', clearCanvas, false);
eraserButton.addEventListener('click', () => selectDrawTool('eraser'), false);
pensilButton.addEventListener('click', () => selectDrawTool('pen'), false);
lineSize.addEventListener('change', onLineSizeChange, false);
saveButton.addEventListener('click', () => saveCanvas('saved'), false);
loadButton.addEventListener('click', () => loadCanvas('saved'), false);
backButton.addEventListener('click', backChanges, false);
prewButton.addEventListener('click', prewChanges, false);
greyscaleFilter.addEventListener('click', () => addFilterToImage(canvas, 'greyscale'), false);
contrastFilter.addEventListener('click', () => addFilterToImage(canvas, 'threshold'), false);
sepiaFilter.addEventListener('click', () => addFilterToImage(canvas, 'sepia'), false);
noFilter.addEventListener('click', () => addFilterToImage(canvas, 'none'), false);
canvas.addEventListener('mousemove', draw, false);