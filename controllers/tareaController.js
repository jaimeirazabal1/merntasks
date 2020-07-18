const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');
const { validationResult } = require('express-validator');


//crea una nueva tarea
exports.crearTarea = async (req,res) =>{
    //revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errores:errors.array()})
    }
    // console.log(req.body)
    // extraer el proyecto y comprobar si existe
    const {proyecto} = req.body;
    try {
        const proyectoValidar = await Proyecto.findById(proyecto);
        console.log(proyectoValidar);
        if(!proyectoValidar){
            return res.status(404).json({msg:'Proyecto no encontrado'});
        }

        //revisar si el proyecto actual pertenece al usuario autenticado
        if(proyectoValidar.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:"No autorizado"})
        }

        //creamos la tarea
        const tarea = new Tarea(req.body);
       
        await tarea.save();
        res.json({tarea});
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');
    }
}

//obtener tareas
exports.obtenerTareas = async (req,res) =>{
    try {
        const {id} = req.params;
        const proyectoValidar = await Proyecto.findById(id);
        console.log(proyectoValidar);
        if(!proyectoValidar){
            return res.status(404).json({msg:'Proyecto no encontrado'});
        }

        //revisar si el proyecto actual pertenece al usuario autenticado
        if(proyectoValidar.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:"No autorizado"})
        }

        //obtener las tareas por proyecto
        const tareas = await Tarea.find({proyecto:id});
        res.json({tareas});

    }catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');
    }
}

//actualizar tarea
exports.actualizarTarea = async (req,res)=>{
    //revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errores:errors.array()})
    }
        // extraer el proyecto y comprobar si existe
    const {proyecto,estado, nombre, usuario} = req.body;
    const nuevoTarea = {};
    try {
        const proyectoValidar = await Proyecto.findById(proyecto);
        // console.log(proyectoValidar);
        if(!proyectoValidar){
            return res.status(404).json({msg:'Proyecto no encontrado'});
        }

        //revisar si el proyecto actual pertenece al usuario autenticado
        // console.log('usuario._id',usuario._id)
        // console.log('proyectoValidar.creador.toString()',proyectoValidar.creador.toString())
        if(proyectoValidar.creador.toString() != usuario._id){
            return res.status(401).json({msg:"No autorizado"})
        }

        const tareaExiste = await Tarea.findById(req.params.id);
        if(!tareaExiste){
            return res.status(404).json({msg:'No existe esa tarea'});
        }

        //creamos la tarea
   
        if(nombre){
            nuevoTarea.nombre = nombre;
        }
        nuevoTarea.estado = estado;
        nuevoTarea.proyecto = proyecto;
        console.log('nuevoTarea',nuevoTarea)
        tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id }, {$set: nuevoTarea},{ new: true})
       
        await tarea.save();
        res.json({tarea});
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');
    }
}

//borrar tarea

exports.borrarTarea = async (req,res) =>{
    try {
        //revisar el id
        let tarea = await Tarea.findById(req.params.id);
        
        //si el proyecto existe o no
        if(!tarea){
            return res.status(404).json({msg:"Tarea no encontrada"})
        }
        //verificar el creador del proyecto
        let proyecto = await Proyecto.findById(tarea.proyecto);
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:"No autorizado"})
        }
        //eliminar el proyecto
        await Tarea.findOneAndRemove({_id:req.params.id});
        res.json({msg:'Tarea eliminada'});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor')        
    }
}