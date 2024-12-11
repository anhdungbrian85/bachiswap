const welcomeHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Screen</title>
    <style>
        body {
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 50px;
        }
        h1 {
        color: #4CAF50;
        }
        ul {
        list-style-type: none;
        padding: 0;
        }
        li {
        background-color: #f4f4f4;
        margin: 10px;
        padding: 10px;
        border-radius: 5px;
        }
    </style>
    </head>
    <body>
    <h1>Welcome to BachiSwap BACKEND!</h1>
    </body>
    </html>
`;
const WelcomeController = {
    toHtml: (req, res) => {
        res.send(welcomeHTML);
    },
};

module.exports = WelcomeController;
