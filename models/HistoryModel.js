const { ObjectId } = require('mongodb');
const connectDB = require('../config/database');

const obtenerAnalisisUsuarios = async (usuario) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('analisis');

    const resultados = await collection.aggregate([
        { $match: { ID_USUARIO: ObjectId(usuario) } },
        {
            $lookup: {
                from: 'cosecha_mecanica',
                localField: '_id',
                foreignField: 'ID_ANALISIS',
                as: 'cosecha_mecanica'
            }
        },
        {
            $lookup: {
                from: 'aplicaciones_aereas',
                localField: '_id',
                foreignField: 'ID_ANALISIS',
                as: 'aplicaciones_aereas'
            }
        },
        {
            $lookup: {
                from: 'fertilización',
                localField: '_id',
                foreignField: 'ID_ANALISIS',
                as: 'fertilización'
            }
        },
        {
            $lookup: {
                from: 'herbicidas',
                localField: '_id',
                foreignField: 'ID_ANALISIS',
                as: 'herbicidas'
            }
        },
        {
            $project: {
                ID_ANALISIS: '$_id',
                ID_USUARIO: 1,
                TIPO_ANALISIS: 1,
                FECHA_CREACION: 1,
                NOMBRES_FINCA: {
                    $switch: {
                        branches: [
                            { case: { $eq: ['$TIPO_ANALISIS', 'cosecha_mecanica'] }, then: { $arrayElemAt: ['$cosecha_mecanica.NOMBRE_FINCA', 0] } },
                            { case: { $eq: ['$TIPO_ANALISIS', 'APLICACIONES_AEREAS'] }, then: { $arrayElemAt: ['$aplicaciones_aereas.NOMBRE_FINCA', 0] } },
                            { case: { $eq: ['$TIPO_ANALISIS', 'FERTILIZACION'] }, then: { $arrayElemAt: ['$fertilización.NOMBRE_FINCA', 0] } },
                            { case: { $eq: ['$TIPO_ANALISIS', 'HERBICIDAS'] }, then: { $arrayElemAt: ['$herbicidas.NOMBRE_FINCA', 0] } }
                        ],
                        default: null
                    }
                }
            }
        }
    ]).toArray();

    return resultados;
}

const obtenerUltimosValores = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('configuraciones_formulario');

    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });

    return resultado;
}

module.exports = {
    obtenerAnalisisUsuarios,
    obtenerUltimosValores
}