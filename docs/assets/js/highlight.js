BASE_URL = 'http://localhost/';

function changeTraceElements(codeElements) {
    // Add a button to each pre element
    codeElements.forEach(function(codeElement) {
        
        // replace the code element with an iframe
        const textContent = codeElement.textContent || codeElement.innerText;
        const encodedContent = btoa(textContent);
        const iframe = document.createElement('iframe', { id: 'traceview-' + encodedContent });
        iframe.src = `${BASE_URL}traceview?trace=${encodedContent}`;
        codeElement.replaceWith(iframe);
   
        window.addEventListener('message', function(event) {
            if (event.data.type === 'resize') {
              console.log('resize', event.data);
              iframe.style.height = event.data.height + 'px';
            }
          });
        
    });
}


document.addEventListener('DOMContentLoaded', function() {
    // check if BASE_URL is defined and reachable
    fetch(`${BASE_URL}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        // if we can reach it, add buttons to trace and guardrail elements
        // currently disabled as the traceview endpoint is not yet enabled on explorer
        //changeTraceElements(document.querySelectorAll('div.language-trace'))
        //changeGuardrailElements(document.querySelectorAll('div.language-guardrail'))
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
});