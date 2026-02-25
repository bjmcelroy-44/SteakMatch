# Beef Cut Fit Analyzer

A Streamlit app that asks 22 short questions and returns:

- One clear top cut recommendation
- Fit brief
- Why this works
- Cooking profile
- Level-based alternatives (Levels 1-4)
- Cooking tips and tricks

All recommendation logic runs server-side in Python.

## Run locally

```bash
cd "/Users/bobbymcelroy/Documents/Steak Personality Test"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run streamlit_app.py
```

## Runtime architecture

- `streamlit_app.py`: Native Streamlit UI and question flow.
- `server_engine.py`: Server-side recommendation engine and scoring logic.
- `data/engine_data.json`: Question pool, cut inventory, tier settings, and tip data.

`app.js` remains as source material used to export data to `engine_data.json`, but it is not required at runtime for Streamlit.

## How scoring works

1. Start from a neutral 6-trait profile (`5/10` each).
2. Ask 2 intake questions (comfort + cuisine), then build dynamic follow-up questions.
3. Expand to a full 22-question set using rotating variants and history-aware selection.
4. Apply answer effects and operational signals to build the user profile.
5. Rank cuts by normalized distance plus fit adjustments (method, budget, familiarity, cuisine, portion, bone, smoke, cook window, and more).
6. Always return a top cut plus level-based alternatives and tips.
