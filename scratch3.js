const http = require('http');

async function run() {
  const data = JSON.stringify({
    title: "Test",
    documentType: "PASSPORT",
    fileDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...",
    originalFilename: "test.jpg",
    fileSizeBytes: 1024,
    mimeType: "image/jpeg"
  });

  const req = http.request('http://localhost:3000/api/documents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('Documents response:', res.statusCode, body);
      if (res.statusCode === 200) {
        const doc = JSON.parse(body).document;
        // Test verification process
        const data2 = JSON.stringify({
          documentId: doc.id,
          fileDataUrl: data.fileDataUrl,
          documentType: "PASSPORT"
        });
        const req2 = http.request('http://localhost:3000/api/verification/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data2)
          }
        }, (res2) => {
          let body2 = '';
          res2.on('data', chunk => body2 += chunk);
          res2.on('end', () => console.log('Process response:', res2.statusCode, body2));
        });
        req2.write(data2);
        req2.end();
      }
    });
  });
  req.write(data);
  req.end();
}

run();
