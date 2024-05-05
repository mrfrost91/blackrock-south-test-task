import { Routes, Route } from 'react-router-dom';
import './App.css'
import { ImageViewer } from './components/ImageViewer';
import { Button } from './components/Button';
import { ROUTES } from './constants';

function App() {
  return (
    <Routes>
      <Route path={ROUTES.root} element={<ImageViewer />} />
      <Route path={ROUTES.button} element={<Button />} />
    </Routes>
  )
}

export default App
