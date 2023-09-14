const { Router } = require ('express');
const router = Router();
const admin = require('firebase-admin');



var serviceAccount = require("../../usuarios-1c3db-firebase-adminsdk-2m63o-3258759614.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://usuarios-1c3db-default-rtdb.firebaseio.com/'

});

 const db = admin.database();
 
// Ruta para mostrar el formulario de inicio de sesión
router.get('/', (req, res) => {
    res.render('login') // Pasa la configuración a la vista
});

router.post('/add', (req,res)=>{
    res.render('Signup')
})

router.post('/authenticate', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;


    db.ref('usuarios').once('value',(snapShot)=>{
        const usuarios= snapShot.val();
        let isAuthenticated=false;

        for(const userId in usuarios){
            if(usuarios[userId].email === email && usuarios[userId].password === password){

                isAuthenticated=true
                break
            }
        }
    
        if (isAuthenticated) {
        // El usuario es válido, puedes permitir el acceso o redirigir a una página de éxito.
        res.render('index'); // Cambia 'login-success' al nombre de tu vista de éxito.
        } else {
        // Las credenciales no son válidas, puedes mostrar un mensaje de error o redirigir a una página de error.
        console.log('usuario no valido')
        res.render('login'); // Cambia 'login-error' al nombre de tu vista de error.
        }
    });
});

router.post('/new-contact', (req, res) => {
    const newcontact = {
        email: req.body.email,
        password: req.body.password
    }
    db.ref('usuarios').push(newcontact);
    /*console.log(`Email: ${newcontact.email}, Password: ${newcontact.password}`);*/
    res.render('login');
});

module.exports = router;
