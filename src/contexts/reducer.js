export const reducer = (state, action) => {
    switch (action.type) {
        case "add_image":
            return {
                ...state,
                image: action.image,
                uploaded: action.uploaded,
                segmentMap: new Uint8ClampedArray(),
                classes: [],
                segmented: false
            }
        case "add_segmentation":
            return {
                ...state,
                classes: action.classes,
                segmented: action.segmented,
                segmentMap: action.segmentMap,
                width: action.width,
                height: action.height
            }
        case "edit_segmentation_map":
            return {
                ...state,
                segmentMap: action.segmentMap,
            }
        case "add_background":
            return {
                ...state,
                background: action.background,
                backgroundUploaded: action.backgroundUploaded
            }
        case "remove_background":
            return {
                ...state,
                background: new Image(),
                backgroundUploaded: false
            }
        case "change_image":
            return {
                ...state,
                image: action.image,
            }
        default:
            return state
    }
}

export const initialState = {
    image: new Image(),
    background: new Image(),
    segmentMap: new Uint8ClampedArray(),
    uploaded: false,
    backgroundUploaded: false,
    classes: [],
    segmented: false,
    width: 0,
    height:0,
}