# start node server
node app8.js &

# start streaming server
#mjpg_streamer -i "/usr/lib/input_uvc.so -d /dev/video0  -r 640x480 -f 30" -o "/usr/lib/output_http.so -p 8090 -w /var/www/mjpg_streamer" && fg
raspivid -o - -t 9999999 -w 1296 -h 972  | cvlc -vvv stream:///dev/stdin --sout '#standard{access=http,mux=ts,dst=:8080}' :demux=h264
