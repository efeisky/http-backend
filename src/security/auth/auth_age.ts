function getTokenAgeAsMinute(minute : number) {
    return new Date(new Date().setMinutes(new Date().getMinutes() + minute));
}
function getTokenAgeAsDay(day: number) {
    const currentDate = new Date();
    const newDate = new Date(currentDate.setDate(currentDate.getDate() + day));
    return newDate;
}

export {getTokenAgeAsMinute, getTokenAgeAsDay};