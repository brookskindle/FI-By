from flask import Flask, render_template
from flask_frozen import Freezer

app = Flask(__name__)
app.config["FREEZER_BASE_URL"] = "https://brookskindle.github.io/fihacks"
freezer = Freezer(app)


@app.cli.command()
def freeze():
    """Freeze the site into a set of static files"""
    freezer.freeze()


@app.route("/")
def index():
    return render_template("index.html")
