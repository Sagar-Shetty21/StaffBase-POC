#!/bin/bash
docker cp ./backend/pb_data pocketbase:/pb_data
docker cp ./backend/public pocketbase:/pb_public
