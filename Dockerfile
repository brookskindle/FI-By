# This project uses python 3.6
FROM python:3.6-slim

WORKDIR /app
ADD . /app
RUN pip install -r requirements.txt

# Listen on port 80 by default. However, if you're running a docker image
# solely for development purposes, you can run
#   docker run -p 5000:80 <image>
# to have docker remap all port 5000 traffic to port 80 internally
EXPOSE 80
ENV FLASK_APP app.py

# Accept connections from any host
CMD ["flask", "run", "--port", "80", "--host", "0.0.0.0"]
