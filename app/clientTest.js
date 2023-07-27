import fetch from 'node-fetch';

async function sendTestData() {
    const rawResponse = await fetch('http://localhost:3000/linkUpload', {
      method: 'POST',
      headers: {
        'Accept': '*',
        'Content-Type': 'text/plain'
      },
      body: 'Hello world'
    });
    const content = await rawResponse.json();
  
    console.log(content);
  };

  sendTestData();