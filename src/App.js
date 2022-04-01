import Header from './components/Header';
import "./App.css";
import React from "react"
import { Routes, Route } from 'react-router-dom';
import UploadFilePage from './pages/UploadFilePage';
import Home from './pages/HomePage';
import RemoveBackgroundPage from './pages/RemoveBackgroundPage';
import { ThemeProvider } from '@mui/system';
import { theme } from "./utils/theme"
import { Box, CircularProgress, CssBaseline } from '@mui/material';
import { ImageProvider } from './contexts/ImageContext';
import ViewSegmentationMapPage from './pages/ViewSegmentationMap';
import * as tf from "@tensorflow/tfjs";
import { loadDeepLabModel } from './ml/model';
import EditMaskPage from './pages/EditMaskPage';
import ReplaceBackgroundPage from './pages/ReplaceBackgroundPage';
import EmbedTextPage from './pages/EmbedTextPage';


function App() {
  const [loading, setLoading] = React.useState(true);
  const [model, setModel] = React.useState(null);

  React.useEffect(() => {
    tf.ready().then(async () => {
      console.log(tf.getBackend());
      const mdl = await loadDeepLabModel();
      setModel(mdl);
      setLoading(false);
    })
  }, []);

  return (
    <div className="App">
      <ImageProvider>
        <ThemeProvider theme={theme()}>
          <CssBaseline />
          {loading ? (
            <div>
              <Box sx={{ display: 'flex', alignItems:"center", justifyContent:"center", height:"100vh"}}>
                <CircularProgress />
              </Box>
            </div>
          ) : (<div>
            <Header />
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/upload" element={<UploadFilePage />}></Route>
              <Route path="/bgremove" element={<RemoveBackgroundPage model={model}/>}></Route>
              <Route path="/embedtext" element={<EmbedTextPage/>}></Route>
              <Route path="/segmentationmap" element={<ViewSegmentationMapPage model={model}/>}></Route>
              <Route path="/editmaskpage" element={<EditMaskPage model={model}/>}></Route>
              <Route path="/bgreplace" element={<ReplaceBackgroundPage model={model}/>}></Route>
            </Routes>
          </div>)}
        </ThemeProvider>
      </ImageProvider>
    </div>
  );
}

export default App;
