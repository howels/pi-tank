# start node server
node app.js &

# start streaming server
mjpg_streamer -o "/usr/local/lib/output_http.so -w ./www" -i "/usr/local/lib/input_raspicam.so -ISO 800 -x 640 -y 480 -fps 15 -quality 10 -vf -hf -ex night"
