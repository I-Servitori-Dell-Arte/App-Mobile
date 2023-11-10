const Tessera = require("../../models/tessera"); // Assicurati che Tessera sia il nome del tuo modello
const User = require("../../models/user"); // Assicurati che User sia il nome del tuo modello
const tesseraModel = require('../../models/tessera');

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUniqueTesseraNumber() {
  const randomNumber1 = generateRandomNumber(100, 999);
  const randomNumber2 = generateRandomNumber(100, 999);
  const randomNumber3 = generateRandomNumber(100, 999);
  
  const uniqueTesseraNumber = `${randomNumber1}${randomNumber2}${randomNumber3}`;
  
  return uniqueTesseraNumber;
}

module.exports.createTessera = async (req, res) => {
    console.log(req.body);
  try {
    const { user, email, name, dataNascita, residenza, codiceFiscale, cellulare } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.json({
        success: false,
        message: "Utente non trovato",
      });
    }

    const today = new Date();
    const scadenza = new Date(today);
    scadenza.setFullYear(scadenza.getFullYear() + 1);

    const numeroTessera = generateUniqueTesseraNumber();

    const tessera = new Tessera({
      user: existingUser._id,
      email,
      name,
      dataNascita,
      residenza,
      codiceFiscale,
      cellulare,
      dataScadenza: scadenza.toISOString(), 
      numeroTessera: numeroTessera,
    });

    await tessera.save();

    existingUser.tessera = tessera._id;

    await existingUser.save();

    return res.json({
      success: true,
      message: "Tessera creata con successo",
      data: tessera,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Errore durante la creazione della tessera",
      error: error.message,
    });
  }
};

module.exports.createTesseraAdmuin = async (req, res) => {
try {
  const { name, residenza, cellulare, numeroTessera } = req.body;

  const today = new Date();
  const scadenza = new Date(today);
  scadenza.setFullYear(scadenza.getFullYear() + 1);

  const tessera = new Tessera({
    name,
    residenza,
    cellulare,
    dataScadenza: scadenza.toISOString(), 
    numeroTessera: numeroTessera,
  });

  await tessera.save();

  return res.json({
    success: true,
    message: "Tessera creata con successo",
    data: tessera,
  });
} catch (error) {
  return res.status(500).json({
    success: false,
    message: "Errore durante la creazione della tessera",
    error: error.message,
  });
}
};

module.exports.getTessere = async (req, res) => {
  try {

    const tessere = await Tessera.find();

    return res.json({
      success: true,
      data: tessere,
      });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Errore durante il get delle tessere",
      error: error.message,
    });
  }
}

module.exports.deleteTessera = async (req, res) => {

  try{

      const {id} = req.query;
      
      // check if product exist with the given product id
      const tessera = await Tessera.findOne({_id : id});
      if(!tessera){
          return res.json({
              success : false,
              message : "Il prodotto non esiste",
          })
      }
      await tessera.delete();

      return res.json({
          success : true,
          message : "Prodotto eliminato correttamente",
      })

  }catch(error){
      return res.send(error.message)
  } 
}

module.exports.updateTessera = async (req, res) => {
  try{

      const {id} = req.query;
      const {email, name, numeroTessera, dataScadenza, residenza, cellulare} = req.body;

      // check if product exist with the given product id
      const tessera = await Tessera.findOne({_id : id});

      if(!tessera){
        return res.json({
          success : false,
          status : 500,  
          message : "Il prodotto non esiste",
      });
      }


          tessera.email = email;
          tessera.name = name;
          tessera.numeroTessera = numeroTessera;
          tessera.cellulare = cellulare;
          tessera.dataScadenza = dataScadenza;
          tessera.residenza = residenza;

          await tessera.save();

          return res.json({
              success : true,
              status : 200,  
              message : "product updated successfully",
              data : tessera
          });
  }catch(error){
    console.log(error);
      return res.send(error.message)
  }
}

module.exports.associaTessera = async (req, res) => {
  try {
    const { email, name, numeroTessera, dataScadenza } = req.body;

    const tessere = await Tessera.find();
    const tessera = tessere.filter((item) => item.numeroTessera == numeroTessera);
    console.log(tessera);

    return res.json({
      success: true,
      status: 200,
      message: 'Associazione andata a buon fine.'
    })
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      status: 500,
      message: 'Associazione non andata a buon fine.'
    })
  }
}