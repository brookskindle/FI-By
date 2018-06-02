# FI Hacks
Life hacks to achieve financial independence and early retirement. Check it out
at https://brookskindle.github.io/fihacks

## Installation
### Docker
If you've got `docker` installed, you can get this site up and running in no
time.

```bash
docker build -t fihacks .  # Build the docker image
docker run -p 5000:80 fihacks  # Run the app: navigate to http://localhost:5000
```
### Pip
If you'd rather use plain old `pip`, that's fine too. This app runs on python
3.6 so your mileage may vary if using a different version.

```bash
pip install -r requirements.txt
FLASK_APP=app.py flask run --port 80
```
