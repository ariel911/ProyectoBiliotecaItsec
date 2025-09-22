const bcrypt=require('bcryptjs')



const encrypt = async(textPlain) =>{
    const hash = await bcrypt.hash(textPlain,10)
    return hash
}

const compare = async(passwordPlain,hasPassword)=>{
    return await bcrypt.compareSync(passwordPlain, hasPassword)
}


module.exports = {
    encrypt, compare
}