from flask import Flask, render_template
import os

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    # Change to False and set host='0.0.0.0' to allow external connections
    app.run(debug=True, host='localhost', port=5000)
