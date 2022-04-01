import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { ImageContext } from '../contexts/ImageContext';


const EditMaskPage = () => {
    const [state, dispatch] = React.useContext(ImageContext);
    const [erase, setErase] = React.useState(true);
    const canvasRef = React.useRef();

    React.useEffect(() => {
        let isPainting = false;
        let lineWidth = 5;
        let startX;
        let startY;

        if (state.uploaded && state.segmented) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.height = state.height;
            ctx.putImageData(getSegmentationMap(), 0, 0);

            canvas.addEventListener('mousedown', (e) => {
                isPainting = true;
                startX = e.clientX;
                startY = e.clientY;
            });

            canvas.addEventListener('mouseup', e => {
                isPainting = false;
                ctx.stroke();
                ctx.beginPath();
            });

            const draw = (e) => {
                if (!isPainting) {
                    return;
                }

                ctx.lineWidth = lineWidth;
                ctx.lineCap = 'round';

                ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
                ctx.stroke();
            }

            canvas.addEventListener('mousemove', draw);
        }
    }, [])

    const saveSegmentationMap = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        dispatch({ type: "edit_segmentation_map", segmentMap: imageData.data });
    }


    const getSegmentationMap = () => {
        const map = state.segmentMap;
        const { width, height } = state;
        const segmentationMapData = new ImageData(map, width, height);
        return segmentationMapData;
    }

    return (
        <div>
            <Box sx={{padding:2}}>
            <Typography variant="h2">Edit Mask</Typography>
            {(!state.uploaded || !state.segmented) && (
                <Typography>Please upload and segment your image before trying to edit your mask.</Typography>
            )}
            {(state.uploaded && state.segmented) && (
                <div>
                    <canvas width={513} ref={canvasRef}></canvas>
                    <br></br>
                    <Button onClick={() => { saveSegmentationMap() }}>Save Map</Button>
                    <Button onClick={() => {
                        setErase(!erase)
                        const canvas = canvasRef.current;
                        const ctx = canvas.getContext('2d');
                        ctx.strokeStyle = erase ? "black" : "white";
                    }}>Switch to {erase ? "Add mode" : "Erase Mode"}</Button>
                </div>
            )}
            </Box>
        </div>
    );
}

export default EditMaskPage