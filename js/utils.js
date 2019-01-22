const drawImage = (canvas, image) => {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0,0, canvas.width, canvas.height);
};

const loadImage = async src => {
    const image = new Image();
    image.src = src;

    const isLoaded = image.complete && image.naturalHeight > 0;

    if (isLoaded) {
        return image;
    }

    return new Promise( (resolve, reject) => 
        image.addEventListener('load', () => resolve(image), false)
    );
};