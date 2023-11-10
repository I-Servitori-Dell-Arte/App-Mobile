const User = require('../../models/user');

module.exports.addPartecipazione = async (req, res) => {
    try {
      const selectedUsers = req.body.selectedUsers; 
  
      for (const userId of selectedUsers) {
        const user = await User.findById(userId);
  
        if (user) {
          user.partecipazione += 1;
  
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