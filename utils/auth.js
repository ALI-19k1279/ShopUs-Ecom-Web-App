import jwt from 'jsonwebtoken'

const signToken=(user)=>{
    return jwt.sign(user,'secretsecret',{
        expiresIn:'30d',
    });
};

export {signToken}