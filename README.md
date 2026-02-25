# Beef Cut Fit Analyzer

A browser app that asks 22 rapid preference + culinary questions and returns:

- One clear top cut recommendation
- Fit brief
- Why this works
- Cooking profile
- Level-based alternatives (Levels 1-4)
- Cooking tips and tricks

## Run locally in browser

```bash
cd "/Users/bobbymcelroy/Documents/Steak Personality Test"
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Run via Streamlit

`streamlit_app.py` embeds the same browser app (`index.html` + `styles.css` + `app.js`) so visuals and behavior match localhost.

```bash
cd "/Users/bobbymcelroy/Documents/Steak Personality Test"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run streamlit_app.py
```

## Core files

- `index.html` - App structure and output sections
- `styles.css` - Visual styling
- `app.js` - Questions, scoring, ranking, and rendering logic
- `streamlit_app.py` - Streamlit wrapper that inlines the browser app assets
