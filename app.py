from http.server import SimpleHTTPRequestHandler, HTTPServer
  
print(access to localhost:8000)
server = HTTPServer(('', 8000), SimpleHTTPRequestHandler)
server.serve_forever()