const addFilterToImage = (canvas, currentFilter) => {
    let ctx = canvas.getContext('2d');
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let imageDataFiltered;

    currentFilter === 'greyscale' && (imageDataFiltered = grayscale(imageData));
    currentFilter === 'threshold' && (imageDataFiltered = threshold(imageData));
    currentFilter === 'sepia' && (imageDataFiltered = sepia(imageData));
    currentFilter === 'none' && (imageDataFiltered = clearFilter(imageData, ctx));

    ctx.putImageData(imageDataFiltered, 0, 0);
};

const clearFilter = (imageData, ctx) => {
    return imageData;
};

const sepia = imageData => {
    let pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
        
        pixels[i] = (r * 0.393) + (g * 0.769) + (b * 0.189); // red
        pixels[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168); // green
        pixels[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131); // blue
    }
    return imageData;
};

const grayscale = imageData => {
    let pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];

        pixels[i] = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
        pixels[i + 1] = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
        pixels[i + 2] = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
    }
    return imageData;
};

const threshold = imageData => {
  let pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
      
    var r = pixels[i];
    var g = pixels[i + 1];
    var b = pixels[i + 2];
      
    var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 95) ? 255 : 0;
      
    pixels[i] = pixels[i + 1] = pixels[i + 2] = v
  }
  return imageData;
};