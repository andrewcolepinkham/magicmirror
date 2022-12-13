from flask import Flask
import git

repo = git.Repo('magicmirror')

app = Flask(__name__)

@app.route("/")
def hello():
    return "hello world"

@app.route("/boot")
def setup():
    print("booting")
    print(repo.remotes.origin.pull())
    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)