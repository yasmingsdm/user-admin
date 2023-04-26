
const {comparePassword } = require("../helpers/hashPassword")
const User = require("../models/users")
const excel = require("exceljs");


const loginAdmin = async (req, res)=>{
    try {
        const {email, password} = req.body
        if(!email || !password){
            return  res.status(404).json({message: 'Some information is missing'})
        }
        const alreadyAnUser = await User.findOne({email})
        if(!alreadyAnUser){
            return  res.status(400).json({message: 'Sign up first'})
        }
        if(alreadyAnUser.is_admin === 0){
            res.status(400).json({message: 'Not an admin'})
        }

        const checkPassword = await comparePassword(password, alreadyAnUser.password)
        if(!checkPassword){
            res.status(400).json({message: 'Wrong password'})
        }
        req.session.userId = alreadyAnUser._id
        res.status(200).json({message: 'login ok'}) 
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}

const logoutAdmin = (req, res)=>{
    try {
        req.session.destroy()
        res.clearCookie('admin_session')
        res.status(200).json({message: 'logout ok'}) 
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}

const getAllUsers = async(req, res)=>{
    try {
        const allUsers = await User.find({is_admin: 0})
        res.status(200).json({message: 'users list', allUsers}) 
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}

const deleteUser = async(req, res)=>{
    try {
        const {id}= req.params
        await User.findByIdAndDelete(id)
        res.status(200).json({message: 'user deleted'}) 
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}


const exportExcel = async(req, res)=>{
    try {
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Users");

        worksheet.columns = [
        { header: "Id", key: "id" },
        { header: "Name", key: "name" },
        { header: "Email", key: "email" },
        { header: "is_admin", key: "is_admin"},
        { header: "is_banned", key: "is_banned"},
        { header: "image", key: "image"},
        ];

        const userData = await User.find({is_admin: 0})
        userData.map(user=>{
            worksheet.addRows(user)
        })

        worksheet.getRow(1).eachCell(cell=>{
            cell.font = {bold: true}
        })

        // res is a Stream object
        res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "users.xlsx")
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}


module.exports = {loginAdmin, logoutAdmin, getAllUsers, deleteUser, exportExcel}