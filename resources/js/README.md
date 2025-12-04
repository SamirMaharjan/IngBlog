React SPA for Laravel (resources/js)

How to install
1. Unzip the files into your Laravel project's `resources/js` directory OR copy the files into `resources/js`.
   - You should end up with:
     - resources/js/app.jsx
     - resources/js/react-blog-client.jsx
     - resources/js/main.jsx
     - resources/js/app.css

2. If your Laravel app uses Vite (Laravel 9+), open your Blade layout and add a div with id="app" where you want the SPA to render:
     <div id="app"></div>

3. In your Blade layout include the Vite entry:
   @vite(['resources/js/main.jsx'])

4. Install frontend dependencies in your Laravel project root:
   npm install react react-dom react-router-dom

5. Add env variable in your Laravel `.env` (for Vite):
   VITE_API_BASE=http://localhost:8000/api

6. Run the Vite dev server or build:
   npm run dev
   or
   npm run build

Notes
- This is a simple SPA that consumes the API endpoints at VITE_API_BASE (see README in backend zip).
- For styling, optionally set up Tailwind CSS in Laravel and import its CSS in app.css or replace app.css.
