#!/usr/bin/env python3
"""
Local preview server for the Ace Prime static site.

Vercel applies the rewrites in vercel.json (e.g. /about -> /about.html)
when this site is actually deployed. Opening the files directly, or
serving them with a plain static server, doesn't know about those
rewrites, so every link except the homepage 404s.

This script reads vercel.json and applies the same rewrites locally,
so clicking around at http://localhost:8000 behaves the same way it
will once it's live on Vercel.

Usage:
    python3 serve.py
    (then open http://localhost:8000)
"""
import http.server
import json
import os
import socketserver

PORT = 8000
REWRITES = {}

with open("vercel.json") as f:
    config = json.load(f)
    for rule in config.get("rewrites", []):
        REWRITES[rule["source"]] = rule["destination"]


class RewriteHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split("?")[0]
        if path in REWRITES:
            self.path = REWRITES[path]
        super().do_GET()


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(("", PORT), RewriteHandler) as httpd:
        print(f"Serving Ace Prime at http://localhost:{PORT}")
        print("Press Ctrl+C to stop.")
        httpd.serve_forever()
