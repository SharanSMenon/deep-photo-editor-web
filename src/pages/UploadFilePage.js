import { LoadingButton } from "@mui/lab";
import { Box, styled, Typography } from "@mui/material";
import React from "react";
import DividerBlock from "../components/DividerBlock";
import { ImageContext } from "../contexts/ImageContext";
import { getDimsImg, getResizedDims } from "../utils/image";
import "./UploadFile.css";

const Input = styled('input')({
    display: 'none',
})


const UploadFilePage = () => {
    const [state, dispatch] = React.useContext(ImageContext);
    const [loading, setLoading] = React.useState(false);

    const updateState = async (e) => {
        setLoading(true)
        const MAX_WIDTH = 513;
        let file = e.target.files[0]
        const fileOBJ = URL.createObjectURL(file)
        const { height, width } = await getDimsImg(fileOBJ);
        const newDims = getResizedDims(width, height, MAX_WIDTH);
        const predict_Image = new Image(width, height);
        predict_Image.src = fileOBJ;
        predict_Image.onload = async () => {
            var elem = document.createElement('canvas');

            elem.width = newDims.width;
            elem.height = newDims.height

            var ctx = elem.getContext('2d');
            ctx.drawImage(predict_Image, 0, 0, elem.width, elem.height);

            var srcEncoded = ctx.canvas.toDataURL('image/png', 1);

            const resized_image = new Image(newDims.width, newDims.height);
            resized_image.src = srcEncoded;
            resized_image.onload = async () => {
                dispatch({ type: "add_image", image: resized_image, uploaded: true })
                console.log("Image Uploaded")
                setLoading(false)
            }
        }
    }
    return (
        <div>
            <Box sx={{ padding: 2 }}>
                <div>
                    <Typography variant="h2">Upload a File</Typography>
                    <Typography variant="body1">Click the button below to upload an image. 
                    If you have already uploaded an image, you can click the button again to upload a new image </Typography>
                    <DividerBlock />
                    <label htmlFor="contained-button-file">
                        <Input accept="image/*" id="contained-button-file" type="file" onChange={(e) => {
                            let files = e.target.files
                            if (files.length > 0) {
                                updateState(e);
                            }
                        }} />
                        <LoadingButton variant="contained" component="span" loading={loading}>
                            Upload your Image
                        </LoadingButton>
                    </label>
                    <br></br>
                    {state.uploaded && (
                        <img
                            src={state.image.src}
                            alt="The file you uploaded"></img>
                    )}
                </div>
            </Box>
        </div>
    );
}

export default UploadFilePage;