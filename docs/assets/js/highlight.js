// if we are on localhost or 127.0.0.1, use the local explorer
BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost/"
    : "https://explorer.invariantlabs.ai/";

function encodeGuardrailURIComponent(content) {
  /**
   * Encodes the content using base64 and then encodes it for URL.
   *
   * @param {string} content - The content to encode.
   *
   */
  return encodeURIComponent(btoa(content));
}

function findExampleTraceElement(codeElement) {
  // check sibling with class language-example-trace
  let exampleTraceElement = codeElement.nextElementSibling;
  if (exampleTraceElement) {
    if (exampleTraceElement.classList.contains("language-example-trace")) {
      return exampleTraceElement;
    }
  }
  return null;
}

function findSnippetTitle(codeElement) {
  let exampleTitleElement = codeElement.previousElementSibling;
  if (exampleTitleElement) {
    if (exampleTitleElement.tagName === "P") {
      let exampleTitle = exampleTitleElement.innerText;
      if (exampleTitle.startsWith("Example:")) {
        let title = exampleTitle.substring(8).trim();
        // remove trailing :
        if (title.endsWith(":")) {
          title = title.substring(0, title.length - 1).trim();
        }
        // remove leading whitespace
        return title;
      }
    }
  }
  return "New Guardrail";
}

function changeElements(codeElements, endpoint, embed = false) {
  // Add a button to each pre element
  codeElements.forEach(function (codeElement) {
    // augment the code element
    let textContent = codeElement.textContent || codeElement.innerText;

    // parse and split contents
    let encodedContent = encodeGuardrailURIComponent(textContent);

    let exampleTraceElement = findExampleTraceElement(codeElement);
    let exampleTraceURIComponent = "";
    if (exampleTraceElement) {
      exampleTraceURIComponent =
        "&input=" +
        encodeGuardrailURIComponent(
          exampleTraceElement.textContent || exampleTraceElement.innerText
        );
    }

    if (!embed) {
      // add links for the ${BASE_URL}/playground?policy=...&input=... (Call it Open In Playground)
      const container = document.createElement("div");
      container.className = "action-links";

      const playgroundLink = document.createElement("a");
      playgroundLink.className = "link open-in-playground";
      playgroundLink.href = `${BASE_URL}${endpoint}=${encodedContent}${exampleTraceURIComponent}`;
      playgroundLink.target = "_blank";
      playgroundLink.innerText = "⏵ Open In Playground";

      const agentLink = document.createElement("a");
      agentLink.className = "link add-to-agent";
      agentLink.href = `${BASE_URL}deploy-guardrail#policy-code=${encodeURIComponent(
        textContent
      )}&name=${encodeURIComponent(findSnippetTitle(codeElement))}`;
      agentLink.target = "_blank";
      agentLink.innerText = "+ Add to Agent";

      container.appendChild(agentLink);
      container.appendChild(playgroundLink);

      codeElement.appendChild(container);
    } else {
      const id = crypto.randomUUID().toString();
      const iframe = document.createElement("iframe", { id: id });
      iframe.src = `${BASE_URL}embed/${endpoint}=${encodedContent}&id=${id}`;
      codeElement.replaceWith(iframe);

      window.addEventListener("message", function (event) {
        //check which element the message is coming from
        if (event.data.type === "resize" && event.data.id === id) {
          iframe.style.height = event.data.height + "px";
        }
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // check if BASE_URL is defined and reachable
  fetch(`${BASE_URL}embed/traceview`)
    .then((response) => {
      if (!response.ok) {
        console.log("Network response was not ok");
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      // if we can reach it, add buttons to trace and guardrail elements
      // currently disabled as the traceview endpoint is not yet enabled on explorer
      changeElements(
        document.querySelectorAll("div.language-trace"),
        "traceview?trace",
        true
      );
      changeElements(
        document.querySelectorAll("div.language-guardrail"),
        "playground?policy"
      );
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
});
