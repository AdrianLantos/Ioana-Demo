<?php
/**
 * Contact Form Mail Handler
 * Processes contact form submissions and sends emails
 */

// Security headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Metodă nepermisă.'
    ]);
    exit;
}

// Rate limiting to prevent spam - session-based approach
session_start();
$current_time = time();
$rate_limit_window = 60; // 1 minute
$max_submissions = 3;

if (!isset($_SESSION['form_submissions'])) {
    $_SESSION['form_submissions'] = [];
}

// Clean old submissions
$_SESSION['form_submissions'] = array_filter(
    $_SESSION['form_submissions'],
    function($timestamp) use ($current_time, $rate_limit_window) {
        return ($current_time - $timestamp) < $rate_limit_window;
    }
);

// Check rate limit
if (count($_SESSION['form_submissions']) >= $max_submissions) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'Prea multe încercări. Vă rugăm așteptați un minut și încercați din nou.'
    ]);
    exit;
}

// Retrieve and sanitize form data
$name = isset($_POST["name"]) ? strip_tags(trim($_POST["name"])) : '';
$email = isset($_POST["email"]) ? filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL) : '';
$phone = isset($_POST["phone"]) ? strip_tags(trim($_POST["phone"])) : '';
$message = isset($_POST["message"]) ? trim($_POST["message"]) : '';
$gdpr_consent = isset($_POST["gdprConsent"]) && $_POST["gdprConsent"] === 'true';

// Validation
$errors = [];

// Validate name
if (empty($name)) {
    $errors[] = 'Numele este obligatoriu.';
} elseif (strlen($name) < 2) {
    $errors[] = 'Numele trebuie să conțină cel puțin 2 caractere.';
}

// Validate email
if (empty($email)) {
    $errors[] = 'Adresa de email este obligatorie.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Vă rugăm să introduceți o adresă de email validă.';
}

// Validate phone (optional but if provided, should be valid)
if (!empty($phone)) {
    if (!preg_match('/^[0-9+\s\-()]{10,}$/', $phone)) {
        $errors[] = 'Vă rugăm să introduceți un număr de telefon valid (minim 10 cifre).';
    }
}

// Validate message
if (empty($message)) {
    $errors[] = 'Mesajul este obligatoriu.';
} elseif (strlen($message) < 10) {
    $errors[] = 'Mesajul trebuie să conțină cel puțin 10 caractere.';
}

// Validate GDPR consent
if (!$gdpr_consent) {
    $errors[] = 'Trebuie să acceptați politica de confidențialitate pentru a trimite formularul.';
}

// Check for spam (simple honeypot and timing check)
if (isset($_POST['website']) && !empty($_POST['website'])) {
    // Honeypot field filled - likely spam
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Cerere invalidă.'
    ]);
    exit;
}

// If there are validation errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Există erori în formular.',
        'errors' => $errors
    ]);
    exit;
}

// Set the recipient email address
$recipient = "office@balog-stoica.com";

// Set the email subject
$email_subject = "Mesaj nou de pe site - de la " . $name;

// Build the email content (plain text)
$email_content = "Ați primit un mesaj nou de pe site-ul Balog & Stoica.\n\n";
$email_content .= "Detalii contact:\n";
$email_content .= "Nume: " . $name . "\n";
$email_content .= "Email: " . $email . "\n";
if (!empty($phone)) {
    $email_content .= "Telefon: " . $phone . "\n";
}
$email_content .= "\nMesaj:\n" . $message . "\n";
$email_content .= "\n---\n";
$email_content .= "Consimțământ GDPR: Acceptat\n";
$email_content .= "Data: " . date('d.m.Y H:i:s') . "\n";

// Set the email headers
$email_headers = "From: \"Contact Site\" <via@balog-stoica.com>\r\n";
$email_headers .= "Reply-To: " . $email . "\r\n";
$email_headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$email_headers .= "MIME-Version: 1.0\r\n";
$email_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Attempt to send the email
if (mail($recipient, $email_subject, $email_content, $email_headers)) {
    // Log successful submission
    $_SESSION['form_submissions'][] = $current_time;

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Mulțumim pentru mesaj! Vă vom contacta în curând.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Eroare la trimiterea mesajului. Vă rugăm încercați din nou mai târziu sau contactați-ne direct la ' . $recipient . '.'
    ]);
}
?>