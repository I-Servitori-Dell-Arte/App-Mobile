const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer');
const Tessera = require("../../models/tessera");
const crypto = require('crypto');
const tessera = require("../../models/tessera");
const JWT_SECRET_KEY = process.env.TOKEN_KEY

function generateTempCode() {
  const length = 6; 
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; 
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }

  return code;
}

function generateAuthToken(data){
  const token = jwt.sign(data, JWT_SECRET_KEY, { expiresIn: '365d' })
  return token
};

async function sendTempCodeEmail(email, code) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'mattianoris23@gmail.com',
      pass: 'lnkcjxwpypzqcyhr',
    },
  });

  const mailOptions = {
    from: 'mattianoris23@gmail.com',
    to: email,
    subject: 'Codice Temporaneo',
    text: `Il tuo codice temporaneo è: ${code}`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Email inviata: ${info.response}`);
};

module.exports.sendMailReset = async (req, res) => {
  try {
    console.log(req.body);
    const { email } = req.body;
    const user = await User.findOne({email});
    
    if (!user) throw new Error('User not found');
    let tempCode = generateTempCode();
    user.resetCode = tempCode;

    await user.save();
    await sendTempCodeEmail(user.email, tempCode);

    res.json({
      success: true,
      status: 200,
      message: "Email inviata"
    })
    
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      status: 400,
      message: "Errore",
    })
  }
}

module.exports.verifyCode = async (req, res) => {
  try {
    const { code, email, password } = req.body;
    const user = await User.findOne({email});

    if (!user) {
      res.json({
        message: 'Utente non trovato',
        success: false,
        status: 400
      })
    }

    if (user.resetCode == code){

      const passCrypt = await bcrypt.hash(password, 10);
      user.resetCode = "";
      user.password = passCrypt;
      await user.save();

      res.json({
        success: true,
        status: 200,
        message: "OK"
      })      
    } else {
      res.json({
        success:false,
        message: 'Codice non corrisponde',
        status: 400,
      })
    }

  } catch (error) {
    console.log(error);
    res.json({
      message: 'Error',
      status: 400,
      success: false,
    })
  }
}

module.exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;
    let user = await User.findOne({ email }).populate('tessera');

    if (!user) {
      return res.json({
        success: true,
        status: 400,
        message: "user does not exist with this email and password",
      });
    }

    // bcrypting the password and comparing with the one in db
    if (await bcrypt.compare(password, user.password)) {

      const token = generateAuthToken({_id : user?._id, email : email})
      user.token = token
      user.save()

      return res.json({
        success: true,
        status: 200,
        message: "user Logged in",
        data: user,
      });
    }
    return res.json({
        success: false,
        status: 400,
        message: "user credentials are not correct",
    })

  } catch (error) {
    return res.send(error.message);
  }
};

module.exports.register = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password, name, userType, numTessera } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "email or password is empty",
      });
    }
    req.body.password = await bcrypt.hash(password, 10);
    const tessera = await Tessera.findOne({numeroTessera: numTessera});
    if (!tessera){
      console.error('Non trovata')
    }
    const user = new User(req.body);

    user.tessera = tessera._id;
    tessera.user = user._id;
    await tessera.save();
    await user.save();
    return res.json({
      success: true,
      message: "user registered successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.send(error.message);
  }
};

module.exports.updateUser = async (req, res) => {
  try {

    const userDataToBeUpdated = req.body;
    const { id } = req.query;
    const user = await User.findOne({ _id: id });

    if (!user) return res.send("user does not exist");

    let updatedUser = await User.findOneAndUpdate(
      { _id: id },
      userDataToBeUpdated,
      { new: true }
    );

    return res.json({
      success: true,
      message: "user updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.send("error : ", error.message);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await User.findOne({ _id: id });
    if (!user) return res.status(200).send("user does not exist");

    await User.findOneAndDelete({ _id: id });
    
    return res.json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports.userById = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await User.findOne({_id : id})
    if(!user) return res.send("user does not exist")

    return res.json({
        success : true,
        message : "user deleted successfully",
        data : user
    })

    }catch(error){
        return res.send("error : ", error.message)
    }
}

module.exports.resetPassword = async (req, res) => {

    try{
        const {password, newPassword} = req.body;
        const {id} = req.query
    
        if(!password || !newPassword || !id) return res.send("I campi sono vuoti")
    
        let user = await User.findOne({_id : id})
    
        if(!user) return res.send("L'utente non esiste")
    
        // comparing the password from the password in DB to allow changes
        if(bcrypt.compare(password, user?.password)){
            // encrypting new password 
            user.password = await bcrypt.hash(newPassword,10)
            user.save()
            return res.json({
                success : true,
                message : "password updated successfully"
            })
        }

        return res.json({
            success : false,
            message : "wrong password"
        })

    }catch(error){
        return res.send(error.message)
    }
    
}
