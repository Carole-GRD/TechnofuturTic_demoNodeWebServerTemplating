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
// Import du module 'ejs' permettant de générer du html
const ejs = require('ejs');
// Import du module 'path' permettant de faciliter la génération de chemins
const path = require('path');
// Import du moduel 'file system' pour gérer les fichiers
const fs = require('fs');



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

    // console.log(requestUrl);
    // console.log(requestQuery);
    // console.log(requestMethod);

    // Gestion du dossier public et des différents types de fichiers
    // Création du path
    const filePublic = path.resolve('public' + requestUrl);
    // console.log('Searching file : ', filePublic);

    // Si la route n'est pas '/' et si le fichier existe bien
    if(requestUrl !== '/' && fs.existsSync(filePublic)) {
        // On lit le fichier
        const file = fs.readFileSync(filePublic);
        // console.log(file);

        // On récupère l'extension du fichier
        // console.log(filePublic);
        // path.extname(pathFichier) -> renvoie l'extension du fichier
        // on fait un replace pour enlever le . devant l'extension
        const extension = path.extname(filePublic).replace('.', '');
        // console.log(extension);

        // Selon l'extension : traitement
        let contentType = '';
        if (['gif', 'png', 'jpeg', 'bmp', 'webp', 'svg'].includes(extension)) {
            contentType = 'image/' + extension;
        }
        else  if (extension === 'css') {
            contentType = 'text/css'
        }
        // Envoi de la réponse
        res.writeHead(200, {
            "Content-type" : contentType
        });
        // On envoie le fichier dans la réponse,
        // Si c'était une image, elle sera traitée comme telle puisque dans Content-type il y a 'image/[extension]'
        // Si c'était du css, il sera traité comme tel puisque dans Content-type il y a 'txt/css'
        res.end(file);
        return;
    }

    // Définition des différents comportements en fonction des routes(url) et de la méthode
    if ( requestUrl === '/' && requestMethod === 'GET' ) {
        // Home page
        console.log('Bienvenue sur la Home Page !');
        const title = 'Accueil';
        const pageCSS = '/styles/home.css';
        // Création des données à afficher
        const today = new Date().toLocaleDateString('fr-be', { dateStyle: 'long' });
        const trainers = [
            { firstname: 'Aude', lastname: 'Beurive' },
            { firstname: 'Pierre', lastname: 'Santos' },
            { firstname: 'Aurelien', lastname: 'Strimelle' }
        ]

        // Utilisation d'ejs pour rendre la vue
            // Génération du path
            const filename = path.resolve('views', 'home.ejs');
            // Création des datas àenvoyer à la vue
            // const data = {
            //     today : today,
            //     trainers : trainers
            // }
            // ↕ raccourci
            const data = { pageCSS, title, today, trainers }  
            // ↑ On fournit un objet qui contient today et notre tableau de formateurs
            // Rendu de la vue
            // renderFile :
                // 1er param : chemin vers le fichier ejs
                // 2e param : Data à lui envoyer
                // 3eparam : Callback (err, render) {}
                    // err -> si erreur lors du rendu (fichier introuvable, autre)
                    // render -> si pas d'erreur, le rendu se trouvedans render
            // A partir du chemin, des datas, on renvoi une chaine qui contient tout le html à afficher
            ejs.renderFile(filename, data, (err, render) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('Rendu Home Page effectué !');
                // console.log(render);
                // Envoi de la réponse (res -> response)
                    // Contenant la "vue" à afficher
                res.writeHead(200, {
                    "Content-type" : "text/html"  // On précise qu'on renvoie du html
                })
                res.end(render); // On termine la requête en fournissant les donnéesà afficher dans la réponse

            })
    }
    else if ( requestUrl === '/contact' ) {
        if ( requestMethod === 'GET' ) {
            // Contact Papge
            console.log('Bienvenue sur la Contact Page');
            const title = 'Contact';
            const pageCSS = '/styles/contact.css';
            const data = {pageCSS, title};
            // Rendu ejs
            // Récupération du chemin vers le fichier ejs
            const filename = path.resolve('views', 'contact.ejs');
            ejs.renderFile(filename, data, (err, render) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('Rendu Contact Page effectué !');
                // Envoi de la réponse
                res.writeHead(200, {
                    "Content-type" : "text/html"  
                })
                res.end(render);
            })  
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
    else if ( requestUrl === '/about' ) {
        // console.log(requestUrl);
        if ( requestMethod === 'GET' ) {
            console.log('Bienvenue sur la About Page !');
            const title = 'À propos';

            const pageCSS = '/styles/about.css';

            const person = {   
                lastName: 'Gérard', 
                firstName: 'Carole',
                gender: 'F',
                birthDate: new Date(1978, 2, 16),
                courses: ['Algorithme', 'React', 'Node', 'Angular']
            };


            const data = { pageCSS, title, person };
                

            const filename = path.resolve('views', 'about.ejs');
            ejs.renderFile(filename, data, (err, render) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('Rendu About Page effectué !');
                // Envoi de la réponse
                res.writeHead(200, {
                    "Content-type" : "text/html"  
                })
                res.end(render);
            })

        }
    }
    else {
        // route inexistante
        // Page 404
        const filename = path.resolve('views', 'notfound.ejs');
        ejs.renderFile(filename, (err, render) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Erreur 404');
            res.writeHead(200, {
                "Content-type" : "text/html"
            });
            res.end(render);
        })  
    }
});



// Lancement du server
app.listen(process.env.PORT, () => {
    console.log(`Server started on port: ${process.env.PORT}`);
})
