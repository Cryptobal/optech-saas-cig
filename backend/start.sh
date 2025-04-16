#!/bin/bash

echo "Starting application..."
echo "Current directory: $(pwd)"
echo "Files in current directory: $(ls -la)"
echo "Environment variables:"
env
echo "Starting uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --log-level debug 