import { Diamond } from "@mui/icons-material"
import * as tf from "@tensorflow/tfjs";

export const getDimsImg = dataURL => new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
        resolve({
            height: img.height,
            width: img.width
        })
    }
    img.src = dataURL
})

export const getResizedDims = (width, height, MAX_DIM) => {
    if (width >= height) {
        const ratio = width / MAX_DIM
        return {
            width: MAX_DIM,
            height: Math.floor(height / ratio)
        }
    } else {
        const ratio = height / MAX_DIM
        return {
            width: Math.floor(width / ratio),
            height: MAX_DIM
        }
    }
}

export const imageDataFromImage = (image, width, height) => {
    const img = tf.browser.fromPixels(image, 4)
    let uINT8Data = img.dataSync();
    let imageData = new ImageData(Uint8ClampedArray.from(uINT8Data), width, height);
    return imageData
}