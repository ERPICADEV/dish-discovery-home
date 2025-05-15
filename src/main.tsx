
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check if Supabase environment variables are set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables are missing. Some features like image uploads will not work.');
}

createRoot(document.getElementById("root")!).render(<App />);
