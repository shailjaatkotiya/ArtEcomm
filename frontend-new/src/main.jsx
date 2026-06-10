import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// NOTE: StrictMode intentionally omitted — its dev double-mount force-loses
// the WebGL context under react-three-fiber, leaving the 3D background blank.
createRoot(document.getElementById('root')).render(<App />)
