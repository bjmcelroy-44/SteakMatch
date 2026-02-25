# Beef Cut Fit Analyzer

A lightweight web app that asks 22 rapid preference + culinary questions and returns:

- Beef Preference Profile Summary
- Tiered recommendations (Tier 1-4)
- Executive fit brief
- Cooking guidance
- Cut-specific cooking tips and tricks
- Deep cut inventory (mainstream + underutilized institutional cuts)
- Rotating prompt variants (same core categories, different wording run-to-run)

## Run locally

Open `/Users/bobbymcelroy/Documents/Steak Personality Test/index.html` directly in a browser, or run a static server:

```bash
cd "/Users/bobbymcelroy/Documents/Steak Personality Test"
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

### Run via Streamlit locally

```bash
cd "/Users/bobbymcelroy/Documents/Steak Personality Test"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run streamlit_app.py
```

## Project files

- `index.html` - App layout and content regions
- `styles.css` - Visual system, responsive design, and animations
- `app.js` - Questions, scoring engine, cut profiles, and result rendering

## How scoring works

1. Each user starts at a neutral profile (`5/10`) on six traits.
2. One question from each category is selected from a rotating wording pool.
3. Each selected answer applies weighted adjustments to those traits.
4. The final profile is compared against each cut profile.
5. Compatibility uses normalized Euclidean distance and then applies fit adjustments for method, budget, cut comfort, portion/format, bone preference, smoke level, cook window, fat-cap preference, and occasion.
6. Close-score outcomes include clear alternatives in Tier 1 while still returning a top recommendation.
7. Results are organized into Tier 1-4 recommendation buckets plus a profile summary.

## Tune it for your audience

In `app.js`:

- Edit `BASE_QUESTIONS`, `ALT_QUESTION_COPY`, and `ALT_QUESTION_COPY_2` to tune rotating question wording and effects.
- Edit `CUTS` to adjust cut profiles and guidance.
- Edit `COOKING_TIPS_DB` to expand or refine cut-level and family-level tips.
- Edit `buildFitNotes()` and `getTopAlignmentReasons()` to change explanation language.
