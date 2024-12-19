function padout(number) { return (number < 10) ? '0' + number : number; }

function Easter(Y) {
    var C = Math.floor(Y/100);
    var N = Y - 19*Math.floor(Y/19);
    var K = Math.floor((C - 17)/25);
    var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
    I = I - 30*Math.floor((I/30));
    I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
    var J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);
    J = J - 7*Math.floor(J/7);
    var L = I - J;
    var M = 3 + Math.floor((L + 40)/44);
    var D = L + 28 - 31*Math.floor(M/4);

    return new Date(padout(M) + '.' + padout(D) + '.' + Y);
}

// Check if we are in the easter period (14 days before easter, or 4 days after easter)
export const isEaster = () => {
    const easter = Easter(new Date().getFullYear());
    const easterBeginning = new Date(easter);
    easterBeginning.setDate(easter.getDate() - 14);
    const easterEnd = new Date(easter);
    easterEnd.setDate(easter.getDate() + 4);
    
    const today = new Date()
    return today >= easterBeginning && today <= easterEnd
}

export const isChristmas = () => {
    const today = new Date()
    return today.getMonth() === 11
}