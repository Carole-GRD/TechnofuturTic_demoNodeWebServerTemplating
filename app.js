// Configuration des variables d'environnement grâce à dotenv
// const dotenv = require('dotenv');
// dotenv.config();
// ↕ raccourci
require('dotenv').config();


// Import du module Node 'http' permettant de créer un server Web
const http = require('http');
// Import du module 'url' permettant de découper (parser) notre req.url
const url = require('url');
// Import du module 'querystring' permettant de parser les datas de notre POST
const querystring = require('querystring');


// Création du server
// const server = http.createServer(...);
// → dans le cas où on appelle le fichier d'entré "server.js" au lieu de "app.js"
const app = http.createServer((req, res) => {
    // Récupération des infos de la route (dans req)
    // console.log(req);
    // console.log(req.url);
    // console.log(req.method);

    // url de la requête
    const requestUrl = url.parse(req.url).pathname;
    // query de la requête si présents
    const requestQuery = url.parse(req.url).query;
    // method de la requête (get ou posr)
    const requestMethod = req.method;

    console.log(requestUrl);
    console.log(requestQuery);
    console.log(requestMethod);

    // Définition des différents comportements en fonction des routes et de la méthode
    if ( requestUrl === '/' && requestMethod === 'GET' ) {
        // Home page
        console.log('Bienvenue sur la Home Page !');

        // Création des données à afficher
        const today = new Date().toLocaleDateString('fr-be', { dateStyle: 'long' });
        const trainers = [
            { firstname: 'Aude', lastname: 'Beurive' },
            { firstname: 'Pierre', lastname: 'Santos' },
            { firstname: 'Aurelien', lastname: 'Strimelle' }
        ]
        let acc2 ='';
        trainers.forEach(trainer => {
            acc2 += `<li>${trainer.firstname} ${trainer.lastname}</li>`;
            return acc2;
        })


        // Création de la "vue" à afficher
        const contentHome = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Mon super site</title>
            </head>
            <body>
                <h1>Bienvenue sur la page d'accueil ✨</h1>
                <h2>Nous sommes le ${today} </h2>
                <ul>
                    ${ trainers.reduce( (acc, trainer) => {
                        acc += `<li>${trainer.firstname} ${trainer.lastname}</li>`;
                        return acc;
                    }, '' ) }
                </ul>
                <ul>
                    ${acc2}
                </ul>

                <a href="/contact">Contactez-moi ✉</a>
            </body>
            </html>
        `;

        // Envoi de la réponse (res -> response)
            // Contenant la "vue" à afficher
        res.writeHead(200, {
            "Content-type" : "text/html"  // On précise qu'on renvoie du html
        })
        res.end(contentHome); // On termine la requête en fournissant les donnéesà afficher dans la réponse

    }
    else if ( requestUrl === '/contact' ) {
        if ( requestMethod === 'GET' ) {
            // Contact Papge
            console.log('Bienvenue sur la Contact Page');

            // Création du contenu html
            const contentContact = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Contact</title>
                </head>
                <body>
                    <h1>Formulaire de contact 📫</h1>
                    <form method="POST">
                        <div>
                            <label for="pseudo">Votre Pseudo : </label>
                            <input id="pseudo" name="pseudo" type="text" />
                        </div>
                        <div>
                            <label for="msg">Votre message : </label>
                            <textarea id="msg" name="msg"></textarea>
                        </div>
                        <button type="submit">Envoyer 📩</button>
                        <!-- <input type="submit" value="Envoyer 📩" /> -->
                    </form>
                </body>
                </html>
            `; 

            // Envoi de la réponse
            res.writeHead(200, {
                "Content-type" : "text/html"  
            })
            res.end(contentContact);

        }
        else if ( requestMethod === 'POST') {
            // Récupération du form Contact
            // Récupération des données du formulaire
            let data = '';
            // event déclenché à la réception des datas
            req.on('data', (form) => {
                console.log('Form : ', form);
                data += form.toString('utf-8');
                console.log('Data : ', data);
            })
            // event déclenché après avoir reçu toutes les données
            req.on('end', () => {
                // Traitement des données
                console.log('End : ', data);
                // Convertion des données (grâce à )
                const result = querystring.parse(data);
                console.log('Data after parsing : ', result);
                // C'est ensuite à partir de cet objet, qu'on fait insert en DB

                // Traitement de la response (res)
                // Redirection vers la page de notre choix
                res.writeHead(301, {
                    "Location" : "/"   // Renverra vers la homepage
                })
                res.end();
            })
        }
    }
    else {
        // route inexistante
        // Page 404
        const content404 = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact</title>
        </head>
        <body>
            <h1>Erreur 404 🤔</h1>
           
        </body>
        </html>
    `; 
        console.log('Erreur 404');
        res.writeHead(200, {
            "Content-type" : "text/html"
        });
        res.end(content404);
    }
});



// Lancement du server
app.listen(process.env.PORT, () => {
    console.log(`Server started on port: ${process.env.PORT}`);
})
