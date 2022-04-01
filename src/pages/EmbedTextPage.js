import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import React from 'react';
import DividerBlock from '../components/DividerBlock';
import { ImageContext } from '../contexts/ImageContext';
import { imageDataToImage, replaceBackgroundImageData } from '../ml/model';
import { imageDataFromImage } from '../utils/image';


const EmbedTextPage = () => {
    const [state, dispatch] = React.useContext(ImageContext);
    // const [erase, setErase] = React.useState(true);
    const [initialized, setInitialized] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false)
    const canvasRef = React.useRef();

    const onInitialize = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.height = state.height;
        ctx.putImageData(imageDataFromImage(state.image, state.width, state.height), 0, 0);
        setInitialized(true);
    }

    const addText = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        var x = canvas.width / 2;
        var y = canvas.height / 2;

        ctx.font = '30pt Calibri';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'blue';
        ctx.fillText('Hello World!', x, y);
    }

    const embedText = () => {
        setDisabled(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let bg = imageDataToImage(imageData);
        bg.onload = async () => {
            const bgReplaced = await replaceBackgroundImageData(state.image, bg, state.segmentMap, state.width, state.height);
            ctx.putImageData(bgReplaced, 0, 0);
            setDisabled(false);
        }
    }

    const saveImage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let bg = imageDataToImage(imageData);
        bg.onload = async () => {
            dispatch({
                type: "change_image",
                image: bg
            })
        }
    }



    return (
        <div>
            <Box sx={{ padding: 2 }}>
                <Typography variant="h2">Embed Text [BETA]</Typography>
                {(!state.uploaded || !state.segmented) && (
                    <Typography>Please upload and segment your image before trying to add text.</Typography>
                )}
                <DividerBlock />
                {(state.uploaded && state.segmented && !initialized) && (
                    <div>
                        <Button variant="contained" onClick={() => { onInitialize(); }}>Initialize drawing canvas</Button>
                    </div>
                )}
                {(state.uploaded && state.segmented && initialized) && (
                    <div>
                        <ButtonGroup size="small" variant="outlined">
                            <Button onClick={() => addText()}>
                                Add Text
                            </Button>
                        </ButtonGroup>
                    </div>
                )}
                <br></br>
                <canvas width={513} ref={canvasRef}></canvas>
                <br></br>
                {(state.uploaded && state.segmented && initialized) && (<div>
                    <ButtonGroup>
                        <Button variant="contained" onClick={() => embedText()} disabled={disabled}>Embed Text</Button>
                        <Button variant="contained" onClick={() => saveImage()}>Save Image</Button>
                    </ButtonGroup>
                </div>
                )}
            </Box>
        </div>
    );
}

export default EmbedTextPage