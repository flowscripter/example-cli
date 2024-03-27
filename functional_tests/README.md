## Executable Functional Tests

#### Setup

Ensure the executable is built:

    deno compile --allow-env --output /tmp/example-cli ../mod.ts

Install requirements:

    pip3 install -r pip-requirements.txt

#### Testing

Run the functional tests:

    export EXECUTABLE=/tmp/example-cli
    behave
