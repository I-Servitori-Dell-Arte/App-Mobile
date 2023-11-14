const User = require('../../models/user');
const nodemailer = require('nodemailer');

module.exports.addPartecipazione = async (req, res) => {
    try {
      const selectedUsers = req.body.selectedUsers; 
  
      for (const userId of selectedUsers) {
        const user = await User.findById(userId);
  
        if (user) {
          user.partecipazione += 1;
          user.partecipazione5 += 1;
  
          await user.save();
        }
      }
  
      res.status(200).json({
        success: true,
        message: "Partecipazione aggiornata con successo per gli utenti selezionati",
      });
    } catch (error) {
      console.error(error);
  
      res.status(500).json({
        success: false,
        message: "Errore durante l'aggiornamento della partecipazione",
      });
    }
  };

module.exports.ottieniSconto = async (req, res) => {
    try {
      const {id, email} = req.body;

      const user = await User.findById(id);
  
      if (user) {
        user.partecipazione5 = 0;
        user.scontoGratis = true;

        await user.save();

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'mattianoris23@gmail.com', // Inserisci il tuo indirizzo email
            pass: 'lnkcjxwpypzqcyhr', // Inserisci la tua password email
          },
        });
  
        const mailOptions = {
          from: 'mattianoris23@gmail.com',
          to: 'mattianoris.business@gmail.com', //email
          subject: 'Sconto ottenuto!',
          text: 'Grazie per la tua partecipazione. Hai ottenuto lo sconto sulla tessera!',
        };
  
        await transporter.sendMail(mailOptions);


        res.status(200).json({
          success: true,
          message: 'Sconto inviato!',
          data: user,
        })
      } else {
        res.status(404).json({
          success: false,
          message: 'Utente non trovato',
        })
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Errore durante la cancellazione del sconto',
      })
    }
  }

module.exports.ottieniTessera = async (req, res) => {
    try {
      const {id, email} = req.body;

      const user = await User.findById(id);
  
      if (user) {
        user.partecipazione = 0;
        user.tesseraGratis = true;
        
        await user.save();

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'mattianoris23@gmail.com', // Inserisci il tuo indirizzo email
            pass: 'lnkcjxwpypzqcyhr', // Inserisci la tua password email
          },
        });
  
        const mailOptions = {
          from: 'mattianoris23@gmail.com',
          to: 'mattianoris.business@gmail.com',
          subject: 'Ottieni la tessera gratuita!',
          text: 'Grazie per la tua partecipazione. Hai ottenuto una tessera gratuita, ti basterà avvisare il team de I Servitori dell\'Arte!',
        };
  
        await transporter.sendMail(mailOptions);


        res.status(200).json({
          success: true,
          message: 'Sconto inviato!',
          data: user,
        })
      } else {
        res.status(404).json({
          success: false,
          message: 'Utente non trovato',
        })
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Errore durante la cancellazione del sconto',
      })
    }
}  

  