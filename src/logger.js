const {createLogger, format , transports }= require('winston');
const { combine, timestamp, prettyPrint } = format;
const logger = createLogger({
    level:'info',
    format: combine(
        timestamp({format:()=> new Date().toLocaleString()}),
        prettyPrint()
    ),
    defaultMeta:{service:'user-service'},
    transports:[
        new transports.File({filename:'deleted.log',level:'warn'}),
        new transports.File({filename:'error.log', level:'error'}),
        new transports.File({filename:'combined.log'}),
        
    ],
});

module.exports = {logger};