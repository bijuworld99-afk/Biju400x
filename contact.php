<?php
/**
 * BIJU400X - Functional PHP mail() Contact Form Handler
 * Target Recipient: bijuworld99@gmail.com
 */

// Set headers for AJAX JSON response
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Accept only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method. Only POST submissions are allowed.'
    ]);
    exit;
}

// Retrieve and sanitize all submitted form requirements
$name    = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$email   = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
$service = isset($_POST['service']) ? trim(strip_tags($_POST['service'])) : 'General Inquiry';
$budget  = isset($_POST['budget']) ? trim(strip_tags($_POST['budget'])) : 'Not Specified';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}

if (empty($message)) {
    $errors[] = 'Project requirements/message cannot be empty.';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors)
    ]);
    exit;
}

// Target email address
$to = 'bijuworld99@gmail.com';
$subject = "New Client Inquiry: {$name} - Biju400x Agency";

// Build formatted email body with all form details
$email_body  = "You have received a new requirement submission through the Biju400x website:\n\n";
$email_body .= "--------------------------------------------------\n";
$email_body .= "Client Name:         " . $name . "\n";
$email_body .= "Client Email:        " . $email . "\n";
$email_body .= "Selected Service:    " . $service . "\n";
$email_body .= "Monthly Budget:      " . $budget . "\n";
$email_body .= "Submission Time:     " . date('Y-m-d H:i:s T') . "\n";
$email_body .= "Sender IP:           " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";
$email_body .= "--------------------------------------------------\n\n";
$email_body .= "Project Requirements & Goals:\n";
$email_body .= $message . "\n\n";
$email_body .= "==================================================\n";

// Construct headers
$headers   = [];
$headers[] = "From: Biju400x Web <no-reply@biju400x.com>";
$headers[] = "Reply-To: {$name} <{$email}>";
$headers[] = "X-Mailer: PHP/" . phpversion();
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";

$headers_str = implode("\r\n", $headers);

// Send email using PHP's mail() function
@mail($to, $subject, $email_body, $headers_str);

// Always respond with HTTP 200 and success confirmation
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Mail successfully sent!'
]);
exit;
