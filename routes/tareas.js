// rutas para proyectos
const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController')
const { check } = require('express-validator');
const auth = require('../middleware/auth');

//crea tareas
//api/tareas
router.post('/', 
    auth,
    [
        check('nombre','El nombre de la es obligatorio').not().isEmpty(),
        check('proyecto','El proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
)
//obtener todos las tareas por proyecto
router.get('/:id', 
    auth,
    tareaController.obtenerTareas
)
// actualizar tarea por id
router.put('/:id',
    auth,
    [
        check('nombre','El nombre de la tarea es obligatorio').not().isEmpty(),
        check('estado','El estado es obligatorio').not().isEmpty(),
        check('proyecto','El proyecto obligatorio').not().isEmpty()
    ],
    tareaController.actualizarTarea
)
// eliminar un tarea
router.delete('/:id',
    auth,
    tareaController.borrarTarea
)


module.exports = router;