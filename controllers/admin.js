const mongoose = require('mongoose');

const { validationResult } = require('express-validator/check');

const Admin = require('../models/globalData');

//nav bar
exports.getNav = (req,res,next) => {
    res.status(200).json({ message: 'Get Navbar successfully' });
}

exports.addNav = (req, res, next) => {
    const errors = validationResult(req);
    
    const links = req.body.nav.links;
     if(!errors.isEmpty()) {
         console.log(errors.array());
     }
}

exports.updateNav = (req, res, next) => {

}

exports.deleteNav = (req, res, next) => {

}

//header 

exports.getHeader = (req, res, next) => {

}

exports.addHeader = (req, res, next) => {

}

exports.updateHeader = (req, res, next) => {

}

exports.deleteHeader = (req, res,next) => {

}

//footer
exports.getFooter = (req, res, next) => {

}

exports.addFooter = (req, res, next) => {

}

exports.updateFooter = (req, res, next) => {

}

exports.deleteHeader = (req, res, next) => {

}

