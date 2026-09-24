## Purpose

Visitors can understand and control the language of the current alerts.surf interface in Spanish or English across the public and beta views.

## ADDED Requirements

### Requirement: Initial interface language
The frontend SHALL use an explicitly saved supported language when one exists. Otherwise it SHALL use Spanish when the browser's primary language begins with `es`, English when another primary language is reported, and Spanish when no language is reported.

#### Scenario: Spanish browser language
- **WHEN** a first-time visitor opens the app with `es-ES` as the browser's primary language
- **THEN** the interface is displayed in Spanish

#### Scenario: Non-Spanish browser language
- **WHEN** a first-time visitor opens the app with `fr-FR` as the browser's primary language
- **THEN** the interface is displayed in English

#### Scenario: No browser language
- **WHEN** a first-time visitor opens the app without a reported browser language
- **THEN** the interface is displayed in Spanish

### Requirement: Language switch
The frontend SHALL expose a visible Spanish/English switch on the public landing page and authenticated dashboard. Switching SHALL update the current interface without reloading and remember the explicit selection for later visits on the same device.

#### Scenario: Switch from Spanish to English
- **WHEN** a visitor selects English from the switch
- **THEN** the current view changes to English and a later visit on that device opens in English

#### Scenario: Switch while authenticated
- **WHEN** an authenticated visitor changes language in the dashboard
- **THEN** the dashboard and subsequent landing or login view use that language

### Requirement: Current interface copy follows language
The frontend SHALL render its current landing, preview, login, status, and dashboard interface copy in the selected language. Brand names, place names, model names, measurements, and data supplied by the backend SHALL keep their original values unless they are known interface labels.

#### Scenario: Landing and preview
- **WHEN** the visitor selects Spanish or English on the landing page
- **THEN** visible headings, navigation, actions, explanatory copy, preview labels, and status messages follow the selected language

#### Scenario: Login and dashboard
- **WHEN** a visitor opens the login form and enters the dashboard
- **THEN** form labels, errors, tabs, loading messages, and dashboard labels follow the selected language

### Requirement: Document language
The frontend SHALL set the page's HTML language to the selected language and update it when the selection changes.

#### Scenario: Language changes
- **WHEN** the visitor changes the interface language from Spanish to English
- **THEN** the document's `lang` attribute changes from `es` to `en`
