import { LoadingButton } from "@mui/lab";
import { Box, Typography, Grid, Button, Card, CardMedia, CardHeader, CardActions, ButtonGroup } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import DividerBlock from "../components/DividerBlock";
import { ImageContext } from "../contexts/ImageContext";
import { processSegMap, removeBackground } from "../ml/model";



const RemoveBackgroundPage = ({ model }) => {
    const [state, dispatch] = React.useContext(ImageContext);
    const [loading, setLoading] = React.useState(false);
    const [removedBG, setRemovedBG] = React.useState(null);
    const [modified, setModified] = React.useState(false);

    const removeBG = async () => {
        setLoading(true)
        let bgRemoved;
        if (!state.segmented) {
            const segmentation = await model.segment(state.image);
            const classes = Object.keys(segmentation.legend).slice(1);
            const segmentMap = processSegMap(segmentation.segmentationMap);
            bgRemoved = await removeBackground(state.image, segmentMap, segmentation.width, segmentation.height);
            dispatch({
                type: "add_segmentation",
                classes: classes,
                segmentMap: segmentMap,
                width: segmentation.width,
                height: segmentation.height,
                segmented: true
            })
            bgRemoved = await removeBackground(state.image, segmentMap, segmentation.width, segmentation.height);
        } else {
            bgRemoved = await removeBackground(state.image, state.segmentMap, state.width, state.height);
        }
        setRemovedBG(bgRemoved);
        setModified(true)
        setLoading(false);
    }

    const saveImage = () => {
        dispatch({
            type: "change_image",
            image: removedBG
        })
    }

    return (
        <div>
            <Box sx={{ padding: 2 }}>
                {!state.uploaded &&
                    (<Typography variant="body1">Please upload an Image.</Typography>)
                }
                {state.uploaded && (
                    <div>
                        <div>
                            <Typography variant="h2">Remove Background</Typography>
                            <Typography variant="body1">Click the Remove background button to remove the background. This function will
                                remove the black portions as shown in the segmentation map. You can edit the segmentation map.</Typography>
                            <DividerBlock />
                        </div>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Card variant="outlined">
                                    <CardHeader title="Your Image" />
                                    <CardMedia>
                                        <img src={state.image.src} alt="The file you uploaded"></img>
                                    </CardMedia>
                                    <CardActions>
                                        <LoadingButton onClick={() => removeBG()} loading={loading}>
                                            Remove Background
                                        </LoadingButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                            {modified && (
                                <Grid item>
                                    <Card variant="outlined">
                                        <CardHeader title="Removed Background" />
                                        <CardMedia>
                                            <img src={removedBG.src} alt="The file you uploaded"></img>
                                        </CardMedia>
                                        <CardActions>

                                            
                                            <ButtonGroup variant="text">
                                                <Link to="/editmaskpage" style={{ textDecoration: 'none' }}>
                                                    <LoadingButton loading={loading}>
                                                        Edit Mask
                                                    </LoadingButton>
                                                </Link>
                                                <Button onClick={() => saveImage()}>
                                                    Save Image
                                                </Button>
                                            </ButtonGroup>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    </div>
                )}

            </Box>
        </div>
    );
}

export default RemoveBackgroundPage;