//Rules

//Retability
export const getRentability = (price, newPrice) => {
    let response = {};

    price = parseFloat(price);
    newPrice = parseFloat(newPrice);

    if(newPrice > price){
        response["rent"]    = "Ótima";
        response["color"]   = "limegreen";
    } else if((newPrice > (price * .9)) && (newPrice <= price)){
        response["rent"]    = "Boa";
        response["color"]   = "dodgerblue";
    } else if(newPrice < price){
        response["rent"]    = "Ruim";
        response["color"]   = "firebrick";
    }

    return response;
}

//Float to price String
export const getStringFloat = (value) => {
    value = parseFloat(value);
    return "$" + value.toFixed(2).toString().replace('.', ',');
}

//Date to masked String
export const getStringDate = (d) => {
    const date  = new Date(d);
    let dd      = date.getDate();
    let mm      = date.getMonth() + 1;
    let yyyy    = date.getFullYear();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;            
    
    return dd + '/' + mm + '/' + yyyy;  
}