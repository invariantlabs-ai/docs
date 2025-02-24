# Self-Host Explorer

<div class='subtitle'>Use the self-hosted version of Explorer for local use</div>

Next to the managed cloud deployment of <img class='inline-invariant' src="../assets/logo.svg"/> [Invariant Explorer](https://explorer.invariantlabs.ai), you can also run a self-hosted version of Explorer for local use.

This allows you to keep your traces private while still benefiting from the visualization and analysis features of Explorer. The self-hosted version of Explorer is available as a Docker Composer setup that you can run on your local machine.

> **Note** The self-hosted version of Explorer is intended for local use and is not recommended for production deployments. For production use of a shared Explorer instance, please use the [managed cloud instance](https://explorer.invariantlabs.ai).

<br/>

## 1. Setup Docker and Docker Compose on Your Machine

First, install [Docker Compose](https://docs.docker.com/compose/install/) on your machine and make sure the docker service is running.

## 2. Install the `invariant-ai` Package

First, install the Invariant package in your local Python environment:

```bash
pip install invariant-ai
```

This package includes the utility scripts to launch the self-hosted version of Explorer.

## 3. Run the `invariant explorer` command

To start the self-hosted version of Explorer, run the following command:

```bash
invariant explorer
```

This will pull and launch the required Explorer Docker containers on your machine. The images are build as configured in the open-source [Explorer repository](https://github.com/invariantlabs-ai/explorer).

> **Arguments** You can specify the `--port` or `--version` in the command to change the port or use a different version of Explorer (e.g. `main` or a previous version). You can also specify alternative compose commands such as `up -d` or `down` to start or stop the Explorer containers.

<br/>

## Using the Self-Hosted Explorer

The self-hosted version of Explorer is configured to run on `http://localhost`. You can access it in your browser at this address. The local instance provides the same API as the managed cloud instance, so you can use the [Invariant SDK](./api/client-setup) to connect to it.

### Storage

The self-hosted version of Explorer will create a `data/` directory in the current working directory to store traces and other data.

### Usage and Access

You can access the self-hosted version of Explorer at `http://localhost`. To use it with the [Invariant SDK](./api/client-setup) you can set the `INVARIANT_API_ENDPOINT` environment variable to `http://localhost/`. For security reasons, you'll still need to create and provide an API key to access the self-hosted version of Explorer.

### Updates
`invariant explorer` will automatically check for updates and pull the latest stable version of the Explorer Docker images. If you want to try the latest development version, you can use the `--version=main` flag. Note however, that database migrations may be required when switching between versions, which may not always be backwards compatible.

### Troubleshooting and Support

If you encounter any issues with the self-hosted version of Explorer, please refer to the [Explorer repository](https://github.com/invariantlabs-ai/explorer) for more information or open an issue there.

If you are interested in private, managed cloud deployments of Explorer, please contact us at [explorer@invariantlabs.ai](mailto:explorer@invariantlabs.ai) for more information.