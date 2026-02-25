from __future__ import annotations

from pathlib import Path
import re

import streamlit as st
import streamlit.components.v1 as components


APP_DIR = Path(__file__).parent
INDEX_PATH = APP_DIR / "index.html"
CSS_PATH = APP_DIR / "styles.css"
JS_PATH = APP_DIR / "app.js"


def build_embedded_app() -> str:
    html = INDEX_PATH.read_text(encoding="utf-8")
    css = CSS_PATH.read_text(encoding="utf-8")
    js = JS_PATH.read_text(encoding="utf-8")

    # Inline local assets so the app works inside Streamlit's iframe.
    html = re.sub(
        r'<link[^>]*href="styles\.css"[^>]*>',
        f"<style>{css}</style>",
        html,
        count=1,
    )
    html = re.sub(
        r'<script[^>]*src="app\.js"[^>]*></script>',
        f"<script>{js}</script>",
        html,
        count=1,
    )

    return html


st.set_page_config(
    page_title="Beef Cut Fit Analyzer",
    layout="wide",
)

st.markdown(
    """
    <style>
    .block-container {
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 0;
        padding-right: 0;
        max-width: none;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

components.html(build_embedded_app(), height=2800, scrolling=True)
