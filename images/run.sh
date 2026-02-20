#!/bin/bash 

S=300s
C=$1

echo ======= ARALEZ =======
./oha-linux-amd64 -c $C -z $S --urls-from-file aralez-mixed-2.txt  --no-tui --insecure &
./oha-linux-amd64 -c $C -z $S --urls-from-file aralez-mixed-2.txt  --no-tui --insecure -D example.json -m POST &
wait
echo ======= HAPROXY =======
./oha-linux-amd64 -c $C -z $S --urls-from-file haproxy-mixed-2.txt --no-tui --insecure &
./oha-linux-amd64 -c $C -z $S --urls-from-file haproxy-mixed-2.txt --no-tui --insecure -D example.json -m POST &
wait
echo ======= ENVOY =======
./oha-linux-amd64 -c $C -z $S --urls-from-file envoy-mixed-2.txt   --no-tui --insecure &
./oha-linux-amd64 -c $C -z $S --urls-from-file envoy-mixed-2.txt   --no-tui --insecure -D example.json -m POST &
wait
echo ======= NGINX =======
./oha-linux-amd64 -c $C -z $S --urls-from-file nginx-mixed-2.txt   --no-tui --insecure &
./oha-linux-amd64 -c $C -z $S --urls-from-file nginx-mixed-2.txt   --no-tui --insecure -D example.json -m POST &
wait
echo ======= TRAEFIK =======
./oha-linux-amd64 -c $C -z $S --urls-from-file traefik-mixed-2.txt --no-tui --insecure &
./oha-linux-amd64 -c $C -z $S --urls-from-file traefik-mixed-2.txt --no-tui --insecure -D example.json -m POST &
wait
echo ======= CADDY =======
./oha-linux-amd64 -c $C -z $S --urls-from-file caddy-mixed-2.txt   --no-tui --insecure &
./oha-linux-amd64 -c $C -z $S --urls-from-file caddy-mixed-2.txt   --no-tui --insecure -D example.json -m POST &
wait
echo ====================
echo ======= DONE =======
echo ====================

