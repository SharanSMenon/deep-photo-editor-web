import { LoadingButton } from "@mui/lab";
import { Box, Card, CardActions, CardContent, CardHeader, CardMedia, Chip, Grid, Typography } from "@mui/material";
import React from "react";
import DividerBlock from "../components/DividerBlock";
import { ImageContext } from "../contexts/ImageContext";
import { imageDataToImage, processSegMap } from "../ml/model";
// import { getDimsImg } from "../utils/image";
import "./UploadFile.css"



const ViewSegmentationMapPage = ({ model }) => {
    const [state, dispatch] = React.useContext(ImageContext);
    const [loading, setLoading] = React.useState(false);

    const getSegmentation = async () => {
        setLoading(true)
        const segmentation = await model.segment(state.image);
        console.log(segmentation)
        const classes = Object.keys(segmentation.legend).slice(1);
        dispatch({
            type: "add_segmentation",
            classes: classes,
            segmentMap: processSegMap(segmentation.segmentationMap),
            width: segmentation.width,
            height: segmentation.height,
            segmented: true
        })
        setLoading(false);
    }

    const getSegmentationMap = () => {
        const map = state.segmentMap;
        const { width, height } = state;
        const segmentationMapData = new ImageData(map, width, height);
        const image = imageDataToImage(segmentationMapData)
        return image.src;
    }

    return (
        <div>
            <Box sx={{ padding: 2 }}>
                <div>
                    <Typography variant="h2">Segment the image</Typography>
                    {!state.uploaded &&
                        (<Typography variant="body1">Please upload an Image.</Typography>)
                    }
                    {state.uploaded && (
                        <div>
                            <Typography variant="body1">Click the segment button to segment the image. </Typography>
                            <DividerBlock />
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Card variant="outlined">
                                        <CardHeader title="Your Image" />
                                        <CardMedia>
                                            <img src={state.image.src} alt="The file you uploaded"></img>
                                        </CardMedia>
                                        <CardActions>
                                            <LoadingButton onClick={() => getSegmentation()} loading={loading}>
                                                Segment Image
                                            </LoadingButton>
                                        </CardActions>

                                    </Card>
                                </Grid>
                                {state.segmented && (
                                    <Grid item>
                                        <Card variant="outlined" sx={{ maxWidth: 300 }}>
                                            <CardHeader title="Segmentation Map" />
                                            <CardMedia>
                                                <img src={getSegmentationMap()} alt="The file you uploaded"></img>
                                            </CardMedia>
                                            <CardContent>
                                                <Typography variant="body1">Classes Found: </Typography>
                                                {state.classes.map((className, index) => (<Chip key={index} label={className} />))}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        </div>
                    )}
                </div>
            </Box>
        </div>
    );
}

export default ViewSegmentationMapPage;