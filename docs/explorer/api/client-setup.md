# Client Setup

The SDK exposes a `Client` class. To create an object of this type, you need two variables: the Invariant API endpoint URL and the API key.

## Getting the API Key
Navigate to the <img class='inline-invariant' src="site:assets/logo.svg"/> [Invariant Explorer](https://explorer.invariantlabs.ai) and create an account via GitHub Sign-In.

Once you have created an account, go to your [User Settings](https://explorer.invariantlabs.ai/settings) and generate an API key.

Make note of your API key, as you will need it to authenticate your uploads. If you're running in a shell, you can export the API key now as an environment variable:

## Setting Up Environment Variables

Navigate to your shell and export the API key as an environment variable. You can optionally set the API endpoint URL as an environment variable as well, which allows you to use private instances of Explorer.

```bash
export INVARIANT_API_ENDPOINT=https://explorer.invariantlabs.ai
# Add the API key here.
export INVARIANT_API_KEY=YourAPIKey
```

## Creating a Client

In your Python code, you can create an `AsyncClient` (which exposes asynchronous methods) or a `Client` (which exposes synchronous methods) object. This object will use the environment variables you set up earlier to authenticate your uploads.

```python
from invariant_sdk.async_client import AsyncClient

client = AsyncClient()
```

Without parameters, the `AsyncClient` object will automatically use the environment variables you set up earlier and the default Explorer instance at `https://explorer.invariantlabs.ai`.

To create a sync client:

```python
from invariant_sdk.client import Client

client = Client()
```


## Overriding Environment Configuration

If you want to override the environment configuration or use a different API key, you can also pass the API endpoint URL and API key as arguments to the `AsyncClient` constructor directly.

```python
from invariant_sdk.async_client import AsyncClient

client = AsyncClient(
    api_url="https://explorer.invariantlabs.ai",
    # Add the API key here.
    api_key="YourAPIKey",
)
```

For the sync `Client` type:

```python
from invariant_sdk.client import Client

client = Client(
    api_url="https://explorer.invariantlabs.ai",
    # Add the API key here.
    api_key="YourAPIKey",
)
```
