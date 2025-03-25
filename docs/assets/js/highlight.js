BASE_URL = 'http://localhost/';

function changeTraceElements(codeElements) {
    // Add a button to each pre element
    codeElements.forEach(function(codeElement) {
        const pre = codeElement.firstElementChild;
        const button = pre.firstElementChild;
        
        if (button) {
            // create a new button
            const new_button = document.createElement('button');
            new_button.className = 'btn-invariant';
            new_button.title = 'View in Explorer';
            
            // insert the button after the last button
            pre.insertBefore(new_button, button.nextElementSibling);
            
            // Add click handler to the button
            new_button.addEventListener('click', function() {
                // Get only the text content from the pre element
                const textContent = codeElement.textContent || codeElement.innerText;
                
                // Create base64 encoded parameter
                const encodedContent = btoa(textContent);
                
                // replace codeElement with an iframe
                const iframe = document.createElement('iframe');
                iframe.src = `${BASE_URL}traceview?trace=${encodedContent}`;
                iframe.width = '100%';
                iframe.height = '500px';
                codeElement.replaceWith(iframe);
            });
        }

    });
}


function changeGuardrailElements(codeElements) {
    // Add a button to each pre element
    codeElements.forEach(function(codeElement) {
        const pre = codeElement.firstElementChild;
        const button = pre.firstElementChild;
        
        if (button) {
            // create a new button
            const new_button = document.createElement('button');
            new_button.className = 'btn-invariant';
            new_button.title = 'View in Explorer';
            
            // insert the button after the last button
            pre.insertBefore(new_button, button.nextElementSibling);
            
            // Add click handler to the button
            new_button.addEventListener('click', function() {
                // Get only the text content from the pre element
                const textContent = codeElement.textContent || codeElement.innerText;
                
                // Create base64 encoded parameter
                const encodedContent = btoa(textContent);
                
                // replace codeElement with an iframe
                const iframe = document.createElement('iframe');
                iframe.src = `${BASE_URL}traceview?trace=${encodedContent}`;
                iframe.width = '100%';
                iframe.height = '500px';
                codeElement.replaceWith(iframe);
            });
        }

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
        changeTraceElements(document.querySelectorAll('div.language-trace'))
        changeGuardrailElements(document.querySelectorAll('div.language-guardrail'))
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
});