const { createTheme, useMediaQuery } = require("@mui/material");
const { orange } = require("@mui/material/colors");

export const theme = () => {
    return createTheme({
        status: {
            danger: orange[500],
        },
    });
}