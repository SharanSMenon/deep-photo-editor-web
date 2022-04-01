import { AppBar, Button, Drawer, IconButton, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import React from "react";
import "./Header.css";
import { Link } from "react-router-dom"
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const Header = () => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const pages = ["/", "/segmentationmap", "/bgremove", "/bgreplace", "/embedtext"];
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setDrawerOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                        <Box role="presentation">
                            <List>
                                <IconButton
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    sx={{ ml: 1 }}
                                    onClick={() => setDrawerOpen(false)}
                                >
                                    <MenuIcon />
                                </IconButton>
                                {["Home page", "Segment Image", "Remove Background", "Replace Background", "Embed Text [BETA]"].map((text, index) => (
                                    <Link to={pages[index]} style={{ textDecoration: 'none', color:'black'}} key={index}>
                                        <ListItem button key={text}>
                                            <ListItemText primary={text} />
                                        </ListItem>
                                    </Link>
                                ))}
                            </List>
                            <Divider />
                        </Box>
                    </Drawer>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/" className="link">
                            Deep Photo Editor
                        </Link>
                    </Typography>
                    <Button color="inherit">
                        <Link to="/upload" className="link"> Upload File </Link>
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Header;