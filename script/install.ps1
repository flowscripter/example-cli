# Set exit on error
$ErrorActionPreference = "Stop"

# URL of the ZIP file containing the executable
$zipUrl = "https://github.com/flowscripter/example-cli/releases/latest/download/example-cli_Windows_x86_64.zip"
$installDir = "$env:ProgramFiles\example-cli"

# Create a temporary directory to download the ZIP
$tempDir = [System.IO.Path]::Combine($env:TEMP, "flowscripter_install")
New-Item -ItemType Directory -Force -Path $tempDir

# Download the ZIP file
Write-Host "Downloading example-cli..."
Invoke-WebRequest -Uri $zipUrl -OutFile "$tempDir\executable.zip"

# Extract the ZIP file
Write-Host "Extracting the ZIP file..."
Expand-Archive -Path "$tempDir\executable.zip" -DestinationPath $tempDir -Force

# Install the executable
Write-Host "Installing the executable..."
Move-Item -Path "$tempDir\example-cli.exe" -Destination $installDir -Force

# Add the executable to the system PATH (for all users)
$env:Path += ";$installDir"
[Environment]::SetEnvironmentVariable("Path", $env:Path, [System.EnvironmentVariableTarget]::Machine)

# Clean up temporary files
Remove-Item -Recurse -Force $tempDir

Write-Host "✅ Installation complete! You can now run 'example-cli' from any command prompt."
