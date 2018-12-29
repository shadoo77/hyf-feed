
const validator = require('validator');
const moment = require('moment');

const parentProperties = ['link', 'location', 'market_date', 'price', 'size', 'sold'];
const locationProps = ['address', 'city', 'coordinates', 'country'];
const coordinatesProps = ['lat', 'lng'];
const priceProps = ['currency', 'value'];
const sizeProps = ['gross_m2', 'rooms'];

// Check if one of property is existed
function hasProperties(obj, props) {
    for (var i = 0; i < props.length; i++) {
        if (!obj.hasOwnProperty(props[i])) {
            return false;
        }
    }
    return true;
}

// Check all properties
function hasAllProperties(obj) {
    const cond1 = hasProperties(obj, parentProperties);
    let cond2, cond3, cond4, cond5;
    if(cond1) {
        cond2 = hasProperties(obj.location, locationProps);
        if(cond2) cond3 = hasProperties(obj.location.coordinates, coordinatesProps);
        else return false;
        cond4 = hasProperties(obj.price, priceProps);
        cond5 = hasProperties(obj.size, sizeProps);
    }else return false;
    
    if(cond1 && cond2 && cond3 && cond4 && cond5) return true;
     return false;
}

// This to check the numbers value or string of number
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// Check if the market_date is a valid date
function dateValidation(date) {
    const isValid = moment(date).isValid();
    if(!isValid) return false;
    const now = moment();
    return moment(date).isBefore(now) ? true : false;
}

// Check a valid string like address or country
function stringValidation(str, method) {
    const simpleStringRegex = /^[a-zA-Z\s.]{3,50}$/;
    const addressRegex = /[a-zA-Z0-9.\s,()'-]{3,150}$/;
    const currencyRegex = /^.{3,9}$/;
    if(method === 'address') {
        return str.match(addressRegex);
    }else if(method === 'currency') {
        return str.match(currencyRegex);
    }
    else return str.match(simpleStringRegex);
}

// Validation function
const validation = (obj) => {
    let process = {
        messages : [],
        valid: true
    };
    if(!hasAllProperties(obj)) {
        process.messages = ["One or more required's properties is missing!"];
        process.valid = false;
    }else {
        const {link, market_date, location, size, price, sold} = obj;
        process.messages = [];
        if(!validator.isURL(link)) {
            process.messages.push('Invalid link');
            process.valid = false;
        }
        if(!dateValidation(market_date)) {
            process.messages.push('Invalid market date');
            process.valid = false;
        }
        if(!stringValidation(location.address, 'address')) {
            process.messages.push('Invalid address');
            process.valid = false;
        }
        if(!stringValidation(location.city)) {
            process.messages.push('Invalid city');
            process.valid = false;
        }
        if(!stringValidation(location.country)) {
            process.messages.push('Invalid country');
            process.valid = false;
        }
        if(!isNumeric(location['coordinates']['lat']) ||
        !isNumeric(location['coordinates']['lng'])) {
            process.messages.push('Invalid coordinates');
            process.valid = false;
        }
        if(!stringValidation(price.currency, 'currency')) {
            process.messages.push('Invalid currency');
            process.valid = false;
        }
        if(typeof price.value !== 'number') {
            process.messages.push('Invalid price value , it should be a number');
            process.valid = false;
        }
        if(price.value === 0) {
            process.messages.push('Invalid price value, cannot be Zero!');
            process.valid = false;
        }
        if(typeof size.gross_m2 !== 'number' || size.gross_m2 < 1) {
            process.messages.push('Invalid area , it should be a number');
            process.valid = false;
        }
        if(typeof size.rooms !== 'number' || size.rooms < 1) {
            process.messages.push('Invalid rooms value!');
            process.valid = false;
        }
        if(typeof sold !== 'boolean') {
            process.messages.push('Invalid sold , it should be boolean');
            process.valid = false;
        }
    }
    return process;
};

// let final = [];
// let err = [];
// data.forEach((el, i) => {
//     let process = validation(el);
//     if(process.valid) final.push(el);
//     else {
//         const report = {
//             id: i + 1,
//             messages: process.messages
//         }
//         err.push(report);
//     }
// });


const normalization = (obj) => {
    const {description, title, images} = obj;
    let newObj = {...obj};
    newObj.description = description.trim() ? description.trim() : null;
    newObj.title = title.trim() ? title.trim() : null;
    newObj.images = [];
    if(Array.isArray(images)){
        images.forEach(img => {
            validator.isURL(img) ? newObj.images.push(img) : null;
        });
    }else {
        const imgArr = images.split(',');
        if(imgArr.length >= 1) {
            imgArr.forEach(img => {
                validator.isURL(img) ? newObj.images.push(img) : null;
            });
        }
    }
    return newObj;
};

module.exports = {validation, normalization};


