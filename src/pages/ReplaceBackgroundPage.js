import { Box, Button, ButtonGroup, Card, CardActions, CardHeader, CardMedia, Divider, styled, Typography } from '@mui/material';
import React from 'react';
import { ImageContext } from "../contexts/ImageContext"
import { Grid } from "@mui/material"
import { LoadingButton } from '@mui/lab';
import { getDimsImg, getResizedDims } from '../utils/image';
import { Link } from "react-router-dom"
import { replaceBackground } from '../ml/model';
import DividerBlock from '../components/DividerBlock';


const Input = styled('input')({
    display: 'none',
})

const ReplaceBackgroundPage = () => {
    const [state, dispatch] = React.useContext(ImageContext);
    const [loading, setLoading] = React.useState(false);
    const [replacedBG, setReplacedBG] = React.useState(null);
    const [modified, setModified] = React.useState(false);

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
            console.log(newDims)
            console.log(state.height)
            elem.width = newDims.width;
            elem.height = state.height

            var ctx = elem.getContext('2d');
            ctx.drawImage(predict_Image, 0, 0, elem.width, elem.height);

            var srcEncoded = ctx.canvas.toDataURL('image/png', 1);

            const resized_image = new Image(newDims.width, state.height);
            resized_image.src = srcEncoded;
            resized_image.onload = async () => {
                dispatch({ type: "add_background", background: resized_image, backgroundUploaded: true })
                setLoading(false)
            }
        }
    }
    const replaceBG = async () => {
        setLoading(true)
        let bgRemoved;
        bgRemoved = await replaceBackground(state.image, state.background, state.segmentMap, state.width, state.height);
        setReplacedBG(bgRemoved);
        setModified(true)
        setLoading(false);
    }

    const saveImage = () => {
        dispatch({
            type: "change_image",
            image: replacedBG
        })
    }
    return (
        <div>
            <Box sx={{ padding: 2 }}>
                <Typography variant="h2">Replace Background</Typography>
                {(!state.uploaded || !state.segmented) && (
                    <div>
                        <Typography variant="body1">Upload an image to start. If you uploaded a image, make sure to <Link to="/segmentationmap">Segment</Link> it.</Typography>
                    </div>
                )}
                {(!state.backgroundUploaded && state.uploaded && state.segmented) && (<div>
                    <Typography variant="body">Upload a background image to start</Typography>
                    <br></br>
                    <Divider />
                    <br></br>
                    <label htmlFor="contained-button-file">
                        <Input accept="image/*" id="contained-button-file" type="file" onChange={(e) => {
                            let files = e.target.files;
                            if (files.length > 0) {
                                updateState(e);
                            }
                        }} />
                        <LoadingButton variant="contained" component="span" loading={loading}>
                            Upload your background
                        </LoadingButton>
                    </label>
                </div>)}
                {(state.uploaded && state.backgroundUploaded && state.segmented) && (<div>
                    <Typography variant="body">Replace your background with another image.</Typography>
                    <DividerBlock />
                    <Grid container spacing={2}>
                        <Grid item>
                            <Card variant="outlined">
                                <CardHeader title="Your Image" />
                                <CardMedia>
                                    <img src={state.image.src} alt="The file you uploaded"></img>
                                </CardMedia>
                                <CardActions>
                                    <Button onClick={() => {
                                        dispatch({ type: "remove_background" })
                                    }} loading={loading}>
                                        Upload New Background
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card variant="outlined">
                                <CardHeader title="Your Background Image" />
                                <CardMedia>
                                    <img src={state.background.src} alt="The file you uploaded"></img>
                                </CardMedia>
                                <CardActions>
                                    <LoadingButton onClick={() => replaceBG()} loading={loading}>
                                        Replace Background
                                    </LoadingButton>
                                </CardActions>
                            </Card>
                        </Grid>
                        {modified && (
                            <Grid item>
                                <Card variant="outlined">
                                    <CardHeader title="Replaced Background" />
                                    <CardMedia>
                                        <img src={replacedBG.src} alt="The file you uploaded with it background replaced"></img>
                                    </CardMedia>
                                    <CardActions>
                                        <ButtonGroup variant="text">
                                            <Link to="/editmaskpage" style={{ textDecoration: 'none' }}>
                                                <LoadingButton loading={loading}>
                                                    Edit Mask
                                                </LoadingButton>
                                            </Link>
                                            <Button onClick={() => { saveImage() }}>
                                                Save Image
                                            </Button>
                                        </ButtonGroup>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )}
                    </Grid>

                </div>)}
            </Box>
        </div>
    );
}

export default ReplaceBackgroundPage;