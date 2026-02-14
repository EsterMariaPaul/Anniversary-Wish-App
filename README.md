# 💕 Anniversary Experience App 💕

A beautiful, shareable web-based interactive anniversary experience built with Flask, HTML, CSS, and JavaScript.

## Features

- **🏠 Landing Screen**: Beautiful greeting with instant access to the experience
- **📸 Photo Gallery**: Display your favorite photos and memories (easily customizable)
- **💌 Love Letters**: Handwritten messages and promises to your partner
- **📅 Timeline**: Your relationship milestones and important dates
- **🎮 Interactive Games**:
  - **Love Meter**: Measure your love with an interactive slider
  - **Question Game**: Answer questions about your relationship
  - **Love Quiz**: Test how well you know your partner
- **📱 Responsive Design**: Works beautifully on mobile and desktop
- **🚀 Fast & Shareable**: Single URL, no login, no database

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Python Flask
- **Database**: None (all content is hardcoded - easy to customize)

## Setup & Installation

## Security & Privacy

 - This app intentionally has **no database**, **no authentication**, and **no credentials** required.
 - All content (wishes, quiz questions, acceptable answers, and final messages) is hard-coded in the project files (`templates/index.html` and `static/script.js`).
 - Recipients accessing the shared URL receive only the rendered HTML/CSS/JS served by Flask — there is no server-side user data storage or account system.
 - Do NOT include secrets or private API keys in these files. If you add third-party services (music hosting, analytics), configure them carefully and avoid exposing credentials in the repo.

## Privacy Notes

 - The experience is designed for personal sharing and trust-based surprises. It is not an exam or secure verification system.
 - If you need end-to-end privacy (e.g., protect content from being viewed by intermediaries), use an encrypted tunnel or host the site on a secure server with HTTPS.

### Prerequisites
- Python 3.7+
- pip (Python package manager)

### Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Run the App

```bash
python app.py
```

The app will start at `http://localhost:5000`

### Step 3: Share the Link

**For Local Network Sharing:**

To share with others on your network, modify `app.py`:

```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

Then find your computer's IP address:
- **Windows**: Open Command Prompt and run `ipconfig` (look for IPv4 Address)
- **Mac/Linux**: Open Terminal and run `hostname -I`

Share the URL: `http://YOUR_IP:5000`

**For Internet Sharing:**

Use a tunnel service like:
- [ngrok](https://ngrok.com) - `ngrok http 5000`
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)

Example local run commands (copy/paste):

```bash
cd Anniversary
pip install -r requirements.txt
python app.py
```

If the Flask server doesn't appear to respond, ensure no other process is using port 5000 and your firewall allows local access.

## Customization

### Edit Content

Open `templates/index.html` and modify:
- **Landing message**: Change the title and subtitle
- **Photo Gallery**: Replace placeholder cards with real images
- **Love Letters**: Write your own messages
- **Timeline**: Update milestones and dates
- **Quiz Questions**: Personalize the quiz with real questions about you two

### Add Images

1. Create a `static/images` folder
2. Add your images there
3. In the HTML, replace the gradient placeholders with actual image paths:

```html
<img src="{{ url_for('static', filename='images/photo1.jpg') }}" alt="Memory">
```

### Customize Colors

Edit `static/style.css` and change the gradient colors. Current theme:
- Primary gradient: `#667eea` to `#764ba2` (purple)
- Accent colors throughout the CSS

## File Structure

```
Anniversary/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── style.css         # Styling
    └── script.js         # Interactive functionality
```

## Usage Tips

1. **Personalize everything**: This is a template - add your photos, dates, and memories
2. **Mobile friendly**: Test on phone for the best experience
3. **No internet required**: Works fully offline once loaded
4. **Shareable**: Send one link and they can experience it instantly

## API Endpoints

- `GET /` - Serves the main anniversary experience page

That's it! No login, no database, no complexity.

## Browser Compatibility

Works on all modern browsers:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Free to use and modify for personal use.

## Support

For questions or to customize further, feel free to edit the HTML/CSS/JS files directly. Everything is commented and straightforward!

---

Made with 💕 to celebrate your special day!
