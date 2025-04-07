BASE_URL = 'http://localhost/';

function changeElements(codeElements, endpoint) {
    // Add a button to each pre element
    codeElements.forEach(function(codeElement) {
        
        // replace the code element with an iframe
        const textContent = codeElement.textContent || codeElement.innerText;
        const encodedContent = btoa(textContent);
        // get a UUID   
        const id = crypto.randomUUID().toString();
        const iframe = document.createElement('iframe', { id: id });
        iframe.src = `${BASE_URL}embed/${endpoint}=${encodedContent}&id=${id}`;
        codeElement.replaceWith(iframe);
   
        window.addEventListener('message', function(event) {
            //check which element the message is coming from
            if (event.data.type === 'resize' && event.data.id === id) {
              iframe.style.height = event.data.height + 'px';
            }
          });
        
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // check if BASE_URL is defined and reachable
    fetch(`${BASE_URL}embed/traceview`)
    .then(response => {
        if (!response.ok) {
            console.log('Network response was not ok');
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        // if we can reach it, add buttons to trace and guardrail elements
        // currently disabled as the traceview endpoint is not yet enabled on explorer
        changeElements(document.querySelectorAll('div.language-trace'), 'traceview?trace')
        changeElements(document.querySelectorAll('div.language-guardrail'), 'playground?policy')
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
});