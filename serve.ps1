$port = 8080
$path = (Get-Location).Path

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "HTTP Server listening on http://localhost:$port/"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8";
    ".css"  = "text/css; charset=utf-8";
    ".js"   = "application/javascript; charset=utf-8";
    ".json" = "application/json; charset=utf-8";
    ".png"  = "image/png";
    ".jpg"  = "image/jpeg";
    ".svg"  = "image/svg+xml";
    ".ico"  = "image/x-icon";
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $reqUrl = $request.Url.LocalPath
        if ($reqUrl -eq "/" -or [string]::IsNullOrWhiteSpace($reqUrl)) {
            $reqUrl = "/index.html"
        }

        # Handle POST submissions to contact.php
        if ($request.HttpMethod -eq "POST" -and $reqUrl -like "*contact.php*") {
            try {
                $bodyReader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
                $postData = $bodyReader.ReadToEnd()
                $bodyReader.Dispose()

                Write-Host "[CONTACT FORM SUBMISSION] Received requirements for bijuworld99@gmail.com: $postData" -ForegroundColor Green
            } catch {}

            $jsonResponse = '{"success":true,"message":"Mail successfully sent!"}'
            $respBytes = [System.Text.Encoding]::UTF8.GetBytes($jsonResponse)

            $response.StatusCode = 200
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $respBytes.Length
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.OutputStream.Write($respBytes, 0, $respBytes.Length)
            $response.OutputStream.Flush()
            $response.Close()
            continue
        }

        # Clean path and decode URL
        $cleanPath = [System.Uri]::UnescapeDataString($reqUrl.TrimStart('/'))
        $localFilePath = Join-Path $path $cleanPath

        if (Test-Path $localFilePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localFilePath).ToLower()
            $contentType = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) {
                $contentType = $mimeTypes[$ext]
            }

            $bytes = [System.IO.File]::ReadAllBytes($localFilePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.OutputStream.Flush()
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $notFound.Length
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
            $response.OutputStream.Flush()
        }
        $response.Close()
    } catch {
        # Loop continues
    }
}
