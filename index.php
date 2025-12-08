<?php
/**
 * Generate CSRF token for form security
 */
// Configure secure session cookies
ini_set('session.cookie_httponly', 1); // Prevent JavaScript access
ini_set('session.cookie_secure', 1);   // HTTPS only
ini_set('session.cookie_samesite', 'Strict'); // CSRF protection
session_start();

// Generate CSRF token if it doesn't exist
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Store token in a variable for use in the form
$csrf_token = $_SESSION['csrf_token'];
?>
<!DOCTYPE html>
<html lang="ro">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Balog & Stoica - Societate civilă de avocați | Drept Penal, Societar, Civil</title>

    <!-- SEO Meta Tags -->
    <meta name="description"
        content="Balog & Stoica - Societate Civilă Profesională de Avocați în București. Expertiză în drept penal, white-collar, drept societar, civil și insolvență. Consultanță juridică de înaltă calitate.">
    <meta name="keywords"
        content="avocat București, drept penal, drept societar, drept civil, insolvență, white-collar, compliance, cabinet avocatură, avocat penal București, consultanță juridică">
    <meta name="author" content="Balog & Stoica - SCA">
    <meta name="robots" content="index, follow">
    <meta name="language" content="Romanian">
    <meta name="geo.region" content="RO-B">
    <meta name="geo.placename" content="București">
    <meta name="geo.position" content="44.454730;26.096262">
    <meta name="ICBM" content="44.454730, 26.096262">

    <!-- Canonical URL -->
    <link rel="canonical" href="https://balog-stoica.com/">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://balog-stoica.com/">
    <meta property="og:title" content="Balog & Stoica - Societate civilă de avocați">
    <meta property="og:description"
        content="Societate Civilă Profesională de Avocați specializată în drept penal, white-collar, drept societar și civil. Abordare contemporană, rezultate profesionale.">
    <meta property="og:image" content="https://balog-stoica.com/Assets/Img/logo.svg">
    <meta property="og:locale" content="ro_RO">
    <meta property="og:site_name" content="Balog & Stoica - SCA">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://balog-stoica.com/">
    <meta name="twitter:title" content="Balog & Stoica - Societate civilă de avocați">
    <meta name="twitter:description"
        content="Societate Civilă Profesională de Avocați specializată în drept penal, white-collar, drept societar și civil.">
    <meta name="twitter:image" content="https://balog-stoica.com/Assets/Img/logo.svg">

    <link rel="stylesheet" href="./Assets/general.css">
    <link rel="stylesheet" href="./style.css">
    <link rel="stylesheet" href="./Assets/notification-bar.css">
    <link rel="stylesheet" href="./Assets/map-display.css">
    <link rel="icon" type="image/x-icon" href="./Assets/Img/balog&stoica - favicon.webp">
</head>

<body>
    <!-- JSON-LD Structured Data for SEO -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "LegalService",
        "name": "Balog & Stoica - Societate Civilă Profesională de Avocați",
        "alternateName": "Balog & Stoica SCA",
        "url": "https://balog-stoica.com",
        "logo": "https://balog-stoica.com/Assets/Img/logo.svg",
        "description": "Societate Civilă Profesională de Avocați specializată în drept penal, white-collar, compliance, drept societar, civil și insolvență în București.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Str. Stockholm 19",
            "addressLocality": "București",
            "addressRegion": "București",
            "postalCode": "011786",
            "addressCountry": "RO"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "44.454730",
            "longitude": "26.096262"
        },
        "telephone": ["+40-747-486-549", "+40-754-503-681"],
        "email": "office@balog-stoica.com",
        "priceRange": "$$",
        "areaServed": {
            "@type": "Country",
            "name": "România"
        },
        "serviceType": [
            "Drept Penal",
            "White-collar Crime",
            "Compliance",
            "Drept Societar",
            "Drept Civil",
            "Drept Comercial",
            "Insolvență",
            "Restructurări"
        ],
        "founder": [
            {
                "@type": "Person",
                "name": "Ioana Camelia Balog",
                "jobTitle": "Avocat Co-fondator",
                "email": "ioana@balog-stoica.com",
                "telephone": "+40-747-496-549"
            },
            {
                "@type": "Person",
                "name": "Rareș-Teodor Stoica",
                "jobTitle": "Avocat Co-fondator",
                "email": "rares@balog-stoica.com",
                "telephone": "+40-754-503-681"
            }
        ],
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
        },
        "sameAs": []
    }
    </script>

    <!-- Navigation loaded by components.js -->

    <!-- Main Content -->
    <main>
        <!-- Hero Section -->
        <section class="hero-section" id="home">
            <div class="logo-reveal">
                <img src="./Assets/Img/logo.svg" alt="Balog & Stoica - Societate Civilă Profesională de Avocați">
            </div>
            <div class="hero-background"></div>
        </section>

        <!-- About Section -->
        <section class="about-section  container" id="about">
            <div class="container">
                <h1 class="section-title">O abordare contemporană a avocaturii, menită să răspundă provocărilor actuale.
                </h1>

                <div class="values-grid">
                    <div class="value-card">
                        <h2 class="value-title">Experiența</h2>
                        <p class="value-description">
                            Consolidată prin gestionarea cu succes a unor dosare complexe și sensibile, experiența ne-a
                            arătat că adevărata valoare a unui demers juridic nu stă în volum, ci în atenția acordată
                            fiecărui detaliu. Balog & Stoica – SCA reunește avocați cu un parcurs profesional marcat de
                            rezultate notabile, cu o experiență practică bogată dobândită în medii profesionale de
                            înaltă
                            performanță, animați de aceeași viziune: o avocatură modernă, riguroasă și apropiată de
                            nevoile
                            reale ale clientului.
                        </p>
                    </div>

                    <div class="value-card">
                        <h2 class="value-title">Valorile</h2>
                        <p class="value-description">
                            Seriozitatea, profesionalismul și capacitatea de a găsi soluții inovatoare în fața
                            provocărilor
                            sunt valorile care ne aduc împreună. Fie că este vorba despre consultanță juridică,
                            negociere
                            sau reprezentare în litigii, oferim sprijinul de care fiecare client are nevoie, cu aceeași
                            exigență și grijă pentru detalii.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Team Section -->
        <section class="team-section container" id="team">
            <div class="team-sticky-wrapper">
                <div class="team-sticky-content" id="team-sticky-content">
                    <!-- Team Member 1 -->
                    <div class="team-card">
                        <div class="team-card-content">
                            <h2 class="team-member-name">Avocat Ioana Camelia Balog</h2>
                            <p class="team-member-subtitle">Co-fondator Balog & Stoica – SCA</p>
                            <div class="team-card-image mobile">
                                <img src="./Assets/Img/IOANA BALOG - HOVER_IOANA COLOR.webp"
                                    alt="Avocat Ioana Camelia Balog - Co-fondator Balog & Stoica, specialist drept penal și societar">
                            </div>
                            <div class="team-member-bio">
                                <p>Ioana și-a construit cariera în jurul pasiunii pentru drept penal și a convingerii că
                                    drepturile fundamentale trebuie apărate cu responsabilitate și curaj. Cu experiență
                                    în
                                    numeroase cauze complexe, de la infracțiuni economice, de serviciu sau de corupție,
                                    până
                                    la fapte de drept comun, abordează fiecare speță cu rigoare și profesionalism.
                                </p>

                                <p>Practica penală, alături de o înțelegere solidă a mediului de afaceri, îi permite să
                                    ofere consultanță societară în constituiri, reorganizări și fuziuni, cu atenție la
                                    implicațiile juridice și economice. Se remarcă prin analiză minuțioasă, gândire
                                    strategică și comunicare eficientă, considerând că succesul profesional rezultă din
                                    echilibrul dintre exigență, empatie și perseverență.
                                </p>
                            </div>


                            <div class="team-member-credentials">
                                <div class="credentials-column">
                                    <p>Avocat în cadrul Baroului București</p>
                                    <p>Facultatea de Drept, Universitatea Babeș-Bolyai</p>
                                    <p>Master Științe Penale, Universitatea din București</p>
                                    <p>Radboud University, Nijmegen, Olanda</p>
                                </div>
                                <div class="credentials-column">
                                    <p>Drept penal și drept penal al afacerilor
                                    </p>
                                    <p>Drept societar</p>
                                </div>
                            </div>


                            <div class="team-member-contact">
                                <a href="mailto:ioana@balog-stoica.com" class="contact-email">ioana@balog-stoica.com
                                </a>
                                <a href="tel:+40747496549" class="contact-phone">+40 747 496 549</a>
                            </div>
                        </div>

                        <div class="team-card-image desktop">
                            <img src="./Assets/Img/IOANA BALOG - HOVER_IOANA COLOR.webp"
                                alt="Avocat Ioana Camelia Balog - Co-fondator Balog & Stoica, specialist drept penal și societar">
                        </div>
                    </div>

                    <!-- Team Member 2 -->
                    <div class="team-card" id="rares-card">
                        <div class="team-card-content">
                            <h2 class="team-member-name">Avocat Rareș-Teodor Stoica</h2>
                            <p class="team-member-subtitle">Co-fondator Balog & Stoica – SCA</p>
                            <div class="team-card-image mobile">
                                <img src="./Assets/Img/IOANA BALOG - HOVER_RARES COLOR.webp"
                                    alt="Avocat Rareș-Teodor Stoica - Co-fondator Balog & Stoica, specialist drept penal și litigii civile">
                            </div>
                            <div class="team-member-bio">
                                <p>Rareș consideră că succesul în avocatură se bazează pe determinare, dedicare și
                                    creativitate, tratând fiecare cauză cu respect pentru complexitatea ei și cu
                                    responsabilitate față de client.
                                    Și-a concentrat parcursul profesional în dreptul penal, pe care îl îmbină cu o bună
                                    înțelegere a mediului de afaceri și a litigiilor civile moderne.
                                </p>

                                <p>A gestionat dosare penale complexe, cu aspecte ce au necesitat strategie și analiză
                                    detaliată, iar în paralel reprezintă clienți în litigii civile cu miză ridicată.
                                </p>

                                <p>Este apreciat pentru atenția la detalii, claritatea argumentării și capacitatea de a
                                    construi strategii adaptate fiecărui caz, menținând o comunicare transparentă cu
                                    clienții.
                                </p>
                            </div>


                            <div class="team-member-credentials">
                                <div class="credentials-column">
                                    <p>Avocat în cadrul Baroului București</p>
                                    <p>Facultatea de Drept, Universitatea București</p>
                                    <p>Master Dreptul Afacerilor, Universitatea din București</p>
                                </div>
                                <div class="credentials-column">
                                    <p>Drept penal și drept penal al afacerilor</p>
                                    <p>Litigii civile</p>
                                    <p>Insolvență</p>
                                </div>
                            </div>


                            <div class="team-member-contact">
                                <a href="mailto:rares@balog-stoica.com " class="contact-email">rares@balog-stoica.com
                                </a>
                                <a href="tel:+40747496550" class="contact-phone">+40 754 503 681</a>
                            </div>
                        </div>

                        <div class="team-card-image desktop">
                            <img src="./Assets/Img/IOANA BALOG - HOVER_RARES COLOR.webp"
                                alt="Avocat Rareș-Teodor Stoica - Co-fondator Balog & Stoica, specialist drept penal și litigii civile">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Services Section -->
        <section class="services-section container" id="services">
            <div class="services-sticky-wrapper">
                <div class="services-sticky-content" id="services-sticky-content">
                    <!-- Service 1 -->
                    <div class="service-card">
                        <h2 class="service-title">Drept Penal și White-collar / Compliance</h2>
                        <div class="service-description">
                            <p>Credem că apărarea drepturilor fundamentale și protecția intereselor persoanelor implică
                                atenție la detalii, analiză strategică și responsabilitate totală. În dreptul penal,
                                fiecare
                                situație trebuie abordată cu respect pentru complexitatea cauzei și pentru consecințele
                                asupra celor implicați, fie că este vorba de persoane fizice sau juridice.</p>

                            <p>În domeniul white-collar și compliance, considerăm că politicile interne gândite
                                strategic și
                                adaptate în funcție de nevoi sunt cheia funcționării sănătoase a companiilor și
                                instituțiilor. Oferim consultanță pentru elaborarea și implementarea politicilor interne
                                de
                                conformitate și integritate, evaluarea riscurilor și gestionarea situațiilor de criză,
                                precum și reprezentare în investigații interne, inspecții, controale sau proceduri
                                penale
                                complexe.
                            </p>
                        </div>
                    </div>

                    <!-- Service 2 -->
                    <div class="service-card">
                        <h2 class="service-title">Drept Societar</h2>
                        <div class="service-description">
                            <p>Vedem dreptul societar ca pe un mecanism de structurare și prevenție. Operațiunile care
                                privesc o societate precum înființarea și reorganizarea societăților, modificările
                                statutare
                                (capital, organe de conducere, obiect de activitate, sediu etc.), fuziuni, divizări,
                                cesiuni
                                de părți sociale și acțiuni sau alte proceduri specifice, trebuie gândite astfel încât
                                să
                                asigure stabilitate, claritate și armonie între asociați sau acționari. Intervențiile
                                unui
                                avocat și gestionarea relațiilor dintre asociați și acționari sunt mai degrabă
                                oportunități
                                de prevenire a conflictelor și de întărire a guvernanței, iar fiecare decizie are impact
                                juridic și strategic pe termen lung. </p>
                            <p>Asigurăm redactarea și pregătirea tuturor documentelor necesare, reprezentare în fața
                                Registrului Comerțului și a instanței competente.
                            </p>
                        </div>
                    </div>

                    <!-- Service 3 -->
                    <div class="service-card">
                        <h2 class="service-title">Drept Civil și Comercial,
                            Soluționarea disputelor</h2>
                        <div class="service-description">
                            <p>Considerăm că dreptul civil și comercial nu se reduce la acte și proceduri, ci
                                la înțelegerea reală a obiectivelor clienților și prevenirea problemelor înainte ca
                                acestea
                                să se transforme în litigii. Contractele, negocierile și consultanța trebuie să fie
                                întotdeauna gândite pentru eficiență și siguranță juridică.
                            </p>
                            <p>Litigiile sunt abordate cu aceeași dedicare profesională: fiecare caz implică analiză
                                detaliată, evaluarea riscurilor și soluții personalizate, astfel încât rezultatele să
                                fie
                                concrete și sustenabile. Profesionalismul și implicarea totală asigură că fiecare client
                                beneficiază de claritate și soluții eficiente.
                            </p>
                        </div>
                    </div>

                    <!-- Service 4 -->
                    <div class="service-card">
                        <h2 class="service-title">Insolvență
                            și restructurări</h2>
                        <div class="service-description">
                            <p>Tratăm procedurile de insolvență și restructurare cu o viziune integrată, care îmbină
                                analiza
                                juridică cu înțelegerea realităților economice ale fiecărui caz. Fiecare decizie, de la
                                prevenirea insolvenței până la reorganizare sau lichidare, trebuie să echilibreze
                                protecția
                                intereselor părților implicate cu sustenabilitatea pe termen lung.
                            </p>

                            <p>Reprezentăm atât societăți aflate în dificultate financiară, cât și creditori,
                                investitori
                                ori administratori, oferind sprijin în pregătirea planurilor de reorganizare, analiza
                                raporturilor juridice și economice, contestarea măsurilor dispuse de organele
                                procedurii,
                                precum și în negocierea soluțiilor de redresare. Acordăm de asemenea asistență în
                                procedurile de prevenire a insolvenței: acordul de restructurare și concordatul
                                preventiv.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="contact-section" id="contact">
            <div class="container">
                <h2 class="contact-title">Începe o discuție</h2>

                <form class="contact-form" id="contactForm" novalidate aria-label="Formular de contact">
                    <div class="form-group">
                        <input type="text" id="name" name="name" placeholder="Nume și prenume*" required>
                        <span class="error-message" id="nameError"></span>
                    </div>

                    <div class="form-group">
                        <input type="email" id="email" name="email" placeholder="Adresă email*" required>
                        <span class="error-message" id="emailError"></span>
                    </div>

                    <div class="form-group">
                        <input type="tel" id="phone" name="phone" placeholder="Număr telefon"
                            pattern="[0-9+() \-]{10,}">
                        <span class="error-message" id="phoneError"></span>
                    </div>

                    <div class="form-group">
                        <textarea id="message" name="message" rows="6" placeholder="Mesaj*" required></textarea>
                        <span class="error-message" id="messageError"></span>
                    </div>

                    <div class="form-group gdpr-checkbox">
                        <label class="checkbox-container">
                            <input type="checkbox" id="gdprConsent" name="gdprConsent" required>
                            <span class="checkmark"></span>
                            <span class="checkbox-label">
                                Am citit și sunt de acord cu
                                <a href="PrivacyPolicy/index.html" target="_blank">Politica de confidențialitate</a>
                                și permit prelucrarea datelor mele personale în conformitate cu GDPR.*
                            </span>
                        </label>
                        <span class="error-message" id="gdprError"></span>
                    </div>

                    <!-- HONEYPOT -->
                    <div class="hp-field" style="position: absolute; left: -9999px; top: -9999px;" aria-hidden="true">
                        <label>Leave this field empty</label>
                        <input type="text" name="website" tabindex="-1" autocomplete="off" value="">
                    </div>

                    <!-- CSRF TOKEN -->
                    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrf_token, ENT_QUOTES, 'UTF-8'); ?>">

                    <button type="submit" class="submit-button">TRIMITE</button>
                </form>
                <div class="maps-wrapper">
                    <!-- Map Placeholder (shown before consent) -->
                    <div class="map-placeholder" id="mapPlaceholder">
                        <div class="map-placeholder-content">
                            <div class="map-placeholder-message">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="margin-bottom: 15px;">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                <h3>Hartă Google Maps</h3>
                                <p>Pentru a încărca harta interactivă, acceptați cookie-urile Google Maps în setările de confidențialitate.</p>
                                <p class="map-address"><strong>Adresa noastră:</strong><br>
                                Str. Stockholm nr. 19, Sector 1<br>
                                București, 011786, România</p>
                                <button class="load-map-btn" id="loadMapConsent">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    Accept Google Maps
                                </button>
                                <p class="map-info">Încărcarea hărții va transmite date către Google (SUA).
                                <a href="PrivacyPolicy/#google-maps" target="_blank">Mai multe informații</a></p>
                            </div>
                        </div>
                    </div>

                    <!-- Map Iframe (loaded after consent) -->
                    <div class="map-iframe-container" id="mapIframe" style="display: none;">
                        <!-- Iframe will be injected here by JavaScript -->
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer loaded by components.js -->

    <!-- Scripts -->
    <script src="./Assets/user-preferences.js"></script>
    <script src="./Assets/map-embed.js"></script>
    <script src="./Assets/components.js"></script>
    <script src="./script.js"></script>

</body>

</html>