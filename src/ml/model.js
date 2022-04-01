const tf = require('@tensorflow/tfjs');
const deeplab = require('@tensorflow-models/deeplab');
const gpujs = require("gpu.js")
let gpu = new gpujs.GPU({mode:"gpu"})

export const loadDeepLabModel = async () => {
    const model = await deeplab.load({
        base:"pascal",
        quantizationBytes:4
    });
    return model;
}

// export const preprocess = (img) => {
//     let image = tf.browser.fromPixels(img)
//     image = image.toFloat()
//         .div(255.0)
//     return image

// }


export function processSegMap(segMap) {
    for (let i = 0; i < segMap.length; i += 4) {
        const isTrue = (segMap[i] + segMap[i + 1] + segMap[i + 2]) > 0;
        segMap[i] = isTrue ? 255 : 0;
        segMap[i + 1] = isTrue ? 255 : 0;
        segMap[i + 2] = isTrue ? 255 : 0;
        segMap[i + 3] = 255;
    }
    return segMap;

}

export function imageDataToImage(segMap) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = segMap.width;
    canvas.height = segMap.height;
    ctx.putImageData(segMap, 0, 0);

    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
}

export const makeFlatMap = (segmentMap, width, height) => {
    let segmentTensor = tf.tensor(segmentMap, [width, height, 4]);
    segmentTensor.slice()
    segmentTensor = segmentTensor.mean(2);
    return segmentTensor.flatten();
}

export const removeBackground = async (image, segmentMap, width, height) => {
    var segMap = imageDataToImage(new ImageData(Uint8ClampedArray.from(segmentMap), width, height));
    const returnImage = gpu.createKernel(function (imageData, segmentMap) {
        const imagePixel = imageData[this.thread.y][this.thread.x];
        const segPixel = segmentMap[this.thread.y][this.thread.x];
        if (segPixel[0] + segPixel[1] + segPixel[2] > 0) {
            this.color(imagePixel[0], imagePixel[1], imagePixel[2], imagePixel[3]);
        } else {
            this.color(0, 0, 0, 0);
        }
    })
    .setGraphical(true)
    .setOutput([width, height])
    returnImage(image, segMap);
    const newImg = returnImage.getPixels();
    let newImage = imageDataToImage(new ImageData(newImg, width, height));
    return newImage;
}

export const replaceBackground = async (image, background, segmentMap, width, height) => {
    var segMap = imageDataToImage(new ImageData(Uint8ClampedArray.from(segmentMap), width, height));
    const repBG = gpu.createKernel(function (imageData, segmentMap, background) {
        const imagePixel = imageData[this.thread.y][this.thread.x];
        const bgPixel = background[this.thread.y][this.thread.x];
        const segPixel = segmentMap[this.thread.y][this.thread.x];
        if (segPixel[0] + segPixel[1] + segPixel[2] > 0) {
            this.color(imagePixel[0], imagePixel[1], imagePixel[2], imagePixel[3]);
        } else {
            this.color(bgPixel[0], bgPixel[1], bgPixel[2], bgPixel[3]);
        }
    })
    .setGraphical(true)
    .setOutput([width, height])
    repBG(image, segMap, background);
    const newImg = repBG.getPixels();
    let newImage = imageDataToImage(new ImageData(newImg, width, height));
    return newImage;
}

export const replaceBackgroundImageData = async (image, background, segmentMap, width, height) => {
    var segMap = imageDataToImage(new ImageData(Uint8ClampedArray.from(segmentMap), width, height));
    const repBG2 = gpu.createKernel(function (imageData, segmentMap, background) {
        const imagePixel = imageData[this.thread.y][this.thread.x];
        const bgPixel = background[this.thread.y][this.thread.x];
        const segPixel = segmentMap[this.thread.y][this.thread.x];
        if (segPixel[0] + segPixel[1] + segPixel[2] > 0) {
            this.color(imagePixel[0], imagePixel[1], imagePixel[2], imagePixel[3]);
        } else {
            this.color(bgPixel[0], bgPixel[1], bgPixel[2], bgPixel[3]);
        }
    })
    .setGraphical(true)
    .setOutput([width, height])
    repBG2(image, segMap, background);
    const newImg = repBG2.getPixels();
    return new ImageData(newImg, width, height);
}