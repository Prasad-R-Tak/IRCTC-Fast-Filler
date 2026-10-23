IRCTC Fast Filler 🚆
A Chrome extension built with JavaScript, HTML, and CSS to help users fill passenger details on IRCTC booking forms more quickly. It stores a reusable passenger profile locally in the browser and provides standard and Tatkal-oriented fill actions.
Features
- Save contact details and profiles for up to three passengers.
- Store passenger name, age, gender, and berth preference.
- Fill passenger and contact fields on supported IRCTC booking pages.
- Optional checkbox to select Consider for Upgradation when the matching option is found.
- Optional selection of a BHIM/UPI payment option when a matching radio option is found.
- Optional attempt to click the Next button after filling.
- Chrome Extension Manifest V3 architecture.
Tech Stack
- JavaScript
- HTML and CSS
- Chrome Extensions API (Manifest V3)
- chrome.storage.local for local profile storage
- Content scripts and chrome.scripting
Project Structure
form-filler/
├── manifest.json
├── background.js
├── content_script.js
├── popup.html
└── popup.js
Installation (Developer Mode)
1. Download or clone this repository.
2. Extract the project folder if it was downloaded as a ZIP.
3. Open chrome://extensions/ in Google Chrome.
4. Enable Developer mode.
5. Select Load unpacked.
6. Choose the form-filler project directory containing manifest.json.
7. Open the extension, enter passenger details, and save the profile.
How to Use
1. Open the extension popup.
2. Enter passenger details and contact information.
3. Configure the optional upgradation, UPI, and auto-next settings.
4. Select Save Profile.
5. Open the relevant IRCTC booking page and navigate to the passenger-details form.
6. Use Fill Form Now or Fill + Next (Tatkal Mode).
7. Review every field carefully and complete the booking manually.
Important Notes
- This is a personal productivity/learning project, not an official IRCTC product. It is not affiliated with or endorsed by IRCTC.
- Website layouts and form selectors can change. The extension may need updates if IRCTC changes its interface.
- Automated filling and clicking may not work on every page or booking flow. Always verify the entered data before proceeding.
- The extension does not guarantee ticket availability, booking success, or faster access to tickets.
- Do not store or expose real passenger information in screenshots, demo data, commits, or public issues.
- The extension does not solve CAPTCHAs or bypass booking restrictions. Follow IRCTC's current terms and applicable rules.
Privacy
Passenger and contact details are stored using Chrome's local extension storage. Treat this information as sensitive, and remove saved data when it is no longer needed. Review the source code and browser permissions before using the extension.
Future Improvements
- Add a clear-profile action and stronger input validation.
- Improve form-field detection and show a per-field fill report.
- Add automated tests using mock booking forms.
- Narrow permissions to the minimum required and improve error handling.
License
No license has been specified yet. Add a LICENSE file before allowing reuse or redistribution.
