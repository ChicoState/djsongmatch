This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Building and Running the Docker Container

If you don't have Docker, make sure you download it first.
Then, make sure Docker is running. If you get a Docker daemon error, it means Docker is not running.

Now, to build the Docker container, use the following command:
```bash
docker build -t djsongmatch .
```

Once the Docker container is built, run it using the following command:
```bash
docker run -p 3000:3000 djsongmatch
```

Note: building the container may take a while. It doesn't always need to re-built, only in specific scenarios which include: modifying Dockerfile, changing dependencies in package.json or package-lock.json, and modifying drizzle.config.ts.