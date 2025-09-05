import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Context/auth.jsx'
import {RecipeProvider} from './Context/recipes.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RecipeProvider>
    <App />
    </RecipeProvider>
    </AuthProvider>
  </StrictMode>,
)
